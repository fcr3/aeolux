# AeoluX.ai

## Table of Contents
* [Overview](#Overview)
* [Section Diagram](#Section-Diagram)
* [Prerequisites](#Prerequisites)
    * [General Installation](#General-Installation)
    * [Dockerized Installation](#Dockerized-Installation)
    * [Manual Installation](#Manual-Installation)
    * [CUDA Installation](#CUDA-Installation)
* [Running the Application](#Demo)
    * [Dockerized Demo](#Dockerized-Demo)
    * [Manual Demo](#Manual-Demo)
* [Training and Testing](#Training-and-Testing)
    * [General Instructions](#General-TT)
    * [Dockerized Training and Testing](#Docker-TT)

## <a name="Overview"></a>Overview

This repository serves as the codebase for the Aeolux.ai project. AeoluX.ai is a computer vision solution dedicated to make lung diseases diagnosis a more efficient process by leveraging the potential of artificial intelligence in medical imaging. 

Specifically, the project is a pulmonary pre-diagnostic web service for physicians and X-ray technicians from resource-constrained geographies. By automating chest X-rays analysis using convolutional neural networks, our models are able to detect 14 different lung anomalies on an X-ray. X-ray is the cheapest medical imaging technique globally, which is our first step to make it accessible to all. In addition, Aeolux can process data through basic local GPUS, making it accessible in all remote locations. Our service thus allows us to prioritize urgent cases and redirect patients to appropriate specialists and health services.

The figure below illustrates the basic functionality.

<p align="center">
  <img src="assets/aeolux-decision.png" />
</p>

Specifically, our UI guides individuals along this path, using deep learning as the main modules to make decisions about which branch to explore. At the leaves, we hope our application enables individuals to seek the appropriate medical care for their needs.

## <a name="Section-Diagram"></a>Relevant-Section Diagram
Below is a setup diagram to help ease the navigation of the README. The relevant sections will be in order from top to bottom and connected via edges. Indentations within the diagramThe assd represent subsections:
```
------------
| Overview |
------------
      |
---------------
|Prerequisites|
---------------
      |
   ------------
   | General  |
   | Install  |
   ------------
      |        \
   ----------- -----------
   | Docker  | | Manual  |
   | Install | | Install |
   ----------- -----------
      |        /
---------------------------
| Running the Application |
---------------------------
      |        \
   ----------  -----------
   | Docker |  | Manual  |
   | Demo   |  | Demo    |
   ----------  -----------
      |        /
------------------------
| Training and Testing |
------------------------
      |
   -----------------
   | General       |
   | Instructions  |
   -----------------
      |        \
   ----------  -----------
   | Docker |  | Manual  |
   | T & T  |  | T & T   |
   ----------  -----------
```

## <a name="Prerequisites"></a>Prerequisites

This section goes over the installation of Aeolux onto a local machine. The recommended way to install this application requires the use of Docker. However, if there is any issue with installing Docker, please follow the [Manual Installation](#Manual-Installation) directions. <b>Note</b> that this tutorial does assume some sort of installation of Python.

### <a name="General-Installation"></a>General Installation
This section goes over the general installation steps that a user needs to do, regardless of the installation method chosen ([Docker](#Dockerized-Installation) or [Manual](#Manual-Installation)).

1. First, in the terminal window/GitBash window/command line, please clone this project into a folder of your choosing. You can also do it manually via the GitHub UI. The command to clone is below.

Usual Method:
```
$ git clone https://github.com/fcr3/aeolux.git
```
SSH Method:
```
$ git clone git@github.com:fcr3/aeolux.git
```

2. Execute the following commands. Optionally, you can create a small environment via `venv` or `conda` but it is not required. Also, pip might use your 2.x installation of Python. If it does (you can check by doing `which pip`), use `pip3` instead. <b>Note</b> that you should be in the root of the project directory. The first command of the sequence below should get you there.
```
$ cd aeolux
$ pip install gdown
$ gdown --id 15_06CvV7xcNvoprrVc5yXwbAgebBIFY
$ mv aeolux_models.zip app/backend/.
```
Alternatively, you can download the `.zip` file from [here](https://drive.google.com/file/d/15_06CvV7xcNvoprrVc5yXwbAgebBIFYm/view?usp=sharing) and place it in `app/backend`.

3. If you are working on a Linux machine, you can execute the following command. <b>Note</b> that you should be in the root of the project directory.
```
$ cd app/backend/
$ unzip aeolux_models.zip
```
If the `unzip` command does not work, you can also unzip the `.zip` file using MacOS or Windows UI. <b>Note</b> that the `aeolux_models.zip` will be located in `app/backend`.

### <a name="Dockerized-Installation"></a>Dockerized Installation

This subsection introduces some links that you can follow to install the necessary prerequisites. As stated previously, the requirement of Docker is recommended, so please follow this [link](https://docs.docker.com/get-docker/) to install Docker on your local machine. Additionally, please follow this [link](https://docs.docker.com/compose/install/) to install Docker Compose on your local machine. Docker provides a kernel level abstraction to contain individual applications, while Docker Compose spins up multiple containers to work with each other.

Mac users have reported that you need to (1) update to the latest MacOS version and (2) run the application first in order to fully set up your Docker (this probably applies to Windows users, too). Therefore, please run the execute the app via the OS's native UI before moving on to the directions below. Read [here](https://stackoverflow.com/questions/60992814/docker-compose-command-not-available-for-mac) for more details on the Mac issue.

### <a name="Manual-Installation"></a>Manual Installation

If you cannot install Docker on your machine, you need to install the following packages:
- [Conda](https://docs.anaconda.com/anaconda/install/): Follow the links/directions in the provided [Conda](https://docs.anaconda.com/anaconda/install/) link to install the appropriate Anaconda/Miniconda environment manager. This will ease the installation/development process so you can manage conflicting Python dependencies.
- [NodeJS](https://nodejs.org/en/download/): This requirement is necessary for running our React application. Additionally, [here (homebrew)](https://nodejs.dev/learn/how-to-install-nodejs) and [here (manual)](https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/) are two MacOS installation guides, and [here](https://phoenixnap.com/kb/install-node-js-npm-on-windows) is a windows installation guide.

### <a name="CUDA-Installation"></a>CUDA Installation

A soft preqrequisite that will speed up the application is the installation of CUDA. However, the installation of CUDA is often unattainable for many machines due to the unavailability of an installed Nvidia GPU. Nonetheless, if you would like to install CUDA on your machine and you have one/many capable Nvidia GPU(s), please follow this [link](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html). 

Once you have installed CUDA on your machine and you would like to use GPU(s) in your docker container, please follow this [link](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker) to install Nvidia-Docker. Then, when you are about to create a new docker container, specificy the following:
```
$ docker run <other tags> --gpus all <rest of command>
```

## <a name="Demo"></a>Running the Application

This section goes over how to run the Aeolux.ai application. The content below is split into two sections: [Dockerized Demo](#Dockerized-Demo) and [Manual Demo](#Manual-Demo). Please follow the appropriate section, depending on your chosen installation method. <b>Note</b> that the tutorial is written from the perspective of a Linux user. However, the commands are similar for MacOS users who use the terminal window or for Windows users who use the command line.

### <a name="Dockerized-Demo"></a>Dockerized Demo

This subsection goes over how to install Aeolux.ai on your local machine using Docker. The directions are below. <b>Note</b> that this demo requires there to be at least 15 GB of free space on your hard drive.

1. Navigate to the `app` directory located in the root of this project:
```
$ cd app
```
2. Execute the following command. Lots of issues occur around this step, primarily around memory. Please refer to the <b>Known Issues</b> section below for tips on how fix these issues. TL;DR: you will probably need to increase your memory limit in the docker configuration UI.
```
$ docker-compose build
```
3. Execute the following command:
```
$ docker-compose up
```

Once the the third step is fully executed and the application is running, navigate to `localhost:3000` in your browser of choice. Feel free to upload an Xray image of choice. We will provide some for demo purposes, which can be found in the `examples` folder located in the root of the project.


#### Known Issues
- If you find yourself running into memory issues (Docker will fail with an error of 137), build each service on its own. In total, there are four services: `redis`, `worker`, `backend`, and `frontend`. Execute the following for each service, instead of doing step 2 of the above directions:
```
$ docker-compose build <service_name>
```
`service_name` refers to the name of one of the four services. Furthermore, refer to [here](https://www.petefreitag.com/item/848.cfm) for changing the memory limit. By default, it will be set to 2, so you may need to change it to 4 or 5 GB.

- If you find yourself running out of hard drive space due to `<none>` tagged images (enter `docker images` into the terminal to see your images), then you can clean them by executing the following command:
```
$ docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
```
If there are docker containers that are running or stopped, you must kill the running containers and remove them.

Killing a live container:
```
$ docker kill <container_id>
```

Removing a stopped container:
```
$ docker rm <container_id>
```
Then run the `rmi` command above again to clean up the `<none>` tagged images. You should see a drastic increase in hard drive space.

- If you find yourself running into issues with `docker-compose` not being found, refer to [here](https://stackoverflow.com/questions/60992814/docker-compose-command-not-available-for-mac). TL;DR: run the Docker app, if you haven't already, since it downloads more stuff and does a complete install.

### <a name="Manual-Demo"></a>Manual Demo

This subsection goes over how to install Aeolux.ai on your local machine using a more manual approach. The directions are below, and you must follow the directions in *subsubsection order*. <b>Note</b> that multiple terminal/command line windows/tabs need to be opened for this setup to work.

#### <a name="Frontend-Setup"></a>1. Frontend Setup
This subsubsection goes over how to set up the frontend. The directions are below. <b>Note</b> that this section assumes a working installation of NodeJS. Please follow the directions [here](#Manual-Installation) to install NodeJS and other required dependencies for manual setup.

1.1. Open a new terminal/command line window/tab and execute the following commands. <b>Note</b> that you should be in the root of this project.
```
$ cd app/frontend
$ npm install
$ npm start
```

Once the frontend is set up, navigate to `localhost:3000` in your browser of choice, just to see if the React app is live.

#### <a name="Backend-Setup"></a>2. Backend Setup
This subsubsection goes over how to set up the frontend. The directions are below. <b>Note</b> that this section assumes a working installation of conda. Please follow the directions [here](#Manual-Installation) to install conda and other required dependencies for manual setup.

2.1 Open a new terminal/command line window/tab and execute the following commands. <b>Note</b> that you must currently be in the root of this project.
```
$ conda create --name aeolux-backend python=3.7
$ conda activate aeolux-backend
(aeolux-backend) $ cd app/backend/
(aeolux-backend) $ pip install --no-cache-dir --force-reinstall -r requirements.txt
```

2.2 Open a new terminal/command line window/tab and execute the following commands. The commands below are executed from the `app` folder in the terminal/command line. If you find that you are in the `app/backend` folder, navigate backwards to the `app` directory. The first command of the sequence should get you there.
```
$ cd ..
$ chmod +x ./redis-setup.sh
$ ./redis-setup.sh
```

2.3 Switch back to the terminal/command line window from step 2.1 and execute the following command. <b>Note</b> that you should be in the `app/backend` folder:
```
(aeolux-backend) $ celery -A "backend.celery" worker -l info
```

2.4 Open a new terminal/command line window/tab and execute the following commands. The commands below are executed from the `app/backend` folder in the terminal/command line. Navigate there first if the terminal/command line does not start at this path:
```
$ conda activate aeolux-backend
(aeolux-backend) $ python3 backend.py runserver 0.0.0.0:3001
```

Once the the third step is fully executed and the application is running, navigate to `localhost:3000` in your browser of choice. Feel free to upload an Xray image of choice. We will provide some for demo purposes, which can be found in the `examples` folder located in the root of the project.

## <a name="Training-and-Testing"></a>Training and Testing

This section goes over the training and testing procedure used to train and test the object detection models used in Aeolux.ai. It is strongly recommended to use Docker in this scenario, since conflicting dependencies are bound to happen. Nonetheless, a provided manual tutorial is given, but please use with caution as you may inevitably install/uninstall dependencies used by other programs on your computer.

### <a name="General-TT"></a>General Instructions
Follow these instructions below, regardless of the method you choose (either [Docker](#Docker-TT) or [Manual). Make sure that `gdown` is installed (please follow the pre-requisite instructions before proceeding).

1. Download the following files: [vbd_tfobj_data.zip](https://drive.google.com/file/d/14IsbKcsoDIfOZTJGdWYuDG0z6yh8O1pY/view?usp=sharing) and [vbd_yolov5_data.zip](). Extract the contents of these files, and place these files in the directory `vbd_vol` located in the root of this project. Alternatively, execute the following instructions while in this root of this project:
```
$ cd vbd_vol
$ gdown --id 14IsbKcsoDIfOZTJGdWYuDG0z6yh8O1pY && unzip vbd_tfobj_data.zip
$ gdown ... && unzip ...
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
This section will go over how to train and test one of our Tensorflow Object Detection models. We will use an `SSD Mobilenet V2` model for our example. This is more or less generalizable to the other models in Tensorflow Object detection, except different paths need to be specified. Please follow the steps below:

1. Execute the following commands to start the docker container:
```
$ docker run -it -v /absolute/path/to/aeolux:/home/tensorflow/aeolux2 aeoluxdotai/tf_od bash
```
You should now find yourself within the interactive shell of the `aeoluxdotai/tf_od` container. If you would like to specify a port and/or use gpus, include the following tags: 
- `-p PORT:PORT` for the port you want to use
- `--gpus all` ("all" can be replaced by the GPU ID) for gpu usage

2. Execute the following commands to download the pre-trained model:
```
root@#### $ cd /home/tensorflow/aeolux2/modeling/tf_obj && mkdir pre-trained-models
root@#### $ cd pre-trained-models
root@#### $ wget http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz
root@#### $ tar -zxvf ssd_mobilenet_v2_320x320_coco17_tpu-8.tar.gz
```
The download link comes directly from the links provided in Tensorflow 2's Object Detection Model Zoo. The link to the zoo is [here](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md). Use the model zoo to download more pre-trained models of interest.

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
Originally, the `batch_size` within the custom pipeline.config file (located in `modeling/tf_obj/workspace_vbd/models/ssd_mobilenet_v2`) was equal to 128, but if this is too high, please lower to something more reasonable such as 4, 8, or 12.

5. Once the model is finished

#### Training and Testing 
