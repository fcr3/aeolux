# Streamlit Demo

Here is a streamlit demo showcasing object detection on images.

## Getting Started

1. Make a conda environment
2. Activate that conda environment
3. Enter the following:

```
$ python3 -m pip install --ignore-installed --no-cache-dir -r ./requirements.txt
```

## Known Bugs

Detecto has bugs in xml_to_csv. Replace with:
```
row = (filename, width, height, label, 
        int(float(box.find('xmin').text)),
        int(float(box.find('ymin').text)), 
        int(float(box.find('xmax').text)), 
        int(float(box.find('ymax').text)), 
        image_id)
```
