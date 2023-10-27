import os
import shutil
import eyed3

# Specify the directory path you want to list files from
input_path = input("input dir ")
output_path = input("output dir ")
seconds = float(input("input seconds threshold "))


# List all files in the directory
files = os.listdir(input_path)
files = [os.path.splitext(file) for file in files if file.endswith(".mp3")]

# Print the list of files
for file in files:
    full_file_path = os.path.join(input_path, file[0]+".mp3")
    full_file_path2 = os.path.join(input_path, file[0]+".jpg")
    audio = eyed3.load(full_file_path)
    if(audio.info.time_secs <= seconds):
        shutil.move(full_file_path, output_path)
        shutil.move(full_file_path2, output_path)