# routes/notifications.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import select
from db import async_session
from models import Notification
from schemas import NotificationOut
from jose import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/notifications", tags=["notifications"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.get("/", response_model=list[NotificationOut])
async def list_notifications(user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        q = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
        res = await session.exec(q)
        return res.all()

@router.put("/{notif_id}/read")
async def mark_read(notif_id: int, user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        n = await session.get(Notification, notif_id)
        if not n or n.user_id != user_id:
            raise HTTPException(404, "Not found")
        n.is_read = True
        session.add(n)
        await session.commit()
        return {"message": "Marked as read"}
