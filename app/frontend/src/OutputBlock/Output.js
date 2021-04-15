import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Dashboard Imports
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Helper Blocks
import Probabilities from './Probabilities';
import Detections from './Detections';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: "850px"
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

export default function Output(props) {
  const {output} = props;
  const classes = useStyles();
  const [outputViewState, setOutputViewState] = useState({
    viewFileName: null, viewDisease: null, viewOriginal: false,
    hiddenDiseases: []
  })

  return (
    <div className={classes.output}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={5} lg={4} className={classes.gridItem}>
            <Paper className={classes.paper}>
                <Probabilities output={output} outputViewState={outputViewState}
                 setOutputViewState={setOutputViewState}/>
            </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={8} className={classes.gridItem}>
            <Paper className={classes.paper}>
                <Detections output={output} outputViewState={outputViewState}/>
            </Paper>
            </Grid>
        </Grid>
    </div>
  );
}