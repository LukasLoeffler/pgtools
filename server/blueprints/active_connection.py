from datetime import datetime
import select
import json
import threading


from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO

from blueprints.connection import Connection, connection_schema, connections_schema

db = SQLAlchemy()
ma = Marshmallow()
active_connection_bpr = Blueprint('active_connection_blueprint', __name__)

socketio = SocketIO(cors_allowed_origins='*')

event_index = 0
active_connections = []  # Array containing all currently active connections


def notify(payload):
    global event_index
    payload["timestamp"] = datetime.now().isoformat()[11:-4]
    payload["index"] = event_index
    socketio.emit('databaseEvent', payload)
    event_index += 1


def events(connection):
    con = connection.con
    while True:
        #If connection is closed from outside an exception is thrown on connection.poll()
        try:
            if select.select([con],[],[],5) != ([],[],[]):
                seconds_passed = 0
                con.poll()
                con.commit()
                while con.notifies:
                    payload = con.notifies.pop().payload
                    data = json.loads(payload)
                    data["database"] = connection.database
                    notify(data)
        except Exception as e:
            break


def is_connection_valid(connection):
    """
    Checks if connection can be established
    """
    try:
        connection.get_connection()
        return True
    except:
        return False




@active_connection_bpr.route("/connection/<int:id>/listen-start")
def listen_start(id):
    print("Listen Start")
    connection = Connection.query.get(id)
    if is_connection_valid(connection):
        pg_connection = connection.get_connection()
        pg_connection.create_general_notify_event()
        pg_connection.cur.execute("LISTEN pg_change;")

        connection.pg_connection = pg_connection
        active_connections.append(connection)
        thread = threading.Thread(target=events, args=(pg_connection,))
        thread.start()

        return jsonify({"status": "success"})
    else:
        return jsonify({
            "status": "error",
            "message": "Connection can't be established"
        }), 400


@active_connection_bpr.route("/connection/<int:id>/listen-end")
def listen_end(id):
    conEnd = None
    # Connection has to be fetched from active connections
    # Running connection are not persisted in the database
    for connection in active_connections:
        if connection.id == id:
            connection.pg_connection.cur.execute("UNLISTEN pg_change;")
            connection.pg_connection.cur.close()
            connection.pg_connection.con.close()
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


@active_connection_bpr.route("/connection/<int:id>/status")
def connection_status(id):
    for connection in active_connections:
        if connection.id == id:
            return jsonify({"connected": True})
    return jsonify({"connected": False})


@active_connection_bpr.route("/connection/all/active")
def all_active_connections():
    return connections_schema.jsonify(active_connections)


@active_connection_bpr.route('/connection/all', methods=['GET'])
def get_all_connections():
    all_connections = Connection.query.all()
    return connections_schema.jsonify(all_connections)


@active_connection_bpr.route("/connection/<int:id>/trigger", methods=["GET"])
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


@active_connection_bpr.route("/connection/<int:id>/trigger", methods=["POST"])
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