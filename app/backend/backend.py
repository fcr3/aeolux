from flask import Flask, json, request, jsonify, url_for
from flask_cors import CORS, cross_origin
from celery import Celery
import numpy as np
import base64
from PIL import Image
import io
import tensorflow as tf

# Model Paths:
model_paths = {
    'mobilenet_v2': './tf_obj_models/ssd_mobilenet_v2/saved_model/',
    'resnet50': './tf_obj_models/ssd_resnet_50_v1_fpn/saved/saved_model'
}

# Inference Helper Functions
def load_image_into_numpy_array(encoded_data):
    decoded_data = base64.b64decode(encoded_data)
    img = Image.open(io.BytesIO(decoded_data))
    rgbimg = Image.new("RGB", img.size)
    rgbimg.paste(img)
    return np.array(rgbimg), rgbimg

def conduct_inference(i, model):
    input_tensor = tf.convert_to_tensor(i)
    input_tensor = input_tensor[tf.newaxis, :]
    
    detections = model(input_tensor)
    
    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                   for key, value in detections.items()}
    detections['num_detections'] = num_detections
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
    
    return detections

# Backend Initialization
app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://redis1:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://redis1:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# CORS Agreement Code Snippet
@app.after_request
def after_request(response):
    # Make sure to change localhost:3000 to the actual host:port you want
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@celery.task(bind=True)
def object_detection(self, data_list):
    output = []

    for data in data_list:
        uri = data['fileData']

        # Pre processing base64 encoded picture
        encoded_data = uri.split(',')[1]
        sample, _ = load_image_into_numpy_array(encoded_data)
        h, w, _ = sample.shape

        # Getting Model
        model = tf.saved_model.load(model_paths['mobilenet_v2'])

        # Object Detection
        sample_detections = conduct_inference(sample, model)

        # Adjust Boxes to (xmin, ymin, width, height)
        # Take Detections Above 70%
        processed_detections = {}
        for i, box in enumerate(sample_detections['detection_boxes']):
            ymin, xmin, ymax, xmax = box
            ymin, xmin, ymax, xmax = ymin * h, xmin * w, ymax * h, xmax * w
            score = sample_detections['detection_scores'][i]
            pred_class = int(sample_detections['detection_classes'][i])
            detection = {
                'x': int(xmin), 
                'y': int(ymin), 
                'w': int(xmax - xmin), 
                'h': int(ymax - ymin),
                'p': float(score)
            }

            if detection['p'] < 0.7 or pred_class == 0:
                continue

            if pred_class not in processed_detections:
                processed_detections[pred_class] = []
            processed_detections[pred_class].append(detection)

        output_obj = {
            'fileName': data['fileName'],
            'fileData': uri,
            'detections': processed_detections,
        }
        output.append(output_obj)

    return {
        'status': 'completed',
        'result_info': output
    }

@app.route('/test_connection', methods=['GET'])
def test_connection():
    print('Received request...')
    return jsonify({'message': 'connection successful'}), 200

@app.route('/detect', methods=['POST'])
def detect():
    req_json = request.get_json()
    data = req_json['data']

    task = object_detection.apply_async(args=[data])
    return jsonify({'task_id': task.id}), 202

@app.route('/status/<task_id>', methods=['GET'])
def taskstatus(task_id):
    response = {}
    task = object_detection.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {'state': task.state, 'status': 'Pending...'}
    elif task.state != 'FAILURE':
        response = {'state': task.state, 'status': task.info.get('status', '')}
        if 'result_info' in task.info:
            response['result_info'] = task.info['result_info']
    else:
        response = {'state': task.state, 'status': str(task.info)}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)