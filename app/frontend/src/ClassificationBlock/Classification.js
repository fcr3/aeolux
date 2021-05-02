import React, {useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as axios from 'axios';

// Dashboard Imports
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import urls from '../urls';
import CircularProgress from '@material-ui/core/CircularProgress';

// Helper Blocks
import Summaries from './Summaries';
import Probabilities from './Probabilities';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    padding: 32,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflowY: 'auto',
    maxHeight: "calc(50vh - 100px)",
    minHeight: "411px"
  },
  button: {
    backgroundColor: "#E8BBB0",
    color: "white",
    width: "100%",
    fontFamily: "Source Sans Pro",
    '&:hover': {
        background: "#E8BBB0",
        color: "white"
    }
  },
  small_paper: {
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
    alignItems: "center",
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
  const {output, setState} = props;
  const classes = useStyles();
  const [outputViewState, setOutputViewState] = useState({
    viewFileName: null, viewDisease: null, viewOriginal: false,
    hiddenDiseases: []
  });
  const [pendingState, setPendingState] = useState({
      task_id: null, interval_ref: null,
      status: null
  });
  const [alert, setAlert] = useState({
      open: false, message: null, severity: null
  })
  let pendingRef = useRef();
  pendingRef.current = pendingState;

  const diseaseColorMap = {
    0: '#E8BBB0',
    1: '#6BD9BF',
    2: '#9FCBFF'
  };

  const output_map = output.reduce((a, v) => {
    a[v['fileName']] = v;
    return a;
  }, {})

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setAlert((prevState) => {
          return {
              ...prevState,
              open: false
          }
      })
  }

  const handleResult = () => {
      console.log("Handle Result Called");
      const pendingState = pendingRef.current;
      console.log(pendingState);

      if (pendingState.task_id === null && pendingState.interval_ref === null) {
          return;
      }

      if (pendingState.task_id === null && pendingState.interval_ref !== null) {
          clearInterval(pendingState.interval_ref)
          setPendingState((prevState) => {
              return {...prevState, interval_ref: null}
          })
          return;
      }

      axios.get(
          urls.base + `/status/${pendingState.task_id}`
      ).then((res) => {
          console.log(res.data);

          if (res.data.state === 'FAILURE' || res.data.state === 'incomplete') {
              clearInterval(pendingState.interval_ref);
              setPendingState((prevState) => {
                  return {...prevState, status: null}
              })
              setAlert({
                severity: "error", open: true,
                message: "Inference was unsuccessful. Try again."
            });
              return;
          }

          if (res.data.state === 'PENDING') {
              setPendingState((prevState) => {
                  return {...prevState, status: res.data.state}
              })
              return;
          }

          if (res.data.state === 'SUCCESS') {
              console.log("Cleared Interval!");
              clearInterval(pendingState.interval_ref);
              setPendingState({
                  task_id: null, interval_ref: null, status: null
              })
              setAlert({
                  severity: "success", open: true,
                  message: "Inference was successful!"
              });
              setState((prevState) => {
                  return {
                      ...prevState,
                      output2: res.data.result_info,
                      showOutput2: true
                  }
              });
          }
      }).catch((err) => {
          clearInterval(pendingState.interval_ref);
          console.log(err);
          setPendingState({
              task_id: null, interval_ref: null, status: null
          })
          setAlert({
              severity: "error", open: true,
              message: "There was an error with inference. Try again."
          });
      });
  }

  const handlePending = () => {
      let specificOutputs = output.filter((val) => {
        const probabilities = val['probabilities'];
        for (const disease in probabilities) {
          if (probabilities[disease] > 0.5) {
            return true;
          }
        }
        return false;
      }).map((val) => {
        const {fileName, fileData} = val;
        return {fileName, fileData}
      });

      axios.post(urls.base + '/detect', {data: specificOutputs}, {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
      }).then((res) => {
          console.log(res.data);
          setPendingState({
              task_id: res.data.task_id,
              status: 'PENDING',
              interval_ref: setInterval(handleResult, 2000)
          })
      });
  }

  return (
    <div className={classes.output}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper style={{
                padding: 16
              }}>
                <Typography variant="h6" style={{
                    color: "#69B3C7", marginBottom: 16,
                    borderBottom: "solid #69B3C7",
                    paddingBottom: 8
                }}>
                    Stage One: Preliminary Results
                </Typography>
              </Paper> 
            </Grid>  

            <Grid item xs={12} sm={12} md={8} className={classes.gridItem} style={{
                  overflowY: "hidden"
            }}>
            {
              outputViewState.viewFileName === null ? (
                <Paper className={classes.paper}>
                    <Typography variant="h6" style={{
                        color: "#69B3C7", marginBottom: 16,
                        borderBottom: "solid #69B3C7",
                        paddingBottom: 8
                    }}>
                        Classifications
                    </Typography>
                    <Grid spacing={3} style={{
                      marginTop: 2,
                      padding: 16,
                      width: "100%",
                      overflowY: "auto",
                      height: "100%"
                    }}
                    container direction="row" justify="flex-start" alignItems="center">
                      {
                        output.map((v, i) => {
                          
                          let sorted_probs = Object.entries(
                              v['probabilities']
                          ).map(([k,v]) => {
                              return [k, v]
                          });
                          sorted_probs.sort((a, b) => {
                              return b[1] - a[1];
                          })
                          sorted_probs = sorted_probs.filter((v, i) => {
                              return i < 3;
                          });

                          return (
                            <Grid key={i} item xs={12} sm={12} md={6}>
                              <Paper style={{
                                height: 'auto', padding: 16, textAlign: 'start',
                                display: 'flex', flexDirection: 'column',
                                justifyContent: ''
                              }}>
                                Input: {v['fileName']}<br/><br/>
                              {
                                sorted_probs.map(([k, v], i) => {
                                    return (
                                        <div key={i} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            width: "95%",
                                            marginBottom: 16
                                        }}>
                                            <div style={{
                                                width: "100%",
                                                borderLeft: `solid ${diseaseColorMap[i]}`,
                                                paddingLeft: 8, 
                                                display: 'flex', 
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                alignItems: 'center',
                                                
                                            }}>
                                                Top {i+1}: {k}
                                                <div>
                                                    P={v.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                              }
                              <Button className={classes.button} variant="contained" onClick={
                                () => setOutputViewState((prevState) => {
                                  return {
                                    ...prevState, viewFileName: v['fileName']
                                  }
                                })
                              }>
                                View All Classifications
                              </Button>
                              </Paper>
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                </Paper>
              ) : (
                <Paper>
                  <Summaries output={
                    output_map[outputViewState.viewFileName]} 
                    setViewState={setOutputViewState}
                    outputViewState={outputViewState}/>
                </Paper>
              )
            }
            </Grid>

            <Grid item xs={12} sm={12} md={4} className={classes.gridItem}>
            <Paper className={classes.small_paper}>
                <Probabilities output={output} outputViewState={outputViewState}
                 setOutputViewState={setOutputViewState}/>
                {
                    pendingState.status === null ?
                    (
                        <Button className={classes.button} variant="contained" style={{
                          width: "80%", marginTop: 8
                        }} onClick={
                          () => handlePending()
                        }>
                          Detect Abnormalities
                        </Button>
                    ) : (
                        <div style={{marginTop: 8, marginBottom: 8}}>
                        <CircularProgress/>
                        </div>
                    )
                }
            </Paper>
            </Grid>
        </Grid>

        <Snackbar open={alert.open} autoHideDuration={6000} onClose={
            handleClose
        }>
            <Alert onClose={handleClose} severity={alert.severity}>
                {alert.message}
            </Alert>
        </Snackbar>
    </div>
  );
}