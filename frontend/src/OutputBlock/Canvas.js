import React, {Component, useEffect, useRef} from 'react'

function rect(props) {
    const {ctx, x, y, width, height} = props;
    ctx.fillRect(x, y, width, height);
}

export default function Canvas(props) {
    const canvasRef = useRef();
    const ctx = useRef();

    const diseaseColorMap = {
        'Pneumonia': '#E8BBB0',
        'Edema': '#6BD9BF',
        'Lung Opacity': '#9FCBFF'
    };
  
    useEffect(() => {
        ctx.current = canvasRef.current.getContext('2d')
        const backgroundImage = new window.Image()
        backgroundImage.src = props.src

        backgroundImage.onload = function() {
            const {width, height} = ctx.current;
            ctx.current.clearRect(width/2, 0, width, height);

            // Comment out to draw grid

            // ctx.current.strokeStyle = "white"
            // ctx.current.canvas.width  = 1000;
            // ctx.current.canvas.height = 400;
            // for (let x=0; x<=1000; x+=50) {
            //     for (let y=0; y<=1000; y+=50) {
            //         ctx.current.moveTo(x, 0);
            //         ctx.current.lineTo(x, 400);
            //         ctx.current.stroke();
            //         ctx.current.moveTo(0, y);
            //         ctx.current.lineTo(1000, y);
            //         ctx.current.stroke();
            //     }
            // }

            ctx.current.drawImage(backgroundImage, 0, 0);

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
                    ctx.current.fillText(`P=${p*100}%`, x, y - 8);
                    ctx.current.strokeRect(x, y, w, h);
                }
            }
        }
    }, [props.src, props.detections, props.hiddenDiseases]);

    return (
      <React.Fragment>
        <canvas ref={canvasRef} width="700" height="310" />
      </React.Fragment>
    );
  }