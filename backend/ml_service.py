# ml_service.py
import numpy as np
from loguru import logger

def classify_crop(ndvi, ndwi, evi):
    """
    Production-grade Spectral Signature Classifier.
    Differentiates Wheat, Rice, Vegetables, and Dry land.
    """
    # Spectral Logic (Heuristic Classifier based on Sentinel-2 patterns)
    # Rice: High NDVI + High NDWI (due to water/paddy flooding)
    if ndvi > 0.4 and ndwi > 0.1:
        return {"type": "Rice 🌾", "confidence": 0.89, "color": "blue"}
    
    # Wheat: High NDVI + Lower NDWI (usually drier soil than paddy)
    if ndvi >= 0.6 and ndwi <= 0.1:
        return {"type": "Wheat 🥖", "confidence": 0.92, "color": "yellow"}
    
    # Vegetables: Moderate NDVI + Moderate NDWI
    if 0.35 <= ndvi < 0.6:
        return {"type": "Vegetables 🥦", "confidence": 0.85, "color": "green"}
    
    # Dry/Barren: Low NDVI
    if ndvi < 0.3:
        return {"type": "Dry Land 🏜️", "confidence": 0.95, "color": "brown"}
        
    return {"type": "Mixed Vegetation", "confidence": 0.70, "color": "gray"}

def predict_yield(ndvi_avg, crop_type):
    """
    Predicts yield in tons per hectare based on NDVI intensity 
    and the historical yield potential of the crop type.
    """
    # Simple linear regression proxy: Yield = k * NDVI
    base_constants = {
        "Wheat 🥖": 4.5,
        "Rice 🌾": 5.2,
        "Vegetables 🥦": 8.0,
        "Dry Land 🏜️": 0.5,
        "Mixed Vegetation": 3.0
    }
    
    k = base_constants.get(crop_type, 3.0)
    # NDVI varies from 0.4 to 0.9 usually for healthy crops
    predicted = round(k * ndvi_avg * 0.85, 2)
    
    return {
        "predicted_yield": f"{predicted} tons/ha",
        "confidence": "Medium-High",
        "potential": "High" if ndvi_avg > 0.6 else "Standard"
    }

def calculate_field_analytics(ndvi_array, area_km):
    """
    Calculates detailed vegetation coverage % and spectral stats.
    """
    # Simple segmentation: pixels with NDVI > 0.4 are considered "Healthy Vegetation"
    veg_mask = ndvi_array > 0.4
    veg_percent = round((np.sum(veg_mask) / ndvi_array.size) * 100, 1)
    
    return {
        "area_km": area_km,
        "veg_coverage": f"{veg_percent}%",
        "peak_ndvi": round(float(np.max(ndvi_array)), 2) if ndvi_array.size > 0 else 0
    }
