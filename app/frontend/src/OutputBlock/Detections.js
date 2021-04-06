import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Canvas from './Canvas';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        overflowY: 'auto',
        maxHeight: "calc(50vh - 100px)",
        minHeight: "400px"
      },
}));

export default function Detections(props) {
    const classes = useStyles();
    const {output, outputViewState} = props;

    
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
                    <div style={{
                        maxHeight: "100%", marginTop: 8, position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Canvas src={specificOutput['fileData']} 
                         detections={specificOutput['detections']} 
                         hiddenDiseases={outputViewState.hiddenDiseases}/>

                    </div>
                ) : output.map((val, i) => {
                    return (
                        <div key={i} style={{textAlign: "start"}}>
                            Input File {i+1}: {val['fileName']}<br/><br/>
                            <Canvas src={val['fileData']} 
                             detections={val['detections']} 
                             hiddenDiseases={outputViewState.hiddenDiseases}/>
                        </div>
                    )
                })
            }
        </div>
    )
}