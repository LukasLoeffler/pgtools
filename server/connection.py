from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from postgres_tools import Connection as PgConnection

db = SQLAlchemy()
ma = Marshmallow()
connection_bpr = Blueprint('connection_blueprint', __name__)


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

class ConnectionSchema(ma.Schema):
    class Meta:
        fields=('id', 'name', 'database', 'user', 'password', 'host', 'port')
connection_schema = ConnectionSchema()
connections_schema = ConnectionSchema(many=True)


@connection_bpr.route("/check",  methods=['POST'])
def check_connection():
    database = request.json['database']
    user = request.json['user']
    password = request.json['password']
    host = request.json['host']
    port = request.json['port']
    try:
        connection = PgConnection(database, user, password, host, port)
        return jsonify({
            "status": "success",
            "message": "Connection properties valid"
        })
    except:
        return jsonify({
            "status": "error",
            "message": "Connection properties invalid"
        })

@connection_bpr.route('/', methods=['POST'])
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

@connection_bpr.route('/', methods=['PUT'])
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
    
@connection_bpr.route("/execute", methods=["POST"])
def execute_command():
    connection_id = request.json['connection_id']
    db_query = request.json['db_query']

    connection = Connection.query.get(connection_id)
    response = connection.get_connection().execute_command(db_query)
    
    return jsonify(response)
