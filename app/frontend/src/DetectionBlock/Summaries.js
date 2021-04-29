import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CanvasJSReact from '../canvas/canvasjs.react';

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


const diseaseMap = {
    "0": "None",
    "1": "Pneumonia"
}

export default function Summaries(props) {
    const classes = useStyles();
    const {output} = props;
    const {CanvasJSChart} = CanvasJSReact;

    console.log(output)

    const num_detections_per_label = Object.entries(
        output.reduce((a, v) => {
            for (const label in v['detections']) {
                if (!(label in a)) {
                    a[label] = 0;
                }
                a[label] += v['detections'][label].length;
            }
            return a;
    }, {})).map(([k, v]) => {
        return {label: k, y: v};
    });

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"
        title:{
            fontSize: 18,
            text: "Detections per Disease"
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: num_detections_per_label
        }]
    }

    return (
        <div className={classes.root}>
            <Typography variant="h6" style={{
                color: "#69B3C7", marginBottom: 16,
                borderBottom: "solid #69B3C7",
                paddingBottom: 8
            }}>
               Summary
            </Typography>
            <CanvasJSChart options={options} />
        </div>
    )
}