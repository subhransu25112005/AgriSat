# weather_service.py
import os, httpx

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY") or ""

async def get_weather_by_coords(lat, lon):
    if not OPENWEATHER_KEY:
        return {"error": "OpenWeather API key missing"}

    url = (
        f"https://api.openweathermap.org/data/2.5/forecast?"
        f"lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric&cnt=40"
    )

    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=30)

    if r.status_code != 200:
        return {"error": r.text}

    data = r.json()
    forecast = []

    # Build forecast (5-day intervals)
    for i in range(0, min(40, len(data.get("list", []))), 8):
        it = data["list"][i]
        forecast.append({
            "dt_txt": it["dt_txt"],
            "temp": it["main"]["temp"],
            "desc": it["weather"][0]["description"],
            "icon": it["weather"][0]["icon"]
        })

    # Build current weather
    current_item = data["list"][0] if data.get("list") else {}

    current = {
        "temp": current_item.get("main", {}).get("temp"),
        "humidity": current_item.get("main", {}).get("humidity"),
        "description": current_item.get("weather", [{}])[0].get("description"),
        "icon": current_item.get("weather", [{}])[0].get("icon")
    }

    return {
        "city": data.get("city", {}).get("name", "Unknown"),
        "current": current,
        "forecast": forecast
    }
