import os
import json
import webbrowser
import logging
import threading
import select
from datetime import datetime

import psycopg2
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from postgres_tools import Connection as PgConnection


app = Flask(__name__, static_url_path='')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

app.config['JSON_AS_ASCII'] = False
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

event_index = 0
active_connections = []  # Array containing all currently active connections

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    database = db.Column(db.String(255))
    user = db.Column(db.String(255))
    password = db.Column(db.String(255))
    host = db.Column(db.String(255))
    port = db.Column(db.Integer)

    def __init__(self, name, database, user, password, host, port):
        self.name = name
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port

    def get_connection(self):
        """
        Creates a real connection to the database via postgres_tools.
        Function is currently needed because of missing thread safety.
        """
        return PgConnection(database=self.database, user=self.user, password=self.password, host=self.host, port=self.port)

    def listen_start(self):
        self.connection = self.get_connection()
        self.connection.cur.execute("LISTEN pg_change;")
        active_connections.append(self)
        thread = threading.Thread(target=events, args=(self.connection.con,))
        thread.start()

    def listen_end(self):
        self.connection.cur.execute("UNLISTEN pg_change;")
        self.connection.cur.close()
        self.connection.con.close()


def notify(payload):
    global event_index
    payload["timestamp"] = datetime.now().isoformat()[11:-3]
    payload["index"] = event_index
    socketio.emit('evt', payload)
    event_index += 1


def events(connection):
    while True:
        #If connection is closed from outside an exception is thrown on connection.poll()
        try:
            if select.select([connection],[],[],5) != ([],[],[]):
                seconds_passed = 0
                connection.poll()
                connection.commit()
                while connection.notifies:
                    data = connection.notifies.pop().payload
                    notify(json.loads(data))
        except Exception as e:
            break


class ConnectionSchema(ma.Schema):
    class Meta:
        fields=('id', 'name', 'database', 'user', 'password', 'host', 'port')


connection_schema = ConnectionSchema()
connections_schema = ConnectionSchema(many=True)


def is_connection_valid(connection):
    """
    Checks if connection can be established
    """
    try:
        connection.get_connection()
        return True
    except:
        return False


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/connection/<int:id>/listen-start")
def listen_start(id):
    connection = Connection.query.get(id)
    if is_connection_valid(connection):
        connection.listen_start()
        return jsonify({"status": "success"})
    else:
        return jsonify({
            "status": "error",
            "message": "Connection can't be established"
        }), 400


@app.route("/connection/<int:id>/listen-end")
def listen_end(id):
    conEnd = None
    # Connection has to be fetched from active connections
    # Running connection are not persisted in the database
    for connection in active_connections:
        if connection.id == id:
            connection.listen_end()
            conEnd = connection

    if conEnd:
        active_connections.remove(conEnd)
        return jsonify({
            "status": "success",
            "message": f"Connection {conEnd.id} successfully unlistened."
        })
    else:
        return jsonify({
            "status": "warning",
            "message": f"Connection {id} was not active."
        }), 400


@app.route("/connection/<int:id>/status")
def connection_status(id):
    for connection in active_connections:
        if connection.id == id:
            return jsonify({"connected": True})
    return jsonify({"connected": False})


@app.route("/connection/all/active")
def all_active_connections():
    return connections_schema.jsonify(active_connections)


@app.route('/connection', methods=['POST'])
def create_connection():
    name = request.json['name']
    database = request.json['database']
    user = request.json['user']
    password = request.json['password']
    host = request.json['host']
    port = request.json['port']
    new_connection = Connection(name, database, user, password, host, port)
    
    db.session.add(new_connection)
    db.session.commit()
    return connection_schema.jsonify(new_connection)


@app.route('/connection', methods=['PUT'])
def update_connection():
    id = request.json['id']
    connection = Connection.query.get(id)
    name = request.json['name']
    database = request.json['database']
    user = request.json['user']
    password = request.json['password']
    host = request.json['host']
    port = request.json['port']

    connection.name = name
    connection.database = database
    connection.user = user
    connection.password = password
    connection.host = host
    connection.port = port

    db.session.commit()
    return connection_schema.jsonify(connection) 


@app.route('/connection/<int:id>', methods=['DELETE'])
def delete_connection(id):
    connection = Connection.query.get(id)
    db.session.delete(connection)
    db.session.commit()
    return connection_schema.jsonify(connection)


@app.route('/connection/all', methods=['GET'])
def get_all_connections():
    all_connections = Connection.query.all()
    return connections_schema.jsonify(all_connections)


@app.route('/connection/<int:id>/status', methods=['GET'])
def get_connection_status(id):
    connection = Connection.query.get(id)
    return None


@app.route("/connection/<int:id>/trigger", methods=["GET"])
def get_triggers(id):
    for connection in active_connections:
        if connection.id == id:
            con = connection.get_connection()
            response_data = jsonify(con.get_all_tables_with_trigger())
            con.close()
            return response_data

    return jsonify({
        "status": "error",
        "message": "Triggers could not be fetched"
    }), 400


@app.route("/connection/<int:id>/trigger", methods=["POST"])
def create_trigger(id):
    for connection in active_connections:
        if connection.id == id:
            con = connection.get_connection()
            response_data = jsonify(con.set_trigger_for_tables(request.json))
            con.close()
            return response_data
            
    return jsonify({
        "status": "error",
        "message": "Triggers could not be created"
    }), 400


if __name__ == '__main__':
    # webbrowser.open_new_tab("http://localhost:5000")
    db.create_all()
    socketio.run(app, host="0.0.0.0", debug=True)
