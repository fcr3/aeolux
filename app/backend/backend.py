from flask import Flask, json, request, jsonify, url_for
from flask_cors import CORS, cross_origin
from celery import Celery
import numpy as np
import base64
from PIL import Image, ImageOps
import io
import tensorflow as tf
import torchxrayvision as xrv
import torch
import os

# Model Paths:
model_paths = {
    'mobilenet_v2': './models/tf_obj_models/ssd_mobilenetv2_vbd_mb/saved_model',
    'resnet50': './models/tf_obj_models/ssd_resnet50_vbd_mb/saved_model',
    'efficientdet_d1': './models/tf_obj_models/efficientdetd1_vbd_mb/saved_model',
    'yolov5': './models/torch_models/yolov5/weights/best.pt'
}

# Inference Helper Functions
def load_image_into_numpy_array(encoded_data, gray=False, yolo=False):
    decoded_data = base64.b64decode(encoded_data)
    img = Image.open(io.BytesIO(decoded_data))

    if gray:
        img = ImageOps.grayscale(img)
        rgbimg = img.resize((224, 224))
        return np.array(rgbimg), rgbimg

    rgbimg = Image.new("RGB", img.size)
    rgbimg.paste(img)

    if yolo:
        rgbimg = rgbimg.resize((512, 512))

    return np.array(rgbimg), rgbimg

def conduct_inference(i, model):
    input_tensor = tf.convert_to_tensor(i)
    detections = model(input_tensor)
    num_detections = detections.pop('num_detections').numpy()
    detections = {key: value.numpy()
                  for key, value in detections.items()
                  if key != 'num_detections'}
    detections['num_detections'] = num_detections
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
    return detections

def conduct_inference_yolo(i, model):
    out = model(i, size=512, augment=True)
    label_map = out.names
    out = out.pandas().xyxyn
    detections = {
        'num_detections': [],
        'detection_classes': [],
        'detection_boxes': [],
        'detection_scores': [],
        'label_map': label_map
    }
    for oi in out:
        detections['num_detections'] += [oi.shape[0]]
        detections['detection_classes'] += [oi['class'].values.tolist()]
        oi = oi[['ymin', 'xmin', 'ymax', 'xmax', 'confidence']]
        detections['detection_boxes'] += [oi.iloc[:, :4].values.tolist()]
        detections['detection_scores'] += [oi['confidence'].values.tolist()]

    return detections

# Backend Initialization
app = Flask(__name__)
# app.config['CELERY_BROKER_URL'] = 'redis://redis1:6379/0'
# app.config['CELERY_RESULT_BACKEND'] = 'redis://redis1:6379/0'

app.config['CELERY_BROKER_URL'] = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
app.config['CELERY_RESULT_BACKEND'] = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

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
def classification(self, data_list):
    batch_input = []
    for data in data_list:
        uri = data['fileData']
        encoded_data = uri.split(',')[1]
        sample, _ = load_image_into_numpy_array(encoded_data, gray=True)
        batch_input.append(sample[np.newaxis, :, :])

    batch_input = np.array(batch_input)
    batch_tensor = torch.from_numpy(batch_input)

    # if len(batch_tensor.shape) == 3:
    #     batch_tensor = batch_tensor.unsqueeze(0)

    print(f'Conducting inference. CUDA: {torch.cuda.is_available()}')
    model = xrv.models.DenseNet(weights="all")
    outputs = model(batch_tensor.float()).detach().cpu().numpy()
    print(outputs)

    output_list = []
    for i in range(outputs.shape[0]):
        output = outputs[i]
        output = {k: float(v) for k,v in zip(model.pathologies, output)}
        output_list.append({
            'fileName': data_list[i]['fileName'],
            'fileData': data_list[i]['fileData'],
            'probabilities': output
        })

    return {
        'status': 'completed',
        'result_info': output_list
    }

@celery.task(bind=True)
def object_detection_yolo(self, data_list):
    output = []

    print(f'Making batch input')
    batch_input = []
    shape_array = []
    for data in data_list:
        uri = data['fileData']
        encoded_data = uri.split(',')[1]
        sample, _ = load_image_into_numpy_array(encoded_data, yolo=True)
        batch_input.append(sample)
        shape_array.append(sample.shape[:2])

    print(f'Conducting Inference. CUDA: {torch.cuda.is_available()}')
    model = torch.hub.load(
        'ultralytics/yolov5', 'custom', 
        path=model_paths['yolov5'],
    )
    sample_detections = conduct_inference_yolo(batch_input, model)
    label_map = sample_detections['label_map']

    print('Constructing output')
    output = []
    for data_i, data in enumerate(data_list):
        h, w = shape_array[data_i]
        detection_boxes = sample_detections['detection_boxes'][data_i]
        detection_scores = sample_detections['detection_scores'][data_i]
        detection_classes = sample_detections['detection_classes'][data_i]

        # Adjust Boxes to (xmin, ymin, width, height)
        # Take Detections Above 50%
        processed_detections = {}
        for i, box in enumerate(detection_boxes):
            ymin, xmin, ymax, xmax = box
            ymin, xmin, ymax, xmax = ymin * h, xmin * w, ymax * h, xmax * w
            score = detection_scores[i]
            pred_class = int(detection_classes[i])
            detection = {
                'x': int(xmin), 
                'y': int(ymin), 
                'w': int(xmax - xmin), 
                'h': int(ymax - ymin),
                'p': float(score)
            }

            if detection['p'] < 0.5 or pred_class == 0:
                continue

            pred_class = label_map[pred_class]
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

@celery.task(bind=True)
def object_detection(self, data_list):
    output = []

    label_map = {
        1: 'Atelectasis',
        2: 'Cardiomegaly',
        3: 'Effusion',
        4: 'Infiltration',
        5: 'Nodule/mass',
        6: 'Opacity',
        7: 'ILD',
        8: 'Pneumothorax',
        9: 'Enlargement',
        10: 'Calcification',
        11: 'Consolidation',
        12: 'Lesion',
        13: 'Thickening',
        14: 'Fibrosis'
    }

    print(f'Making batch input')
    batch_input = []
    shape_array = []
    for data in data_list:
        uri = data['fileData']
        encoded_data = uri.split(',')[1]
        sample, _ = load_image_into_numpy_array(encoded_data)
        batch_input.append(sample)
        shape_array.append(sample.shape[:2])
    batch_input = np.array(batch_input)

    print(f'Conducting Inference. CUDA: {tf.test.is_gpu_available()}')
    model = tf.saved_model.load(model_paths['efficientdet_d1'])
    sample_detections = conduct_inference(batch_input, model)

    print('Constructing output')
    output = []
    for data_i, data in enumerate(data_list):
        h, w = shape_array[data_i]
        detection_boxes = sample_detections['detection_boxes'][data_i]
        detection_scores = sample_detections['detection_scores'][data_i]
        detection_classes = sample_detections['detection_classes'][data_i]

        # Adjust Boxes to (xmin, ymin, width, height)
        # Take Detections Above 50%
        processed_detections = {}
        for i, box in enumerate(detection_boxes):
            ymin, xmin, ymax, xmax = box
            ymin, xmin, ymax, xmax = ymin * h, xmin * w, ymax * h, xmax * w
            score = detection_scores[i]
            pred_class = int(detection_classes[i])
            detection = {
                'x': int(xmin), 
                'y': int(ymin), 
                'w': int(xmax - xmin), 
                'h': int(ymax - ymin),
                'p': float(score)
            }

            if detection['p'] < 0.5 or pred_class == 0:
                continue

            pred_class = label_map[pred_class]
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

    # task = object_detection.apply_async(args=[data])
    task = object_detection_yolo.apply_async(args=[data])
    return jsonify({'task_id': task.id}), 202

@app.route('/classify', methods=['POST'])
def classify():
    req_json = request.get_json()
    data = req_json['data']
    task = classification.apply_async(args=[data])
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
