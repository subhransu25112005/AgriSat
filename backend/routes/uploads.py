# routes/uploads.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, Header, HTTPException
import os, shutil
from db import async_session
from models import FarmPhoto, Farm
from jose import jwt
import uuid

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["upload"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.post("/photo")
async def upload_photo(farm_id: int = Form(...), caption: str = Form(None), file: UploadFile = File(...), user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        farm = await session.get(Farm, farm_id)
        if not farm or farm.user_id != user_id:
            raise HTTPException(404, "Farm not found")
        ext = os.path.splitext(file.filename)[1]
        fn = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join(UPLOAD_DIR, fn)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        photo = FarmPhoto(farm_id=farm_id, user_id=user_id, filename=fn, caption=caption)
        session.add(photo)
        await session.commit()
        await session.refresh(photo)
        return {"id": photo.id, "filename": fn, "url": path}
