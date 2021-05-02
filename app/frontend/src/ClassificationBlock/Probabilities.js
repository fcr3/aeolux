import React, {useState} from 'react';
// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: 32,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      overflowY: 'auto',
      maxHeight: "calc(50vh - 150px)",
      minHeight: "352px"
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
        backgroundColor: "white",
        color: "gray",
        fontWeight: "bold",
        fontFamily: "Source Sans Pro",
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
    }
  }));

export default function Probabilities(props) {
    const classes = useStyles();
    const {output} = props;
    const [expandedViewState, setExpandedViewState] = useState('');
    const probabilities = output;

    const diseaseColorMap = {
        0: '#E8BBB0',
        1: '#6BD9BF',
        2: '#9FCBFF'
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6" style={{
                color: "#69B3C7", marginBottom: 16,
                borderBottom: "solid #69B3C7",
                paddingBottom: 8
            }}>
                Suspected Abnormality Files
            </Typography>
            {
                probabilities.map((val, index) => {

                    let sorted_probs = Object.entries(
                        val['probabilities']
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
                        <Accordion key={index} style={{
                            width: "100%"
                        }} 
                         expanded={expandedViewState === val['fileName']}
                         onChange={() => {
                            if (expandedViewState === val['fileName']) {
                                setExpandedViewState('');
                            } else {
                                setExpandedViewState(val['fileName']);
                            }
                         }}
                        >
                            <AccordionSummary
                             expandIcon={<ExpandMoreIcon />}
                             >
                                {val['fileName']}
                            </AccordionSummary>
                            <AccordionDetails style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start'
                            }}>
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
                                                    textAlign: 'start'
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
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </div>
      );
}