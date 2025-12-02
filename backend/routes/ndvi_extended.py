# routes/ndvi_extended.py
from fastapi import APIRouter, Depends, HTTPException, Header, Response
from sentinel_service import compute_ndvi_mean, ndvi_timeseries
from db import async_session
from models import Farm, NDVIAnalysis
from sqlmodel import select
from jose import jwt
import os, csv, io
from schemas import NDVITimeSeries

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/ndvi", tags=["ndvi_extended"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.get("/timeseries", response_model=NDVITimeSeries)
async def get_timeseries(farm_id: int, months: int = 6, window_days: int = 14, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        farm = await session.get(Farm, farm_id)
        if not farm or farm.user_id != user_id:
            raise HTTPException(404, "Farm not found")
        geom = farm.geom if farm.geom else farm.center
        series = ndvi_timeseries(geom, months=months, window_days=window_days, size_km=farm.size_km)
        # store aggregated analyses (optional)
        for p in series:
            ana = NDVIAnalysis(farm_id=farm_id, start_date=p["start"], end_date=p["end"], ndvi_mean=p.get("mean"))
            session.add(ana)
        await session.commit()
        return {"series": series}

@router.get("/export_csv")
async def export_csv(farm_id: int, months: int = 6, window_days: int = 14, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        farm = await session.get(Farm, farm_id)
        if not farm or farm.user_id != user_id:
            raise HTTPException(404, "Farm not found")
        geom = farm.geom if farm.geom else farm.center
        series = ndvi_timeseries(geom, months=months, window_days=window_days, size_km=farm.size_km)
        # create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["start","end","ndvi_mean"])
        for r in series:
            writer.writerow([r.get("start"), r.get("end"), r.get("mean")])
        resp = Response(content=output.getvalue(), media_type="text/csv")
        resp.headers["Content-Disposition"] = f'attachment; filename="ndvi_farm_{farm_id}.csv"'
        return resp
