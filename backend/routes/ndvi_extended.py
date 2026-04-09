# routes/ndvi_extended.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sentinel_service import compute_ndvi_analysis, get_ndvi_history
from weather_service import get_weather_by_coords
from ai_service import get_agricultural_advice
from ml_service import classify_crop, predict_yield, calculate_field_analytics
from db import async_session
from models import Farm
from sqlmodel import select
from jose import jwt
import os
import numpy as np
from pydantic import BaseModel
from typing import Optional

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/ndvi", tags=["ndvi_extended"])

class NDVIAnalyzeRequest(BaseModel):
    lat: float
    lon: float
    farm_id: Optional[int] = None

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.post("/analyze")
async def analyze_ndvi(req: NDVIAnalyzeRequest, user_id: int = Depends(get_current_user)):
    """
    REAL FARM INTELLIGENCE SYSTEM - Ecosystem Unified Endpoint.
    Returns: Map, History, AI Advice, ML Crop Classification, Yield Prediction.
    """
    # 1. Capture Satellite Imagery
    sat_res = compute_ndvi_analysis(req.lat, req.lon)
    if sat_res.get("status") == "error":
        return {"status": "error", "message": sat_res.get("message")}
    
    # 2. Fetch History
    history = get_ndvi_history(req.lat, req.lon)
    
    # 3. Retrieve Weather
    weather = await get_weather_by_coords(req.lat, req.lon)
    
    # 4. AI Advice
    ndvi_val = sat_res.get("ndvi_value", 0.6)
    ndwi_val = sat_res.get("ndwi_value", 0.0)
    intelligence = get_agricultural_advice(ndvi_val, weather, history)
    
    # 5. ML Ecosystem Extension (New in Ecosystem Upgrade)
    crop_data = classify_crop(ndvi_val, ndwi_val, ndvi_val) # EVI proxy
    yield_data = predict_yield(ndvi_val, crop_data["type"])
    
    # 6. Field Analytics
    size_km = 1.0
    if req.farm_id:
        async with async_session() as session:
            farm = await session.get(Farm, req.farm_id)
            if farm: size_km = farm.size_km
            
    analytics = calculate_field_analytics(np.array([ndvi_val]), size_km) # Proxy array for now
    
    return {
        "status": "success",
        "ndvi_image": sat_res.get("ndvi_image"),
        "ndvi_value": ndvi_val,
        "health": sat_res.get("health_status"),
        "history": history,
        "intelligence": intelligence,
        "weather": weather,
        "ml": {
            "crop": crop_data,
            "yield": yield_data
        },
        "analytics": analytics
    }

# --- NEW INDIVIDUAL ENDPOINTS (Step 1, 2, 3) ---

@router.post("/ml/classify")
async def ml_classify(req: NDVIAnalyzeRequest):
    # Fetch real data for logic
    sat_res = compute_ndvi_analysis(req.lat, req.lon)
    ndvi = sat_res.get("ndvi_value", 0.5)
    
    # Step 1 Logic
    crop_type = "Sparse / Dry Land"
    if ndvi > 0.6: crop_type = "Dense Crop"
    elif ndvi >= 0.4: crop_type = "Moderate Crop"
    
    return {
        "crop_type": crop_type,
        "confidence": 0.78
    }

@router.post("/yield/predict")
async def yield_predict(req: NDVIAnalyzeRequest):
    sat_res = compute_ndvi_analysis(req.lat, req.lon)
    ndvi = sat_res.get("ndvi_value", 0.5)
    
    # Step 2 Logic
    predicted = ndvi * 5
    
    return {
        "yield": f"{predicted} ton/hectare",
        "confidence": "Medium"
    }

@router.post("/ai/advice")
async def ai_advice_route(req: NDVIAnalyzeRequest):
    sat_res = compute_ndvi_analysis(req.lat, req.lon)
    ndvi = sat_res.get("ndvi_value", 0.5)
    history = get_ndvi_history(req.lat, req.lon)
    
    # Step 3 Logic
    advice = "Healthy crop. Maintain schedule"
    risk = "Low"
    
    if ndvi < 0.4:
        advice = "Crop stress. Irrigate immediately"
        risk = "High"
    
    # Trend detection
    if len(history) >= 2 and history[-1]["ndvi"] < history[-2]["ndvi"]:
        advice = "Health declining. Check soil"
        risk = "Medium"
        
    return {
        "advice": advice,
        "risk": risk
    }
