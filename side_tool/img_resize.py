import cv2
import numpy as np
import os

SIZE = 400

dir = input('please input src of folder, eg: ../asset\n\n')

img_dir_ls = os.listdir(dir)
img_dir_ls = [img for img in img_dir_ls if img.lower().endswith('.jpg')]

for img_name in img_dir_ls:
    img_dir = os.path.join(dir,img_name)

    img = cv2.imread(img_dir) 
    # Get image dimensions
    height, width, _ = img.shape

    # # Calculate the center coordinates
    center_x = width // 2
    center_y = height // 2

    if(height > width):
        img = img[center_y - center_x:center_y + center_x, 0:width]
    elif(height < width):
        img = img[0:height,center_x - center_y:center_x + center_y]
    else:
        continue
    img = cv2.resize(img, (SIZE, SIZE))
    cv2.imwrite(img_dir, img)


