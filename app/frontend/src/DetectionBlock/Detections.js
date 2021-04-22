import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Canvas from './Canvas';
import Fab from '@material-ui/core/Fab';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        overflowY: 'auto',
        maxHeight: "calc(50vh - 100px)",
        minHeight: "400px",
        position: "relative"
    },
    fab2: {
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
    fab1: {
        position: 'absolute',
        bottom: theme.spacing(12),
        right: theme.spacing(4),
    },
    fab0: {
        position: 'absolute',
        bottom: theme.spacing(20),
        right: theme.spacing(4),
        color: "white"
    },
}));

export default function Detections(props) {
    const classes = useStyles();
    const {output, outputViewState} = props;
    const [zoomScale, setZoomScale] = useState(0.5);
    const [alert, setAlert] = useState({
        open: false, message: null, severity: null
    })
    
    let viewImage = null;
    let specificOutput = null;
    const {viewFileName, viewDisease, viewOriginal} = outputViewState;
    if (outputViewState.viewFileName) {
        let filteredOutput = output.filter((val) => {
            return val['fileName'] === viewFileName;
        });
        if (filteredOutput.length === 1) {
            specificOutput = filteredOutput[0];
            viewImage = specificOutput['fileData'];
        }
    }

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

    return (
        <div className={classes.root}>
            <Typography variant="h6" style={{
                color: "#69B3C7", marginBottom: 16,
                borderBottom: "solid #69B3C7",
                paddingBottom: 8
            }}>
                Detection Output: {viewFileName ? viewFileName : 'All'}
            </Typography>

            {
                viewFileName ? (
                    <Paper elevation={5} style={{
                        marginTop: 8, position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        overflow: "auto", maxHeight: "100%",
                        width: "85%"
                    }}>
                        <Canvas src={specificOutput['fileData']} 
                         detections={specificOutput['detections']}
                         zoomScale={zoomScale}
                         hiddenDiseases={outputViewState.hiddenDiseases}/>
                    </Paper>
                ) : output.map((val, i) => {
                    return (
                        <div key={i} style={{
                            textAlign: "start", width: "100%", 
                            marginBottom: 32
                        }}>
                            Input File {i+1}: {val['fileName']}<br/><br/>
                            <Canvas src={val['fileData']} 
                             detections={val['detections']}
                             zoomScale={null}
                             hiddenDiseases={outputViewState.hiddenDiseases}/>
                        </div>
                    )
                })
            }
            {
                viewFileName ? (
                    <Fab color="primary" className={classes.fab0}>
                        {zoomScale.toFixed(2)}x
                    </Fab>
                ) : null
            }
            {
                viewFileName ? (
                    <Fab color="primary" className={classes.fab1} onClick={
                        () => {
                            if (zoomScale + 0.05 > 1.01) {
                                setAlert({
                                    message: "Cannot scale above 1x",
                                    open: true, severity: "error"
                                });
                                return;
                            }
                            setZoomScale(prevScale => prevScale + 0.05);
                        }
                    }>
                        <ZoomInIcon style={{color: "white"}}/>
                    </Fab>
                ) : null
            }
            {
                viewFileName ? (
                    <Fab color="primary" className={classes.fab2} onClick={
                        () => {
                            if (zoomScale - 0.05 < 0.299) {
                                setAlert({
                                    message: "Cannot scale below 0.3x",
                                    open: true, severity: "error"
                                });
                                return;
                            }
                            setZoomScale(prevScale => prevScale - 0.05);
                        }
                    }>
                        <ZoomOutIcon style={{color: "white"}}/>
                    </Fab>
                ) : null
            }

            <Snackbar open={alert.open} autoHideDuration={6000} onClose={
                handleClose
            }>
                <Alert onClose={handleClose} severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    )
}