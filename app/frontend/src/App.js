import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

// AppBar Imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// Dashboard Imports
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import UploadBlock from './UploadBlock/Upload';
import OutputBlock from './DetectionBlock/Output';
import ClfBlock from './ClassificationBlock/Classification';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: "850px",
  },
  appBar: {
    backgroundColor: "white"
  },
  menuButton: {
    color: "#69B3C7",
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#69B3C7",
    fontFamily: "Lora"
  },
  paper: {
    height: "100%",
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    marginTop: 72,
    padding: "16px 32px 32px 32px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  output: {
    padding: "0px 32px 32px 32px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  gridItem: {
    height: "50vh",
    minHeight: "500px"
  }
}));

export default function App() {
  const classes = useStyles();
  const [appState, setAppState] = useState({
    showOutput1: false, showOutput2: false
  });

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} 
           color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            AeoluX.ai
          </Typography>
        </Toolbar>
      </AppBar>


      <div className={classes.input}>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.gridItem}>
            <Paper className={classes.paper}>
              <UploadBlock setState={setAppState}/>
            </Paper>
          </Grid>
        </Grid>
      </div>

      {
        appState.showOutput1 ? 
        (<ClfBlock output={
          appState.output1 ? appState.output1 : null}/>) 
        : 
        null
      }

      {
        appState.showOutput2 ? 
        (<OutputBlock output={
          appState.output2 ? appState.output2 : null}/>) 
        : 
        null
      }
    </div>
  );
}