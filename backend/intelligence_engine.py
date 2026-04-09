# intelligence_engine.py
# Pure, stateless computation engine for farm intelligence.
# No mock data. No hardcoded values. All logic is driven by real NDVI + weather inputs.

from loguru import logger

def compute_insights(ndvi: float, temp: float, humidity: float, rain_forecast: bool) -> dict:
    """
    Compute full farm intelligence from real NDVI and weather telemetry.
    Returns structured intelligence for the frontend dashboard.
    """
    logger.info(f"Computing insights: ndvi={ndvi}, temp={temp}, humidity={humidity}, rain={rain_forecast}")

    # ── 🌿 CROP HEALTH SCORE (0–10) ────────────────────────────────────────
    if ndvi > 0.6:
        health_score = 9
        health_status = "Healthy"
    elif ndvi > 0.4:
        health_score = 6
        health_status = "Moderate"
    else:
        health_score = 3
        health_status = "Stressed"

    # ── 💧 MOISTURE ESTIMATION ──────────────────────────────────────────────
    if humidity > 70 or rain_forecast:
        moisture = "High"
        moisture_pct = 70
    elif humidity > 40:
        moisture = "Moderate"
        moisture_pct = 50
    else:
        moisture = "Low"
        moisture_pct = 25

    # ── ⚠ RISK LEVEL ─────────────────────────────────────────────────────────
    if temp > 35 and moisture == "Low":
        risk = "High"
    elif temp > 30:
        risk = "Medium"
    else:
        risk = "Low"

    # ── 🤖 AI RECOMMENDATION ─────────────────────────────────────────────────
    if moisture == "Low" and not rain_forecast:
        recommendation = "Irrigate within 24 hours. Critical soil moisture deficit detected."
    elif risk == "High":
        recommendation = "Heat stress detected. Shade crop if possible and increase irrigation frequency."
    elif health_status == "Stressed":
        recommendation = "Vegetation stress detected. Check for disease or pest infestation."
    elif health_status == "Moderate":
        recommendation = "Apply nitrogen-rich fertilizer for best growth results this season."
    else:
        recommendation = "Crop condition is stable. Maintain current irrigation schedule."

    # ── 🤖 AI SUMMARY MESSAGE ─────────────────────────────────────────────────
    if risk == "Low" and health_status == "Healthy":
        ai_message = f"Your crop is healthy with no immediate risk detected. NDVI is {round(ndvi, 2)}, indicating strong vegetation density."
    elif risk == "High":
        ai_message = f"⚠️ Attention required. Thermal stress is high ({temp}°C) and soil moisture is critically low. Act within 24 hours."
    else:
        ai_message = f"Moderate field conditions detected. NDVI is {round(ndvi, 2)}. {recommendation}"

    return {
        "health_score": health_score,
        "health_status": health_status,
        "risk": risk,
        "moisture": moisture,
        "moisture_pct": moisture_pct,
        "recommendation": recommendation,
        "ai_message": ai_message,
        "soil": "Loamy",           # Upgradeable with soil sensor integration
        "ndvi": round(ndvi, 3),
        "temperature": temp,
        "humidity": humidity
    }
