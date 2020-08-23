import pgpubsub
import json
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import threading
from datetime import datetime
from flask_cors import CORS
from postgres_tools import Connection
import webbrowser


app = Flask(__name__, static_url_path='')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

event_index = 0
pubsub = None
connection = None

@socketio.on('connect')
def handle_json():
    print('client connected')


def notify(payload):
    """
    Emit the payload via websocket to the frontend.
    Args:
        payload (string): The json payload of the event
    """
    global event_index
    payload["timestamp"] = datetime.now().isoformat()[11:-3]
    payload["index"] = event_index
    socketio.emit('evt', payload)
    event_index += 1


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/status")
def status():
    global pubsub
    if pubsub:
        return jsonify({"connected": True})
    else:
        return jsonify({"connected": False})


@app.route("/tables")
def tables():
    global connection
    if connection:
        return jsonify(connection.get_all_table_names())
    else:
        return jsonify({"error": "Database connection not established"})


@app.route("/tables/triggers", methods=["GET", "POST"])
def tables_triggers():
    global connection
    if connection:
        if request.method == "GET":
            return jsonify(connection.get_all_tables_with_trigger())

        if request.method == "POST":
            return jsonify(connection.set_trigger_for_tables(request.json))
    else:
        return jsonify({"error": "Database connection not established"})


@app.route("/trigger")
def trigger():
    global connection
    if request.method == "GET":
        if connection:
            return jsonify(connection.get_all_triggers_as_dict())
        else:
            return jsonify({"error": "Database connection not established"})


@app.route("/init", methods=["POST"])
def init():
    data = request.json
    global connection
    global pubsub
    try:
        connection = Connection(database=data["database"], user=data["username"], password=data["password"], host=data["hostname"], port=data["port"])

        try:
            connection.create_general_notify_event()
        except:
            print("General notify function could not be created. Probably already existing")

        pubsub = pgpubsub.connect(
            database=data["database"], 
            user=data["username"], 
            password=data["password"], 
            host=data["hostname"], 
            port=data["port"]
        )
        pubsub.listen('events')
        x = threading.Thread(target=sub_function)
        x.start()
        return jsonify({"connected": True})
    except:
        return jsonify({"connected": False})


def sub_function():
    """
    Threded method which listens to postgres event 'events' and extracts the payload of the event which contains the
    changed db entity. If event is recieved an emit message is sent by notify method.    
    """
    global pubsub
    for e in pubsub.events():
        if e:
            payload = json.loads(e.payload)
            #print(f"{payload['table']} - {payload['action']}")
            #print(payload['data'])
            notify(payload)


if __name__ == '__main__':
    # webbrowser.open_new_tab("http://localhost:5000")
    socketio.run(app, host="0.0.0.0")
