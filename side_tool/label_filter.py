import os
import csv

# Specify the directory path you want to list files from
input_txt_path = "../label_outside.txt"
input_path = "../static/asset/"
output_txt_path = "../static/asset/"


# List all files in the directory
files = os.listdir(input_path)
files = [os.path.splitext(file)[0] for file in files if file.endswith(".mp3")]

data = dict()
with open(input_txt_path, 'r') as input_file:
    csv_reader = csv.reader(input_file)
    for row in csv_reader:
        data[row[0]] = row


with open(output_txt_path+"label.txt", 'w', newline='') as output_file:
    csv_writer = csv.writer(output_file)
    for file in files:
        csv_writer.writerow(data[file])
