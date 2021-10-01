import os

from flask import Flask
from flask.json import jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from blueprints.command import db as command_db, ma as command_ma, Command, command_bpr
from blueprints.connection import db as connection_db, ma as connection_ma, Connection, connection_bpr, connection_schema, connections_schema
from blueprints.active_connection import socketio, active_connection_bpr

app = Flask(__name__, static_url_path='')

app.config['JSON_AS_ASCII'] = False
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Registering command blueprint incl. sqlalchemy and marshmallow
app.register_blueprint(command_bpr)
command_db.init_app(app)
command_ma.init_app(app)

# Registering command blueprint incl. sqlalchemy and marshmallow
app.register_blueprint(connection_bpr)
connection_db.init_app(app)
connection_ma.init_app(app)

# Registering active-connection blueprint incl. socketio
app.register_blueprint(active_connection_bpr)
socketio.init_app(app)

with app.app_context():
    connection_db.create_all()
    command_db.create_all() 


@app.route("/")
def index():
    return jsonify({"status": "running"})

if __name__ == '__main__':

    prod = True if "MODE" in os.environ and os.environ["MODE"] == "PROD" else False

    if prod:
        print("STARTING in PROD MODE")
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000)
    else:
        print("STARTING in DEV MODE")
        socketio.run(app, host="0.0.0.0", debug=True)
