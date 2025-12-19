import pickle
import os
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent.parent

@lru_cache(maxsize=2)
def load_classification_model():
    """Load classification pipeline and label encoder"""
    pipeline_path = BASE_DIR / "models" / "case_classification" / "voting_pipeline.pkl"
    label_path = BASE_DIR / "models" / "case_classification" / "label_encoder.pkl"
    
    with open(pipeline_path, "rb") as f:
        pipeline = pickle.load(f)
    
    with open(label_path, "rb") as f:
        label_encoder = pickle.load(f)
    
    return pipeline, label_encoder

@lru_cache(maxsize=2)
def load_prioritization_model():
    """Load prioritization pipeline and label encoder"""
    pipeline_path = BASE_DIR / "models" / "case_prioritization" / "stacking_pipeline.pkl"
    label_path = BASE_DIR / "models" / "case_prioritization" / "label_encoder.pkl"
    
    with open(pipeline_path, "rb") as f:
        pipeline = pickle.load(f)
    
    with open(label_path, "rb") as f:
        label_encoder = pickle.load(f)
    
    return pipeline, label_encoder
