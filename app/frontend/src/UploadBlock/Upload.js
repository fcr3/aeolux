import React, {useState, useRef} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import urls from '../urls';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 32
    },
    subtitle: {
        flexGrow: 1,
        color: "#69B3C7",
        fontFamily: "Lora",
        marginBottom: 16
    },
    textbox: {
        fontFamily: "Roboto",
        marginBottom: 8
    },
    button: {
        backgroundColor: "#E8BBB0",
        color: "white",
        width: "160px",
        fontFamily: "Source Sans Pro",
        '&:hover': {
            background: "#E8BBB0",
            color: "white"
        }
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Upload(props) {
    const {setState} = props;
    const classes = useStyles();
    const [display, setDisplay] = useState('list');
    const [uploadedData, setUploadedData] = useState([]);
    const [pendingState, setPendingState] = useState({
        task_id: null, interval_ref: null,
        status: null
    });
    const [alert, setAlert] = useState({
        open: false, message: null, severity: null
    })
    let pendingRef = useRef();
    pendingRef.current = pendingState;

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

    const handleUpload = ({target}) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            setUploadedData((prevState) => {
                return [...prevState, {
                    fileName: target.files[0].name,
                    fileData: e.target.result
                }]
            })
        }
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
                    return {...prevState, status: res.data.state}
                })
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
                        output1: res.data.result_info,
                        showOutput1: true
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
        axios.post(urls.base + '/classify', {data: uploadedData}, {
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
        <div className={classes.root}>
            <Grid container spacing={6} style={{
                height: "calc(50vh - 40px)",
                minHeight: "450px"
            }}> 
                <Grid item xs={3}>
                    <div style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex", flexDirection: "column",
                            justifyContent: "center", alignItems: "center"
                        }}>
                            <Typography variant="h5" style={{
                                color: "#69B3C7", marginBottom: 8
                            }}>
                                Enter Metadata
                            </Typography>
                            <TextField id="outlined-basic" className={classes.textbox}
                            label="Age" variant="outlined"/>
                            <TextField id="outlined-basic" className={classes.textbox}
                            label="Gender" variant="outlined"/>
                            <Button
                                className={classes.button}
                                variant="contained"
                                component="span" 
                                onClick={() => {
                                    axios.get(urls.base + '/test_connection').then((res) => {
                                        console.log(res.data);
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                                }}>
                                Save
                            </Button>
                        </div>

                        <div>
                            <Typography variant="h5" style={{
                                color: "#69B3C7", marginBottom: 8
                            }}>
                                Upload Photo
                                
                            </Typography>

                            <label htmlFor="btn-upload">
                                <input
                                    id="btn-upload"
                                    name="btn-upload"
                                    style={{ display: 'none' }}
                                    type="file"
                                    onChange={handleUpload} />
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    component="span" >
                                    Upload
                                </Button>
                            </label>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div style={{
                        width: "100%",
                        display: "flex", 
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8
                    }}>
                        <Typography variant="h5" style={{color: "#69B3C7"}}>
                            Uploaded File
                        </Typography>
                        <div>
                            <Button variant="outlined" style={{marginRight: 4}}
                             onClick={() => setDisplay('list')}>
                                <ListIcon/>
                            </Button>
                            <Button variant="outlined" 
                             onClick={() => setDisplay('images')}>
                                <DashboardIcon />
                            </Button>
                        </div>
                    </div>

                    <div style={{
                        width: "calc(100% - 30px)", 
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        maxHeight: "calc(50vh - 240px)",
                        minHeight: "300px",
                        overflowY: "auto",
                        backgroundColor: "#ebebeb",
                        paddingTop: 16,
                        paddingLeft: 16,
                        paddingRight: 16,
                        marginBottom: 8,
                        borderRadius: 8
                    }}>
                    {
                        uploadedData.map((v, i) => {
                            return (
                                <div key={i} style={{marginBottom: 8}}>
                                    { 
                                        display === 'list' ? 
                                        ` - ${v['fileName']}` :
                                        (
                                            <Paper elevantion={3} style={{
                                                padding: 8,
                                                display: 'flex', flexDirection: 'column',
                                                justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                File Name: {v['fileName']}<br/><br/>
                                                <img src={v['fileData']} style={{
                                                    width: "33%", height: "auto"
                                                }} alt={v['fileName']}/>
                                            </Paper>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                    </div>

                    {
                        pendingState.status === null ?
                        (
                            <Button variant="contained" className={classes.button} 
                            onClick={() => handlePending()}> 
                                    Run Pre-Diagnosis
                            </Button>
                        ) : (
                            <div style={{marginTop: 8, marginBottom: 8}}>
                            <CircularProgress/>
                            </div>
                        )
                    }
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