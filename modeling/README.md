# AeoluX.ai - Training and Testing

This README goes over the Training and Testing and Extras section that was featured in the front README. In order to promote clarity, we have limited this README to just talk about relevant sections that relate to the code featured in this directory. Links/references to pre-requisites may not work in this README, so please navigate to the front README for details.

## Table of Contents
* [Training and Testing](#Training-and-Testing)
    * [General Instructions](#General-TT)
    * [Dockerized Training and Testing](#Docker-TT)
    * [Manual Training and Testing](#Manual-TT)
* [Results](#Results)
* [Extras](#Extras)
    * [Data Visualization](#DataVis)
    * [Data Generation](#DataGen)
    * [Experimentals](#Experimentals)

## <a name="Training-and-Testing"></a>Training and Testing

This section goes over the training and testing procedure used to train and test the object detection models used in Aeolux.ai. It is strongly recommended to use Docker in this scenario, since conflicting dependencies are bound to happen. Nonetheless, a provided manual tutorial is given, but please use with caution as you may inevitably install/uninstall dependencies used by other programs on your computer.

### <a name="General-TT"></a>General Instructions
Follow these instructions below, regardless of the method you choose (either [Docker](#Docker-TT) or [Manual). Make sure that `gdown` is installed (please follow the pre-requisite instructions before proceeding).

1. Download the following files: [vbd_tfobj_data.zip](https://drive.google.com/file/d/14IsbKcsoDIfOZTJGdWYuDG0z6yh8O1pY/view?usp=sharing) and [vbd_yolov5_data.zip](https://drive.google.com/file/d/1xJCTylck8Snd7bvdbqhjSoGKPtYEEDRk/view?usp=sharing). Extract the contents of these files, and place these files in the directory `vbd_vol` located in the root of this project. Alternatively, execute the following instructions while in this root of this project:
```
$ cd vbd_vol
$ gdown --id 14IsbKcsoDIfOZTJGdWYuDG0z6yh8O1pY && unzip vbd_tfobj_data.zip
$ gdown --id 1xJCTylck8Snd7bvdbqhjSoGKPtYEEDRk && unzip vbd_yolov5_data.zip
```
Please be patient as these downloads take a very long time. Furthermore, make sure you have at least 10GB of additional space on your hard drive to accomodate the data files. If you are working on limited space, feel free to break up the previous process into segments where you are only working on files related to one of the two zip files.

### <a name="Docker-TT"></a>Dockerized Training and Testing
Similar to the app dockerized demo section, please be sure to satisfy all requirements stated in the prerequisites section. Please follow the instrucitons below:

1. Execute the following instructions:
```
$ docker pull aeoluxdotai/tf_od
$ docker pull aeoluxdotai/yolov5
```
Please be sure to have at least 15GB of additional hard drive space to accomodate these images. If you are working on limited space, pull the images that are relevant for your work. Furthermore, utilization of a GPU is key, and your user experience will be much better with one than without one. The docker images are built on CUDA enabled base images. For reference, we did most of our training on one to two Nvidia GTX 1080s, each with 11GB of memory.

#### Training and Testing Tensorflow Object Detection Models
This section will go over how to train and test one of our Tensorflow Object Detection models. We will use an `SSD Mobilenet V2` model for our example. This is more or less generalizable to the other models in Tensorflow Object detection, except different paths need to be specified. The other models we trained are:
- EfficientDet D1
- SSD Resnet50

Without further ado, please follow the steps below:

1. Execute the following commands to start the docker container:
```
$ docker run -it -v /absolute/path/to/aeolux:/home/tensorflow/aeolux2 aeoluxdotai/tf_od bash
```
You should now find yourself within the interactive shell of the `aeoluxdotai/tf_od` container. If you would like to specify a port and/or use gpus, include the following tags: 
- `-p PORT:PORT` for the port you want to use
- `--gpus all` ("all" can be replaced by the GPU ID) for gpu usage

From here on, we will be using the `/home/tensorflow/aeolux2` directory as the root of the project, as was specified when mounting the directory to the container.

2. Execute the following commands to download the pre-trained model:
```
root@#### $ cd /home/tensorflow/aeolux2/modeling/tf_obj && mkdir pre-trained-models
root@#### $ cd pre-trained-models
root@#### $ wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz
root@#### $ tar -zxvf ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz
```
The download link comes directly from the links provided in Tensorflow 2's Object Detection Model Zoo. The link to the zoo is [here](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md). Use the model zoo to download more pre-trained models of interest. If the above link in the execution sequence is out of date, please replace it with the new one (TF-OBJ is a continually maintained project.)

3. Make an output folder for storing checkpoints:
```
root@#### $ cd ../models/ssd_mobilenet_v2 && mkdir output
```

4. Run the training script:
```
root@#### $ cd ../..
root@#### $ python model_main_tf2.py \
          > --model_dir=models/ssd_mobilenet_v2/output/ \
          > --pipeline_config_path=models/ssd_mobilenet_v2/pipeline.config
```
Originally, the `batch_size` within the custom pipeline.config file (located in `modeling/tf_obj/workspace_vbd/models/ssd_mobilenet_v2`) was equal to 128, but on consumer computers, such large batch size might be too much. Therefore, we lowered the batch size to something more reasonable such as 8.

5. Once the model is finished training, we can evaluate the model by doing the following:
```
root@#### $ python model_main_tf2.py \
          > --model_dir=models/ssd_mobilenet_v2/output/ \
          > --pipeline_config_path=models/ssd_mobilenet_v2/pipeline_test.config \
          > --checkpoint_dir=models/ssd_mobilenet_v2/output/ \
          > --num_workers=1 \
          > --sample_1_of_n_eval_examples=1
```
The command once finished may not exit immediately, so wait until the statistics are shown before you kill the program. Usually, `CTRL + c` is the command to kill a program. Similar to the previous step, the batch size was originally 128, but it was editted to be more manageable on consumer machines.

If you would like to evaluate the models we use in our application, you need to change the paths of the command. An example of this could be as follows (this command should be executed in the `modeling/tf_obj/workspace_vbd` directory):
```
root@#### $ cp -r /home/tensorflow/aeolux2/app/backend/models/ ./models-trained
root@#### $ python model_main_tf2.py \
          > --model_dir=models/ssd_mobilenet_v2/output/ \
          > --pipeline_config_path=models/ssd_mobilenet_v2/pipeline_test.config \
          > --checkpoint_dir=models-trained/tf_obj_models/ssd_mobilenetv2_vbd_mb/checkpoint/ \
          > --num_workers=1 \
          > --sample_1_of_n_eval_examples=1
```
<b>Note</b> that we copied the trained models folder from the `app/backend` directory. You need to follow the prerequisites first before executing the above command because if you don't, the copy command will error (there exists no directory named `models` yet).

#### Known Issues for Tensorfow Object Detection
- We made a minor change to the exporter script in the Tensorflow Object Detection repo for the exported model to support batch inference. Please refer to this link for details: https://github.com/tensorflow/models/issues/9358. 
- When you train/test the other models, make sure that you pay attention to the batch size. We have left the original batch sizes as is for the other Tensorflow Object Detection models. Please lower it based on the confines of your machine.

#### Training and Testing YoloV5
This section will go over how to do training and testing with the Yolov5 repository from `ultralytics`. The official repository is [here](https://github.com/ultralytics/yolov5). We have made a copy of the repository in order to accomodate for changes that we might have made. Follow the instructions below:

1. Execute the following command to run the docker container:
```
docker run -it --gpus all -v /home/fcr/projects/aeolux2:/root/aeolux2 aeoluxdotai/yolov5 bash
```
This time we will involve the gpu flag, just for example's sake. If you do not have a GPU or have not installed Nvidia-docker, this command may not work as you expect.

From here on, we will refer to `/root/aeolux2` as the root directory for this project, as was specified when we mounted the directory to the container.

2. Execute the following command to enable the `aeolux_yolov5` environment:
```
(base) root@#### $ conda deactivate
root@#### $ conda activate aeolux_yolov5
(aeolux_yolov5) root@#### $ 
```
This last line is included to show that your terminal should look similar to the last line.

3. Execute the following commands to train a Yolov5m model:
```
(aeolux_yolov5) root@#### $ cd /root/aeolux2/modeling/yolov5
(aeolux_yolov5) root@#### $ python train.py 
                          > --data vbd.yaml 
                          > --cfg yolov5m.yaml 
                          > --img 512 
                          > --weights yolov5m.pt 
                          > --epochs 300 
                          > --batch-size 16 
```
If you would like to try another model, feel free to look at the ultralytics repository to specify another model. The medium sized model that we chose balances memory footprint with precision, so we should this one to use in our application. Furthermore, batch size should be editted to meet your needs. Refer to [training on custom data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data) and [training tips](https://github.com/ultralytics/yolov5/wiki/Tips-for-Best-Training-Results). 

If you have multiple GPUs, specify the usage of them by doing the following:
```
(aeolux_yolov5) root@#### $ python -m torch.distributed.launch --nproc_per_node 2 train.py 
                          > --data data/vbd.yaml 
                          > --cfg yolov5m.yaml 
                          > --img-size 512 
                          > --weights yolov5m.pt 
                          > --epochs 300 
                          > --batch-size 4
```

4. Once you are done training the model, choose one of the model outputs located in `modeling/yolov5/runs/train/`. Let's call the chosen output folder as `expn`.

You can choose to test without test time augmentation.
```
(aeolux_yolov5) root@#### $ python test.py 
                          > --weights ./runs/train/expn/weights/best.pt 
                          > --data data/vbd_test.yaml 
                          > --img-size 512 
                          > --batch-size 4
```

You can also choose to test with test time augmentation. 
```
(aeolux_yolov5) root@#### $ python test.py 
                          > --weights ./runs/train/expn/weights/best.pt 
                          > --data data/vbd_test.yaml 
                          > --img-size 512 
                          > --batch-size 4
                          > --augment
```
For best results, you should choose the augment route, as it is an algorithm specifically design to lower variance by perturbing the image and using the multiple detections from the pertubations to give a single output.

If you would like to test the Yolov5m model that we have trained, execute the following command. <b>Note</b> that we are in the `modeling/yolov5` folder.
```
(aeolux_yolov5) root@#### $ cp -r /root/aeolux2/app/backend/models/ ./models-trained
(aeolux_yolov5) root@#### $ python test.py 
                          > --weights ./models-trained/torch_models/yolov5/weights/best.pt 
                          > --data data/vbd_test.yaml 
                          > --img-size 512 
                          > --batch-size 4 
                          > --augment
```
<b>Note</b> that we copied the trained models folder from the `app/backend` directory. You need to follow the prerequisites first before executing the above command because if you don't, the copy command will error (there exists no directory named `models` yet).

### <a name="Manual-TT"></a>Manual Training and Testing
This section is for those who cannot set up Docker on their computer and want to manually set up the experiment. Unfortunately, this is not an easy feat, especially due to the inconsistencies amongst documentation and the various bugs surrounding Tensorflow Object Detection. Yolov5 is a much better user experience. This section will primarily go over tips on how to set up Tensorflow Object Detection and Yolov5. Once you have set up the installations and the environments, you can refer back to the [Docker](#Docker-TT) section for running commands, since they are basically identical after the setup process. However, we <b>STRONGLY</b> recommend that you go the Docker route.

#### Setting up Tensorflow Object Detection Manually
[Here](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2.md) is the official instructions to set up the object detection API. However, we can tell you from experience that this will not always work correctly. 

Here are some other tutorials for your reference:
- https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/install.html
- https://github.com/TannerGilbert/Tensorflow-Object-Detection-API-Train-Model

Here are some tips if you have issues:
- If you are missing dependencies in official, simply copy the official folder in models/official into the site-packages folder of python. To find the site-packages folder, do:
```
$ python3
>>> import tensorflow as tf
>>> tf.__path__
```
The output should involve you going through some site-packages folder. Navigate to there, and then copy the models/official folder into this place. 

<b>Note</b> that our Docker container uses Tensorflow/Tensorflow-GPU version 2.3.0, so keep that in mind as you are following this tutorial.

#### Setting up Yolov5 Manually
Thankfully, the repository from ultralytics is a lot clearer to understand and simpler to set up.

1. Execute the following commands. <b>Note</b> that we are executing commands by starting in the root of the project.
```
$ cd modeling/yolov5
$ conda create --name aeolux_yolov5 python=3.8
$ conda activate aeolux_yolov5
(aeolux_yolov5) $ pip install -r requirements.txt
```

## <a name="Results"></a>Results
If you would like to see the results generated from our experiements, please navigate to `modeling/analysis/Results` to see the results that you should get when running the evaluation scripts using the models that we have provided (look at the prerequisites section in the README located at the root of the project).

## <a name="Extras"></a>Extras
This section is for those who want to explore our repository and are maybe curious about the data we were working with. We used VinBigData as our dataset, but we also came across other datasets as well such as NIH and RSNA. For relevancy purposes, we are mainly showing the visualization and preprocessing that needed to be done for VinBigData.

Before exploring these folders, please execute the following commands in the `modeling` folder (assuming you have a working Conda installation):
```
$ conda create --name aeolux_extras python=3.8
$ conda activate aeolux_extras
(aeolux_extras) $ pip install -r requirements.txt
```

### <a name="DataVis"></a>Data Visualization
In the `modeling/analysis` folder, we have a notebook called `vbd_analysis.ipynb` that goes over some brief analysis of the VinBigData set.

### <a name="DataGen"></a>Data Generation
In the `modeling/tf_obj` folder, we have two notebooks called `data_preprocessing_vbd.ipynb` and `tf_obj_conversion.ipynb` that go over how we converted data from its original format to PASCAL VOC to TFRecords. In the `modeling/yolov5` folder, we have one notebook called `processing.ipynb` that goes over how we reorganized the png data to fit the format that was used to train our Yolov5m model.

### <a name="Timings"></a>Timings
In the `modeling/analysis` folder, we have a notebook called `inference_and_timing.ipynb` that goes over how to do inference as well as showcase timings. The notebook was originally run on a computer with the following specifications:
- CPU: Intel 8th Gen i7-8750H
- GPU: Nvidia GeForce GTX 1070
Due to the differences in hardware, you may not be able to reproduce results. However, we have hardcoded the performance metrics so that you don't lose reference to timings that we got on our original machine.

### <a name="Experimentals"></a>Experimentals
Included in this repository are other branches that include bits and pieces of work that we didn't polish up for the official product. However, we would like to explore these endeavours in the future, so please feel free to explore.

Experimentals:
- In `modeling/analysis/Experimentals`, we have a folder of notebooks that contains processing/exploration of other datasets that we came across.
- In `modeling/analysis/Experimentals/Results`, we have a folder of results csvs that contain output from running evaluation on other datasets. This folder currently contains only RSNA-based metrics.
- In the `torch_obj` branch, we have examples of how to train DETR, RetinaNet, and Mobilenet using Detectron2

