# TF Object Detection API Docs

## Training Pipeline

1. git clone https://github.com/tensorflow/models.git
2. Try to set it up locally, but tbh, you probably will have a better time running docker. 

## Known Bugs with TF Object Detection API

1. Installation is a pain. Try to use docker instead or google colab.
2. If you are missing dependencies in official, simply copy the official folder in models/official into the site-packages folder of python. To find the site-packages folder, do:
```
$ python3
>>> import tensorflow as tf
>>> tf.__path__
```
The output should involve you going through some site-packages folder. Navigate to there, and then copy the models/official folder into this place. 