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

Note: Some commands work just by typing them out, but some require to put a command in string format, wrap it around curly braces, and put an exclamation mark in the front to specify a bash command.

## Notes

### Common Git Commands
1. `git clone clone_url`: Clones a repository
2. `git add some_file`: Adds some file to the queue for committing
3. `git commit -m "my message"`: Commits anything in the add queue to the git branch with the specified message
4. `git checkout -b my_branch`: Creates a new branch named my_branch
5. `git checkout another_branch`: Switch to another_branch
