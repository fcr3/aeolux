import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import urls from '../urls';

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

export default function Upload(props) {
    const {setState} = props;
    const classes = useStyles();
    const [display, setDisplay] = useState('list');
    const [uploadedData, setUploadedData] = useState([]);

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
                        <div>
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
                        maxHeight: "calc(50vh - 200px)",
                        minHeight: "320px",
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
                                                    width: "70%", height: "auto"
                                                }}/>
                                            </Paper>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                    </div>

                    <Button variant="contained" className={classes.button} onClick={
                        () => {
                            axios.post(urls.base + '/detect', {data: uploadedData}, {
                                headers: {'Content-Type': 'application/json'},
                                withCredentials: true
                            }).then((res) => {
                                console.log(res.data);
                                setState((prevState) => {
                                    return {
                                        ...prevState,
                                        output: uploadedData.map((val) => {
                                            return {
                                                ...val,
                                                detections: {
                                                    'Pneumonia': [
                                                        {x: 200, y: 170, w: 100, h: 100, p:0.9},
                                                        {x: 400, y: 200, w: 100, h: 100, p:0.85},
                                                    ],
                                                    'Edema': [
                                                        {x: 350, y: 150, w: 50, h: 40, p:0.60},
                                                    ],
                                                    'Lung Opacity': [
                                                        {x: 270, y: 80, w: 40, h: 100, p:0.73},
                                                    ]
                                                }
                                            }
                                        }),
                                        showOutput: true
                                    }
                                });
                            })
                        }
                     }>
                        Run Pre-Diagnosis
                    </Button>
                </Grid>
            </Grid>
        </div>
      );
}