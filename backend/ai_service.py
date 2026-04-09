# ai_service.py
from loguru import logger

def get_agricultural_advice(ndvi, weather, history):
    """
    AgriSat Farm Intelligence System - Decision Engine.
    Combines NDVI, History (Trend), and Weather (Temp/Humidity/Rain).
    """
    if ndvi is None or weather.get("status") == "error":
        return {
            "advice": "Insufficient data for diagnosis.",
            "risk": "Unknown",
            "condition": "Monitoring"
        }

    # 1. Extract Factors
    temp = weather.get("temp", 25)
    humidity = weather.get("humidity", 50)
    rain_expected = weather.get("rain_forecast", False)
    
    # 2. Determine Trend
    trend = "Stable"
    trend_desc = "Stable condition"
    if len(history) >= 2:
        last_ndvi = history[-1]["ndvi"]
        prev_ndvi = history[-2]["ndvi"]
        diff = last_ndvi - prev_ndvi
        if diff > 0.05:
            trend = "Increasing"
            trend_desc = "Crop health improving"
        elif diff < -0.05:
            trend = "Decreasing"
            trend_desc = "Crop stress detected"

    # 3. AI Intelligence Fusion
    advice = "Healthy crop. Maintain irrigation."
    risk = "Low"
    condition = "Optimal"
    irrigation_alert = False

    # Heat Stress Logic
    if ndvi < 0.4 and temp > 30:
        advice = "Crop stress due to heat. Irrigation needed."
        condition = "Heat Stress"
        risk = "Medium"

    # Disease/Trend Logic
    if trend == "Decreasing":
        advice = "Possible disease or water stress detected via declining NDVI trend."
        condition = "Declining Health"
        risk = "Critical"

    # Irrigation Logic (Part 3 - Ecosystem Upgrade)
    if humidity < 40 and trend == "Decreasing":
        if rain_expected:
            advice = "Vegetation stress detected, but rain is expected. Delay irrigation to conserve water."
            irrigation_alert = False # Delay
            condition = "Pending Rain"
            risk = "Medium"
        else:
            irrigation_alert = True
            advice = "⚠️ Irrigation required immediately. Low humidity and dropping vegetation health detected."
            condition = "Emergency Irrigation"
            risk = "Urgent"

    return {
        "ndvi": ndvi,
        "temperature": temp,
        "humidity": humidity,
        "trend": trend,
        "trend_description": trend_desc,
        "condition": condition,
        "advice": advice,
        "risk": risk,
        "irrigation_alert": irrigation_alert,
        "rain_expected": rain_expected,
        "confidence": "High"
    }
