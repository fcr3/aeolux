import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Dashboard Imports
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

// Helper Blocks
import Summaries from './Summaries';

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
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

export default function Output(props) {
  const {output} = props;
  const classes = useStyles();
  const [outputViewState, setOutputViewState] = useState({
    viewFileName: null, viewDisease: null, viewOriginal: false,
    hiddenDiseases: []
  })

  console.log(output);

  return (
    <div>
      Temporary
    </div>
  )

//   return (
//     <div className={classes.output}>
//         <Grid container spacing={3}>            
//             <Grid item xs={12} className={classes.gridItem}>
//             <Paper className={classes.paper}>
//                 <Summaries output={output} outputViewState={outputViewState}/>
//             </Paper>
//             </Grid>
//         </Grid>
//     </div>
//   );
}