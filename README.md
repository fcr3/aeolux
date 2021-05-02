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
    * [Dockerized Training and Testing](#Docker-TT)
    * [Manual Training and Testing](#Manual-TT)

## <a name="Overview"></a>Overview

This repository serves as the codebase for the Aeolux.ai project.

## <a name="Section-Diagram"></a>Relevant-Section Diagram
Below is a setup diagram to help ease the navigation of the README. The relevant sections will be in order from top to bottom and connected via edges:
```
------------
| Overview |
------------
      |
---------------
|Prerequisites|
---------------
   |         \
----------  -----------
| Docker |  | Manual  |
| Install|  | Install |
----------  -----------
   |         /
---------------------------
| Running the Application |
---------------------------
   |         \
----------  -----------
| Docker |  | Manual  |
| Demo   |  | Demo    |
----------  -----------
  |          /
------------------------
| Training and Testing |
------------------------
  |          \
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
$ gdown --id 1sS2S-n__uL7uqll55sCKJvosxRHi858_
$ mv aeolux_models.zip app/backend/.
```

3. If you are working on a Linux machine, you can execute the following command. <b>Note</b> that you should be in the root of the project directory.
```
$ cd app/backend/
$ unzip aeolux_models.zip
```
If the `unzip` command does not work, you can also unzip the `.zip` file using MacOS or Windows UI. <b>Note</b> that the `aeolux_models.zip` will be located in `app/backend`.

### <a name="Dockerized-Installation"></a>Dockerized Installation

This subsection introduces some links that you can follow to install the necessary prerequisites. As stated previously, the requirement of Docker is recommended, so please follow this [link](https://docs.docker.com/get-docker/) to install Docker on your local machine. Additionally, please follow this [link](https://docs.docker.com/compose/install/) to install Docker Compose on your local machine. Docker provides a kernel level abstraction to contain individual applications, while Docker Compose spins up multiple containers to work with each other.

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

This subsection goes over how to install Aeolux.ai on your local machine using Docker. The directions are below.

1. Navigate to the `app` directory located in the root of this project:
```
$ cd app
```
2. Execute the following command:
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
`service_name` refers to the name of one of the four services.


### <a name="Manual-Demo"></a>Manual Demo

This subsection goes over how to install Aeolux.ai on your local machine using a more manual approach. The directions are below, and you must follow the directions in *subsubsection order*. <b>Note</b> that multiple terminal/command line windows/tabs need to be opened for this setup to work.

#### <a name="Frontend-Setup"></a>1. Frontend Setup
This subsubsection goes over how to set up the frontend. The directions are below. <b>Note</b> that this section assumes a working installation of NodeJS. Please follow the directions [here](#Manual-Installation) to install NodeJS and other required dependencies for manual setup.

1.1. Open a new terminal/command line window/tab and execute the following commands. <b>Note</b> that you should be in the root of the project directory:
```
$ cd app/frontend
$ npm install
$ npm start
```

Once the frontend is set up, navigate to `localhost:3000` in your browser of choice, just to see if the React app is live.

#### <a name="Backend-Setup"></a>2. Backend Setup
This subsubsection goes over how to set up the frontend. The directions are below. <b>Note</b> that this section assumes a working installation of conda. Please follow the directions [here](#Manual-Installation) to install conda and other required dependencies for manual setup.

2.1 Open a new terminal/command line window/tab and execute the following commands:
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

