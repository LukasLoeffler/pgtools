from flask import Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()
command_bpr = Blueprint('command_blueprint', __name__)


class Command(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    query_string = db.Column(db.String())
    severity = db.Column(db.String(255))

    def __init__(self, name, query_string, severity):
        self.name = name
        self.query_string = query_string
        self.severity = severity


class CommandSchema(ma.Schema):
    class Meta:
        fields=('id', 'name', 'query_string', 'severity')
command_schema = CommandSchema()
commands_schema = CommandSchema(many=True)


@command_bpr.route("/command", methods=["POST"])
def create_command():
    name = request.json["name"]
    query_string = request.json["query_string"]
    severity = request.json["severity"]

    new_command = Command(name, query_string, severity)
    db.session.add(new_command)
    db.session.commit()
    return command_schema.jsonify(new_command)

@command_bpr.route('/command/all', methods=['GET'])
def get_all_commands():
    all_commands = Command.query.all()
    return commands_schema.jsonify(all_commands)

@command_bpr.route("/command/<int:id>", methods=["PUT"])
def edit_command(id):
    name = request.json["name"]
    query_string = request.json["query_string"]
    severity = request.json["severity"]

    edit_command = Command.query.get(id)
    edit_command.name = name
    edit_command.query_string = query_string
    edit_command.severity = severity

    db.session.commit()
    return command_schema.jsonify(edit_command)

@command_bpr.route('/command/<int:id>', methods=['DELETE'])
def delete_command(id):
    command = Command.query.get(id)
    db.session.delete(command)
    db.session.commit()
    return command_schema.jsonify(command)
