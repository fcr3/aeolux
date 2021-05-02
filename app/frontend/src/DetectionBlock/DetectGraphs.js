import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Dashboard Imports
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Helper Blocks
import DetectGraph from './DetectGraph';

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

export default function DetectGraphs(props) {
  const {output} = props;
  const classes = useStyles();
  const [outputViewState, setOutputViewState] = useState({
    viewFileName: null, viewDisease: null, viewOriginal: false,
    hiddenDiseases: []
  });

  const diseaseColorMap = {
    0: '#E8BBB0',
    1: '#6BD9BF',
    2: '#9FCBFF'
  };

  const output_map = output.reduce((a, v) => {
    a[v['fileName']] = v;
    return a;
  }, {})

  return (
    <div className={classes.output}>
        <Grid container spacing={3}>       
            <Grid item xs={12} sm={12} md={12} className={classes.gridItem} style={{
                  overflowY: "hidden"
            }}>
            {
              outputViewState.viewFileName === null ? (
                <div className={classes.paper}>
                    <Typography variant="h6" style={{
                        color: "#69B3C7", marginBottom: 16,
                        borderBottom: "solid #69B3C7",
                        paddingBottom: 8
                    }}>
                        Detection Graphs
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
                              v['detections']
                          ).map(([k,v]) => {
                              return [k, v.length]
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
                                                    N={v}
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
                                View All Detections
                              </Button>
                              </Paper>
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                </div>
              ) : (
                <div>
                  <DetectGraph output={
                    output_map[outputViewState.viewFileName]} 
                    setViewState={setOutputViewState}
                    outputViewState={outputViewState}/>
                </div>
              )
            }
            </Grid>
        </Grid>
    </div>
  );
}