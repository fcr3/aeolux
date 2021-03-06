import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CanvasJSReact from '../canvas/canvasjs.react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';

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
      },
}));

export default function DetectGraph(props) {
    const classes = useStyles();
    const {output, setViewState} = props;
    const {CanvasJSChart} = CanvasJSReact;

    console.log(output)

    const num_detections_per_label = Object.entries(
        output['detections']
    ).map(([k, v]) => {
        return {label: k, y: v.length};
    });

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"
        title: {
            fontSize: 18,
            text: `Disease Detected`
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            // indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: num_detections_per_label
        }]
    }

    return (
        <div className={classes.root}>
            <div style={{display: 'flex', flexDirection: 'row', marginBottom: 16, alignItems: "center"}}>
                <Fab color="primary" style={{color: "white", marginRight: 32}} onClick={() => {
                    setViewState((prevState) => {
                        return {
                            ...prevState, viewFileName: null
                        }
                    })
                }}>
                    <ArrowBackIcon />
                </Fab>
                <Typography variant="h6" style={{
                    color: "#69B3C7", marginBottom: 16,
                    borderBottom: "solid #69B3C7",
                    paddingBottom: 8
                }}>
                    Input: {output['fileName']}
                </Typography>
            </div>
            <CanvasJSChart options={options} />
        </div>
    )
}