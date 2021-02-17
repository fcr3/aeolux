# AeoluX.ai

This repository serves as the codebase for the Aeolux.ai project.

## Getting Started

### Local Machine (Linux and probably Mac)

1. Clone the repository by entering in the terminal:
```
$ git clone git@github.com:fcr3/aeolux.git
or 
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


