# routes/farms.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import select
from db import async_session
from models import Farm
from schemas import FarmCreate, FarmOut
from jose import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"

router = APIRouter(prefix="/farms", tags=["farms"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.get("/", response_model=list[FarmOut])
async def list_farms(user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        q = select(Farm).where(Farm.user_id == user_id)
        res = await session.exec(q)
        return [FarmOut.from_orm(f) for f in res.all()]

@router.post("/", response_model=FarmOut)
async def create_farm(payload: FarmCreate, user_id: int = Depends(get_current_user)):
    farm = Farm(user_id=user_id, name=payload.name, geom=payload.geom, center=payload.center, size_km=payload.size_km)
    async with async_session() as session:
        session.add(farm)
        await session.commit()
        await session.refresh(farm)
        return FarmOut.from_orm(farm)

@router.get("/{farm_id}", response_model=FarmOut)
async def get_farm(farm_id: int, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        f = await session.get(Farm, farm_id)
        if not f or f.user_id != user_id:
            raise HTTPException(404, "Not found")
        return FarmOut.from_orm(f)
