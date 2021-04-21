import pickle
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import pandas as pd
from detectron2.structures import BoxMode
from tqdm import tqdm

def get_vinbigdata_dicts(
    imgdir: Path,
    train_df: pd.DataFrame,
    train_data_type: str = "original",
    use_cache: bool = True,
    debug: bool = True,
    target_indices: Optional[np.ndarray] = None,
    use_class14: bool = False,
):
    debug_str = f"_debug{int(debug)}"
    train_data_type_str = f"_{train_data_type}"
    class14_str = f"_14class{int(use_class14)}"
    cache_path = Path(".") / f"dataset_dicts_cache{train_data_type_str}{class14_str}{debug_str}.pkl"
    if not use_cache or not cache_path.exists():
        print("Creating data...")
        train_meta = pd.read_csv(imgdir / "train_meta.csv")
        if debug:
            train_meta = train_meta.iloc[:500]  # For debug....

        # Load 1 image to get image size.
        image_id = train_meta.loc[0, "image_id"]
        image_path = str(imgdir / "train" / f"{image_id}.png")
        image = cv2.imread(image_path)
        resized_height, resized_width, ch = image.shape
        print(f"image shape: {image.shape}")

        dataset_dicts = []
        for index, train_meta_row in tqdm(train_meta.iterrows(), total=len(train_meta)):
            record = {}

            image_id, height, width = train_meta_row.values
            filename = str(imgdir / "train" / f"{image_id}.png")
            record["file_name"] = filename
            record["image_id"] = image_id
            record["height"] = resized_height
            record["width"] = resized_width
            objs = []
            for index2, row in train_df.query("image_id == @image_id").iterrows():
                # print(row)
                # print(row["class_name"])
                # class_name = row["class_name"]
                class_id = row["class_id"]
                if class_id == 14:
                    # It is "No finding"
                    if use_class14:
                        # Use this No finding class with the bbox covering all image area.
                        bbox_resized = [0, 0, resized_width, resized_height]
                        obj = {
                            "bbox": bbox_resized,
                            "bbox_mode": BoxMode.XYXY_ABS,
                            "category_id": class_id,
                        }
                        objs.append(obj)
                    else:
                        # This annotator does not find anything, skip.
                        pass
                else:
                    # bbox_original = [int(row["x_min"]), int(row["y_min"]), int(row["x_max"]), int(row["y_max"])]
                    h_ratio = resized_height / height
                    w_ratio = resized_width / width
                    bbox_resized = [
                        float(row["x_min"]) * w_ratio,
                        float(row["y_min"]) * h_ratio,
                        float(row["x_max"]) * w_ratio,
                        float(row["y_max"]) * h_ratio,
                    ]
                    obj = {
                        "bbox": bbox_resized,
                        "bbox_mode": BoxMode.XYXY_ABS,
                        "category_id": class_id,
                    }
                    objs.append(obj)
            record["annotations"] = objs
            dataset_dicts.append(record)
        with open(cache_path, mode="wb") as f:
            pickle.dump(dataset_dicts, f)

    print(f"Load from cache {cache_path}")
    with open(cache_path, mode="rb") as f:
        dataset_dicts = pickle.load(f)
    if target_indices is not None:
        dataset_dicts = [dataset_dicts[i] for i in target_indices]
    return dataset_dicts


def get_vinbigdata_dicts_test(
    imgdir: Path, test_meta: pd.DataFrame, use_cache: bool = True, debug: bool = True,
):
    debug_str = f"_debug{int(debug)}"
    cache_path = Path(".") / f"dataset_dicts_cache_test{debug_str}.pkl"
    if not use_cache or not cache_path.exists():
        print("Creating data...")
        # test_meta = pd.read_csv(imgdir / "test_meta.csv")
        if debug:
            test_meta = test_meta.iloc[:500]  # For debug....

        # Load 1 image to get image size.
        image_id = test_meta.loc[0, "image_id"]
        image_path = str(imgdir / "test" / f"{image_id}.png")
        image = cv2.imread(image_path)
        resized_height, resized_width, ch = image.shape
        print(f"image shape: {image.shape}")

        dataset_dicts = []
        for index, test_meta_row in tqdm(test_meta.iterrows(), total=len(test_meta)):
            record = {}

            image_id, height, width = test_meta_row.values
            filename = str(imgdir / "test" / f"{image_id}.png")
            record["file_name"] = filename
            # record["image_id"] = index
            record["image_id"] = image_id
            record["height"] = resized_height
            record["width"] = resized_width
            # objs = []
            # record["annotations"] = objs
            dataset_dicts.append(record)
        with open(cache_path, mode="wb") as f:
            pickle.dump(dataset_dicts, f)

    print(f"Load from cache {cache_path}")
    with open(cache_path, mode="rb") as f:
        dataset_dicts = pickle.load(f)
    return dataset_dicts

from pathlib import Path
from typing import Any, Union
import yaml


def save_yaml(filepath: Union[str, Path], content: Any, width: int = 120):
    with open(filepath, "w") as f:
        yaml.dump(content, f, width=width)


def load_yaml(filepath: Union[str, Path]) -> Any:
    with open(filepath, "r") as f:
        content = yaml.full_load(f)
    return content

thing_classes = [
    "Aortic enlargement",
    "Atelectasis",
    "Calcification",
    "Cardiomegaly",
    "Consolidation",
    "ILD",
    "Infiltration",
    "Lung Opacity",
    "Nodule/Mass",
    "Other lesion",
    "Pleural effusion",
    "Pleural thickening",
    "Pneumothorax",
    "Pulmonary fibrosis"
]
category_name_to_id = {class_name: index for index, class_name in enumerate(thing_classes)}

import argparse
import dataclasses
import json
import os
import pickle
import random
import sys
from dataclasses import dataclass
from distutils.util import strtobool
from pathlib import Path

import cv2
import detectron2
import numpy as np
import pandas as pd
import torch
from detectron2 import model_zoo
from detectron2.config import get_cfg
from detectron2.data import DatasetCatalog, MetadataCatalog
from detectron2.engine import DefaultPredictor, DefaultTrainer, launch
from detectron2.evaluation import COCOEvaluator
from detectron2.structures import BoxMode
from detectron2.utils.logger import setup_logger
from detectron2.utils.visualizer import Visualizer
from tqdm import tqdm

from dataclasses import dataclass, field
from typing import Dict


@dataclass
class Flags:
    # General
    debug: bool = True
    outdir: str = "results/det"

    # Data config
    imgdir_name: str = "vinbigdata-chest-xray-resized-png-256x256"
    split_mode: str = "all_train"  # all_train or valid20
    seed: int = 111
    train_data_type: str = "original"  # original or wbf
    use_class14: bool = False
    # Training config
    iter: int = 10000
    ims_per_batch: int = 4
    num_workers: int = 4
    lr_scheduler_name: str = "WarmupMultiStepLR"  
    base_lr: float = 0.00025
    roi_batch_size_per_image: int = 512
    eval_period: int = 10000
    aug_kwargs: Dict = field(default_factory=lambda: {})

    def update(self, param_dict: Dict) -> "Flags":
        # Overwrite by `param_dict`
        for key, value in param_dict.items():
            if not hasattr(self, key):
                raise ValueError(f"[ERROR] Unexpected key for flag = {key}")
            setattr(self, key, value)
        return self
    
def register_data():
    flags_dict = {
        "debug": False,
        "outdir": "results/detr", 
        "imgdir_name": "pngs_512",
        "split_mode": "valid20",
        "iter": 30000,
        "roi_batch_size_per_image": 512,
        "eval_period": 1000,
        "lr_scheduler_name": "WarmupCosineLR",
        "base_lr": 0.001,
        "num_workers": 4,
        "aug_kwargs": {
            "HorizontalFlip": {"p": 0.5},
            "ShiftScaleRotate": {"scale_limit": 0.15, "rotate_limit": 10, "p": 0.5},
            "RandomBrightnessContrast": {"p": 0.5}
        }
    }
    
    print("torch", torch.__version__)
    flags = Flags().update(flags_dict)
    print("flags", flags)
    debug = flags.debug
    outdir = Path(flags.outdir)
    os.makedirs(str(outdir), exist_ok=True)
    flags_dict = dataclasses.asdict(flags)
    save_yaml(outdir / "flags.yaml", flags_dict)

    # --- Read data ---
    inputdir = Path("/root/aeolux2/vbd_vol")
    datadir = inputdir
    imgdir = inputdir / flags.imgdir_name

    # Read in the data CSV files
    train_df = pd.read_csv(datadir / "train_orig.csv")
    train = train_df  # alias
    
    train_data_type = flags.train_data_type
    if flags.use_class14:
        thing_classes.append("No finding")

    split_mode = flags.split_mode
    if split_mode == "all_train":
        DatasetCatalog.register(
            "vinbigdata_train",
            lambda: get_vinbigdata_dicts(
                imgdir, train_df, train_data_type, debug=debug, use_class14=flags.use_class14
            ),
        )
        MetadataCatalog.get("vinbigdata_train").set(thing_classes=thing_classes)
    elif split_mode == "valid20":
        # To get number of data...
        n_dataset = len(
            get_vinbigdata_dicts(
                imgdir, train_df, train_data_type, debug=debug, use_class14=flags.use_class14
            )
        )
        n_train = int(n_dataset * 0.8)
        print("n_dataset", n_dataset, "n_train", n_train)
        rs = np.random.RandomState(flags.seed)
        inds = rs.permutation(n_dataset)
        train_inds, test_inds = inds[:n_train], inds[n_train:]

        n_train2 = int(len(train_inds) * 0.8)
        inds2 = rs.permutation(train_inds)
        train_inds, valid_inds = inds2[:n_train2], inds2[n_train2:]

        DatasetCatalog.register(
            "vinbigdata_train",
            lambda: get_vinbigdata_dicts(
                imgdir,
                train_df,
                train_data_type,
                debug=debug,
                target_indices=train_inds,
                use_class14=flags.use_class14,
            ),
        )
        MetadataCatalog.get("vinbigdata_train").set(thing_classes=thing_classes)

        DatasetCatalog.register(
            "vinbigdata_valid",
            lambda: get_vinbigdata_dicts(
                imgdir,
                train_df,
                train_data_type,
                debug=debug,
                target_indices=valid_inds,
                use_class14=flags.use_class14,
            ),
        )
        MetadataCatalog.get("vinbigdata_valid").set(thing_classes=thing_classes)

        DatasetCatalog.register(
            "vinbigdata_test",
            lambda: get_vinbigdata_dicts(
                imgdir,
                train_df,
                train_data_type,
                debug=debug,
                target_indices=test_inds,
                use_class14=flags.use_class14,
            ),
        )
        MetadataCatalog.get("vinbigdata_test").set(thing_classes=thing_classes)
    else:
        raise ValueError(f"[ERROR] Unexpected value split_mode={split_mode}")

    