# routes/support.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import select
from db import async_session
from models import SupportRequest
from schemas import SupportIn
from jose import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/support", tags=["support"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        return None # Support might be allowed for non-logged users
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        return None

@router.post("/send")
async def send_support(payload: SupportIn, user_id: int = Depends(get_current_user)):
    sr = SupportRequest(user_id=user_id, **payload.dict())
    async with async_session() as session:
        session.add(sr)
        await session.commit()
        return {"message": "Support request submitted. We will contact you soon."}
