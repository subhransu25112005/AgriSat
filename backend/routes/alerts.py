# routes/alerts.py
from fastapi import APIRouter, Depends, HTTPException, Header
from db import async_session
from models import AlertSubscription, Farm
from schemas import AlertSubscribeIn, AlertOut
from jose import jwt
import os
from sqlmodel import select

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/alerts", tags=["alerts"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.post("/subscribe", response_model=AlertOut)
async def subscribe(payload: AlertSubscribeIn, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        if payload.farm_id:
            farm = await session.get(Farm, payload.farm_id)
            if not farm or farm.user_id != user_id:
                raise HTTPException(404, "Farm not found")
        sub = AlertSubscription(user_id=user_id, farm_id=payload.farm_id, alert_type=payload.alert_type, phone=payload.phone, enabled=True)
        session.add(sub)
        await session.commit()
        await session.refresh(sub)
        return sub

@router.post("/unsubscribe")
async def unsubscribe(alert_id: int, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        s = await session.get(AlertSubscription, alert_id)
        if not s or s.user_id != user_id:
            raise HTTPException(404, "Not found")
        s.enabled = False
        session.add(s)
        await session.commit()
        return {"ok": True}
