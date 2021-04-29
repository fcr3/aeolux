# AeoluX.ai

## Table of Contents
* [Overview](#Overview)
* [Prerequisites](#Prerequisites)
    * [Dockerized Installation](#Dockerized-Installation)
    * [Manual Installation](#Manual-Installation)
* [Running the Application](#Demo)
    * [Dockerized Demo](#Dockerized-Demo)
    * [Manual Demo](#Manual-Demo)
* [Training and Testing](#Training-and-Testing)

## <a name="Overview"></a>Overview

This repository serves as the codebase for the Aeolux.ai project.

## <a name="Prerequisites"></a>Prerequisites

This section goes over the installation of Aeolux onto a local machine. The recommended way to install this application requires the use of Docker. However, if there is any issue with installing Docker, please follow the [Manual Installation](#Manual-Installation) directions. Finally, in the terminal window/GitBash window/command line, please clone this project into a folder of your choosing. You can also do it manually via the GitHub UI. The command to clone is below:

Usual Method:
```
$ git clone https://github.com/fcr3/aeolux.git
```
SSH Method:
```
$ git clone git@github.com:fcr3/aeolux.git
```

### <a name="Dockerized-Installation"></a>Dockerized Installation

This subsection introduces some links that you can follow to install the necessary prerequisites. As stated previously, the requirement of Docker is recommended, so please follow this [link](https://docs.docker.com/get-docker/) to install Docker on your local machine. Additionally, please follow this [link](https://docs.docker.com/compose/install/) to install Docker Compose on your local machine. Docker provides a kernel level abstraction to contain individual applications, while Docker Compose spins up multiple containers to work with each other.

### <a name="Manual-Installation"></a>Manual Installation

If you cannot install Docker on your machine, you need to install the following packages:
- [Conda](https://docs.anaconda.com/anaconda/install/): Follow the links/directions in the provided [Conda](https://docs.anaconda.com/anaconda/install/) link to install the appropriate Anaconda/Miniconda environment manager. This will ease the installation/development process so you can manage conflicting Python dependencies.
- [NodeJS](https://nodejs.org/en/download/): This requirement is necessary for running our React application. Additionally, [here (homebrew)](https://nodejs.dev/learn/how-to-install-nodejs) and [here (manual)](https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/) are two MacOS installation guides, and [here](https://phoenixnap.com/kb/install-node-js-npm-on-windows) is a windows installation guide.

A soft preqrequisite that will speed up the application is the installation of CUDA. However, the installation of CUDA is often unattainable for many machines due to the unavailability of an installed Nvidia GPU. Nonetheless, if you would like to install CUDA on your machine and you have one/many capable Nvidia GPU(s), please follow this [link](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html). Once you have installed CUDA on your machine and you would like to use GPU(s) in your docker container, please follow this [link](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker) to install Nvidia-Docker. Then, when you are about to create a new docker container, specificy the following:
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
2. Execuate the following command:
```
$ docker-compose build
```
3. Execute the following command:
```
$ docker-compose up
```

Once the the third step is fully executed and the application is running, navigate to `localhost:3000` in your browser of choice. Feel free to upload an Xray image of choice. We will provide some for demo purposes, which can be found in the `examples` folder located in the root of the project.

### <a name="Manual-Demo"></a>Manual Demo

This subsection goes over how to install Aeolux.ai on your local machine using a more manual approach. The directions are below.

## <a name="Training-and-Testing"></a>Training and Testing

This section goes over the training and testing procedure used to train and test the object detection models used in Aeolux.ai. It is strongly recommended to use Docker in this scenario, since conflicting dependencies are bound to happen. Nonetheless, a provided manual tutorial is given, but please use with caution as you may inevitably install/uninstall dependencies used by other programs on your computer.
___________________________________________________________________________

## Getting Started

### Local Machine (Linux and probably Mac)

1. Clone the repository by entering in the terminal:
```
$ git clone git@github.com:fcr3/aeolux.git

- or - 

$ git clone https://github.com/fcr3/aeolux.git
```

Note: The windows setup is not too far off, but you need to install Git Bash first and then run these commands. You can also use the interface that Github provides to clone repositories.

### Google Colab

This setup is only for those who have Google Colab connected as an app to their Google Drive. If you do not have this set up, do the following:

1. Go to New -> More -> Connect More Apps
2. Search or find the app called "Colaboratory"
3. Click on this app and install it

Once you have installed Google Colab, do the following:

1. Click on New -> More -> Google Colaboratory
2. In the first cell, enter the following:
```
from google.colab import drive
drive.mount('/content/gdrive')
```
3. In the second cell, navigate towards a repository of your choice:
```
cd "gdrive/MyDrive/INDENG 135"
```
4. In the third cell, clone the repository:
```
! {"git clone https://github.com/fcr3/aeolux.git"}
```

Note: Some commands work just by typing them out, but some require to put a command in string format, wrap it around curly braces, and put an exclamation mark in the front to specify a bash command.

## Notes

### Common Git Commands
1. `git clone clone_url`: Clones a repository
2. `git add some_file`: Adds some file to the queue for committing
3. `git commit -m "my message"`: Commits anything in the add queue to the git branch with the specified message
4. `git checkout -b my_branch`: Creates a new branch named my_branch
5. `git checkout another_branch`: Switch to another_branch
