import React, {useEffect, useRef} from 'react'
import diseaseColorMap from './DiseaseMap';

export default function Canvass(props) {
    const canvasRef = useRef();
    const ctx = useRef();
  
    useEffect(() => {
        ctx.current = canvasRef.current.getContext('2d')
        canvasRef.current.width = canvasRef.current.width;
        const backgroundImage = new window.Image()
        backgroundImage.src = props.src

        backgroundImage.onload = function() {
            // Create Temporary Canvas for Drawing
            const width = 1024;
            const height = 1024;

            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.getContext('2d').drawImage(backgroundImage, 0, 0);
            
            let scale = props.zoomScale ? props.zoomScale : 0.5;
            ctx.current.width = width*scale;
            ctx.current.height = height*scale;
            ctx.current.drawImage(
                tempCanvas, 
                0, 0, width, height, 
                0, 0, width*scale, height*scale);
            ctx.current.lineWidth = 4;
            const detectionPairs = Object.entries(props.detections);
            for (const [k, v] of detectionPairs) {
                ctx.current.strokeStyle = diseaseColorMap[k];
                if (props.hiddenDiseases && props.hiddenDiseases.includes(k)) {
                    continue;
                }
                for (const {x, y, w, h, p} of v) {
                    ctx.current.fillStyle = "white";
                    ctx.current.font = "bold 12px Arial";
                    ctx.current.fillText(`P=${(p*100).toFixed(2)}%`, x*scale, (y - 8)*scale);
                    ctx.current.strokeRect(x*scale, y*scale, w*scale, h*scale);
                }
            }
        }
    }, [props.src, props.detections, props.hiddenDiseases, props.zoomScale]);

    if (props.zoomScale === null) {
        return (
            <div>
                <canvas ref={canvasRef} width="512" height="512"/>
            </div>
        )
    }

    return (
      <div style={{
          marginTop: 1000, marginBottom: 100, marginLeft: 1000
        }}>
        <canvas ref={canvasRef} width="1024" height="1024"/>
      </div>
    );
  }