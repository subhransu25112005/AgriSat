# routes/weather.py
from fastapi import APIRouter
from weather_service import get_weather_by_coords

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("/")
async def weather(lat: float, lon: float):
    res = await get_weather_by_coords(lat, lon)
    return res
