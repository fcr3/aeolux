import streamlit as st

import pydicom
import numpy
import os
import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.patches import Rectangle

st.write("""
# Preprocessing Notebook

Here is a notebook to help with data preprocessing. This uses the RSNA competition data. Link to competition data: https://www.kaggle.com/c/rsna-pneumonia-detection-challenge/data

## Displaying Data

I'll go through a series of steps on how to display dcm data and its associated bounding box(es).

""")

# Preprocessing one image
base_folder = '../../datasets/stage_2_train_images/'
data_files = os.listdir(base_folder)
data_files = [base_folder + file for file in data_files]

sample_files = [f for f in data_files if '00436515-870c-4b36-a041-de91049b9ab4' in f]
sample_dcm = pydicom.dcmread(sample_files[0])
sample_dcm_arr = sample_dcm.pixel_array

# More preprocessing
base_folder_labels = '../../datasets/stage_2_train_labels.csv'
label_df = pd.read_csv(base_folder_labels)
bbox_label_df = label_df.query("Target == 1")
sample_id = '00436515-870c-4b36-a041-de91049b9ab4'
sample_bbox = bbox_label_df.query(f"patientId == '{sample_id}'")
bbox_coords = sample_bbox[['x', 'y', 'width', 'height']].values

# Plotting
fig, ax = plt.subplots()
ax.imshow(sample_dcm_arr, cmap=plt.cm.bone)
for i, bbox_coord in enumerate(bbox_coords):
    x, y, w, h = bbox_coord
    rect = Rectangle((x, y), w, h, linewidth=1, edgecolor='r',facecolor='none')
    ax.add_patch(rect)
st.pyplot(fig)