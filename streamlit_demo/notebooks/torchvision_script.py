import torch
import torchvision
import matplotlib.pyplot as plt
import pandas as pd
import os
import pydicom

base_folder = '../datasets/stage_2_train_images/'
base_folder_labels = '../datasets/stage_2_train_labels.csv'
label_df = pd.read_csv(base_folder_labels)
bbox_only_df = label_df.query('Target == 1')

import os
import numpy as np
import torch
from PIL import Image

class RsnaDataset(object):
    def __init__(self, root, label_df, transforms):
        self.root = root
        self.transforms = transforms
        
        # Processing the boxes
        label_df = label_df.query('Target == 1')
        label_df['xmin'] = label_df['x']
        label_df['ymin'] = label_df['y']
        label_df['xmax'] = label_df['x'] + label_df['width']
        label_df['ymax'] = label_df['y'] + label_df['height']
        self.label_data = label_df
        self.pids = sorted(label_df['patientId'].unique())
        
    def load_box(self, idx):
        pid = self.pids[idx]
        pid_df = self.label_data.query(f"patientId == '{pid}'")
        return pid_df[['xmin', 'ymin', 'xmax', 'ymax']].values
    
    def load_image(self, idx):
        pid = self.pids[idx]
        path = self.root + pid + '.dcm'
        dcm = pydicom.dcmread(path)
        return dcm.pixel_array

    def __getitem__(self, idx):
        boxes = self.load_box(idx) # return list of [xmin, ymin, xmax, ymax]
        img = self.load_image(idx) # return an image

        num_box = len(boxes)
        if num_box>0:
            boxes = torch.as_tensor(boxes, dtype=torch.float32)
        else:
            # negative example, ref: https://github.com/pytorch/vision/issues/2144
            boxes = torch.zeros((0, 4), dtype=torch.float32)

        labels = torch.ones((num_box,), dtype=torch.int64)
        image_id = torch.tensor([idx])
        area = (boxes[:, 3] - boxes[:, 1])*(boxes[:, 2] - boxes[:, 0])
        iscrowd = torch.zeros((num_box,), dtype=torch.int64)
        target = {}
        target["boxes"] = boxes
        target["labels"] = labels
        target["image_id"] = image_id
        target["area"] = area
        target["iscrowd"] = iscrowd

        if self.transforms is not None:
            img, target = self.transforms(img, target)
        return img, target

    def __len__(self):
        return len(self.pids)
    
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection import FasterRCNN
from torchvision.models.detection.rpn import AnchorGenerator, RPNHead, RegionProposalNetwork
import torch

fasterRCNN = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)

# Define RPN 
anchor_generator = AnchorGenerator(
    sizes=tuple([(16, 32, 64, 128, 256) for _ in range(5)]), 
    # let num of tuple equal to num of feature maps
    aspect_ratios=tuple([(0.75, 0.5, 1.25) for _ in range(5)])) 
    # ref: https://github.com/pytorch/vision/issues/978

rpn_head = RPNHead(256, anchor_generator.num_anchors_per_location()[0])

fasterRCNN.rpn = RegionProposalNetwork(
    anchor_generator= anchor_generator, head= rpn_head,
    fg_iou_thresh= 0.7, bg_iou_thresh=0.3,
    batch_size_per_image=48, # use fewer proposals
    positive_fraction = 0.5,
    pre_nms_top_n=dict(training=200, testing=100),
    post_nms_top_n=dict(training=160, testing=80),
    nms_thresh = 0.7
)

in_features = fasterRCNN.roi_heads.box_predictor.cls_score.in_features
fasterRCNN.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes = 2)
fasterRCNN.roi_heads.fg_bg_sampler.batch_size_per_image = 24
fasterRCNN.roi_heads.fg_bg_sampler.positive_fraction = 0.5

from vision.references.detection import coco_utils
import vision.references.detection.transforms as T
from vision.references.detection.engine import train_one_epoch, evaluate

def get_transform(train):
    transforms = []
    transforms.append(T.ToTensor())
    if train:
        transforms.append(T.RandomHorizontalFlip(0.5))
    return T.Compose(transforms)

import vision.references.detection.utils as utils

def main():
    # train on the GPU or on the CPU, if a GPU is not available
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

    # our dataset has two classes only - background and person
    num_classes = 2
    # use our dataset and defined transformations
    dataset = RsnaDataset(root='../datasets/stage_2_train_images/', 
                          label_df=bbox_only_df, 
                          transforms=get_transform(train=True))
    dataset_test = RsnaDataset(root='../datasets/stage_2_train_images/', 
                               label_df=bbox_only_df, 
                               transforms=get_transform(train=False))

    # split the dataset in train and test set
    indices = torch.randperm(len(dataset)).tolist()
    dataset = torch.utils.data.Subset(dataset, indices[:-50])
    dataset_test = torch.utils.data.Subset(dataset_test, indices[-50:])

    # define training and validation data loaders
    data_loader = torch.utils.data.DataLoader(
        dataset, batch_size=2, shuffle=True, num_workers=4,
        collate_fn=utils.collate_fn)

    data_loader_test = torch.utils.data.DataLoader(
        dataset_test, batch_size=1, shuffle=False, num_workers=4,
        collate_fn=utils.collate_fn)

    fasterRCNN.to(device)
    params = [p for p in fasterRCNN.parameters() if p.requires_grad]
    optimizer = torch.optim.Adam(params, lr=0.0005, betas=(0.9, 0.999), 
                                 weight_decay=0.0005)
    lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=3, 
                                                   gamma=0.1)
    metric_collector = []
    num_epochs = 15
    weights_path = 'logs'
    for epoch in range(num_epochs):
        # train for one epoch, printing every 5 iterations
        metric_logger = train_one_epoch(fasterRCNN, optimizer, data_loader, 
                                        device, epoch, print_freq=200)
        metric_collector.append(metric_logger)
        
        # update the learning rate
        lr_scheduler.step()
        
        # Evaluate with validation dataset
        metric_logger_val = validate(fasterRCNN, val_data_loader, device, print_freq=200)
        
        #save checlpoint
        torch.save(fasterRCNN.state_dict(), 
                   os.path.join(weights_path, 'fasterRCNN_ep' + str(epoch) + '.pth') )

if __name__ == '__main__':
    main()