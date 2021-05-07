# AeoluX.ai - Application

This README goes over the Running the Application section that was featured in the front README. In order to promote clarity, we have limited this README to just talk about relevant sections that relate to the code featured in this directory. Links/references to pre-requisites may not work in this README, so please navigate to the front README for details.

## Table of Contents
* [Running the Application](#Demo)
    * [Dockerized Demo](#Dockerized-Demo)
    * [Manual Demo](#Manual-Demo)

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


