from flask import Flask,render_template
from flask_socketio import SocketIO
import csv
import base64
import random

asset_path = 'static/asset/'
label_path = asset_path + 'label.txt'

# potential issue, latency of connection causes inconsistent display speed, might not be important to UX.
# Haven't done validation part
# algorithm deciding data output
# user log in UI, only for premium user
# each user have their own set of data, so front_end should buffer the image send, and use for validation.

def send_image(socketio,label):
    train_obj, val_obj = data_selector(label)

    socketio.emit('receive_data', {'key': 'interval','value':1000})
    socketio.emit('receive_data', {'key': 'data_len','value':(len(train_obj)-1)})

    for data in train_obj:
        with open(asset_path + data['image'], 'rb') as image, open (asset_path + data['audio'],'rb') as audio:
            image_data = image.read()
            audio_data = audio.read()
            # audio2 = AudioSegment.from_file(asset_path + data['audio'])
            # print(float(audio2.duration_seconds))
            # audio2 = audio2.speedup(playback_speed=float(1 /audio2.duration_seconds))
            # audio2 = audio2.export(format="mp3").read()
            socketio.emit('receive_data', {'key': "training", 'value':{'image': image_data, 'audio': audio_data,'word' : data['es']}})
    for data in val_obj:
        socketio.emit('receive_data', {'key': "validation", 'value' : data})

def csv_reader():
    data = dict()
    with open(label_path, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            title,imagefilename, audiofilename, spanish = row
            data[title]={'image':imagefilename, 'audio' : audiofilename, 'es' : spanish}
    return data

def data_selector(label):
    # user customize, number or picture, is all handled here.
    # train_list include image,audio,word
    # val_list only words, n words with correct answer included, algorithm to be decided later,
    # a mix of words which user is not good with, or mix of words which general public is not good with.
    train_list = []
    val_list = []
    for key,value in label.items():
        train_list.append(value)
    for key,value in label.items():
        
        count = 0
        re = list(label.values())
        options = [value['es']]
        random.shuffle(re)
        for x in range(len(re)):
            if(re[x]['es'] != value['es']):
                count = count + 1
                options.append(re[x]['es'])
            if count == 2:
                break
        
        print(options)
        random.shuffle(options)
        val_list.append(options)
    return train_list,val_list
