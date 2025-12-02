# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from db import async_session
from models import User
from schemas import UserCreate, Token, UserOut
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel
from typing import Optional
import os

class LoginPayload(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(pw: str):
    return pwd_context.hash(pw)

def verify_password(pw, hashpw):
    return pwd_context.verify(pw, hashpw)

@router.post("/signup", response_model=UserOut)
async def signup(payload: UserCreate):
    async with async_session() as session:
        # basic check
        q = select(User).where((User.email == payload.email) | (User.phone == payload.phone))
        res = await session.exec(q)
        if res.first():
            raise HTTPException(400, "User exists")
        user = User(email=payload.email, phone=payload.phone, name=payload.name, language=payload.language)
        if payload.password:
            user.hashed_password = hash_password(payload.password)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return UserOut.from_orm(user)

@router.post("/login", response_model=Token)
async def login(payload: LoginPayload):
    # payload uses email + password or phone + password
    async with async_session() as session:
        q = select(User).where((User.email == payload.email) | (User.phone == payload.phone))
        res = await session.exec(q)
        user = res.first()
        if not user:
            raise HTTPException(400, "Invalid credentials")
        if not verify_password(payload.password, user.hashed_password or ""):
            raise HTTPException(400, "Invalid credentials")
        token = jwt.encode({"user_id": user.id}, JWT_SECRET, algorithm="HS256")
        return {"access_token": token, "token_type":"bearer"}
    
@router.get("/me")
async def get_me():
    return {"message": "OK"}
