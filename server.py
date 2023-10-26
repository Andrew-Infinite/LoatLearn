from flask import Flask,render_template, send_file
from flask_socketio import SocketIO
import time
import func

label = func.csv_reader()
app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('request_data')
def handle_request_data():
    global label
    func.send_image(socketio,label)

if __name__ == '__main__':
    socketio.run(app, debug=True)