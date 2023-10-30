from flask import Flask,render_template, send_file
from flask_socketio import SocketIO, emit
import time
import func
import sqlite3

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

@socketio.on('send_result')
def handle_message(message):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    sql = '''INSERT INTO database (NAME, TRIAL, CORRECT, TIMESTAMP) VALUES (?, ?, ?, datetime('now'))'''
    cursor.execute(sql, (message['NAME'], message['TRIAL'], message['CORRECT']))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    socketio.run(app, debug=True)