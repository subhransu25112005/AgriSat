# routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, Header
from sqlmodel import select
from db import async_session
from models import User
from schemas import UserCreate, Token, UserOut, SendOtpIn, VerifyOtpIn, ForgotPasswordIn, ResetPasswordIn, GoogleAuthIn
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel
from typing import Optional
import os
import random
import time
import requests
from email_util import send_otp_email

class LoginPayload(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None # Support mapped generic keys
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"

router = APIRouter(prefix="/auth", tags=["auth"])

# Local Dictionary Stores for OTP & Reset flows
OTP_STORE = {} # { "email": { "code": "xxxx", "expires": timestamp } }
RESET_STORE = {} # { "email": { "token": "xxxx", "expires": timestamp } }

def hash_password(pw: str):
    return pwd_context.hash(pw)

def verify_password(pw, hashpw):
    return pwd_context.verify(pw, hashpw)

def generate_jwt(user_id: int):
    return jwt.encode({"user_id": user_id}, JWT_SECRET, algorithm="HS256")

@router.post("/signup", response_model=UserOut)
async def signup(payload: UserCreate):
    async with async_session() as session:
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
        return user

@router.post("/login", response_model=Token)
async def login(payload: LoginPayload):
    identifier = payload.email or payload.phone or payload.username
    if not identifier:
        raise HTTPException(400, "Provide an email or phone number")
        
    async with async_session() as session:
        q = select(User).where((User.email == identifier) | (User.phone == identifier))
        res = await session.exec(q)
        user = res.first()
        if not user:
            raise HTTPException(400, "Invalid credentials")
        if not verify_password(payload.password, user.hashed_password or ""):
            raise HTTPException(400, "Invalid credentials")
        token = generate_jwt(user.id)
        return {"access_token": token, "token_type": "bearer"}

@router.post("/send-otp")
async def send_otp(payload: SendOtpIn):
    identifier = payload.email or payload.phone
    if not identifier:
        raise HTTPException(400, "Provide an email or phone number")
        
    code = str(random.randint(100000, 999999))
    expires = time.time() + 300 # 5 min
    OTP_STORE[identifier] = {"code": code, "expires": expires}
    
    if "@" in identifier:
        send_otp_email(identifier, code)
    else:
        print(f"📱 [MOCK SMS] OTP {code} generated for {identifier}")
        
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=Token)
async def verify_otp(payload: VerifyOtpIn):
    identifier = payload.email or payload.phone
    if not identifier:
        raise HTTPException(400, "Provide an email or phone number")
        
    record = OTP_STORE.get(identifier)
    if not record or time.time() > record["expires"]:
        raise HTTPException(400, "OTP has expired or is invalid")
    if record["code"] != payload.code:
        raise HTTPException(400, "Invalid OTP code")
        
    del OTP_STORE[identifier]
    
    async with async_session() as session:
        q = select(User).where((User.email == identifier) | (User.phone == identifier))
        res = await session.exec(q)
        user = res.first()
        if not user:
            email_val = identifier if "@" in identifier else None
            phone_val = identifier if "@" not in identifier else None
            name_val = identifier.split("@")[0] if "@" in identifier else "User"
            user = User(email=email_val, phone=phone_val, name=name_val, language="en")
            session.add(user)
            await session.commit()
            await session.refresh(user)
            
        token = generate_jwt(user.id)
        return {"access_token": token, "token_type": "bearer"}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordIn):
    # Maintained solely for backward compatibility, but routes to standard OTP mechanism
    identifier = payload.email
    async with async_session() as session:
        q = select(User).where((User.email == identifier) | (User.phone == identifier))
        res = await session.exec(q)
        if not res.first():
            return {"message": "Sent gracefully"} # Safe anti-enumeration
            
    code = str(random.randint(100000, 999999))
    expires = time.time() + 300 # 5 min
    OTP_STORE[identifier] = {"code": code, "expires": expires}
    
    if "@" in identifier:
        send_otp_email(identifier, code)
    else:
        print(f"📱 [MOCK SMS] Reset OTP {code} generated for {identifier}")
        
    return {"message": "Reset token sent successfully"}

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordIn):
    identifier = payload.email or payload.phone
    if not identifier:
        raise HTTPException(400, "Provide an email or phone number")
        
    record = OTP_STORE.get(identifier)
    if not record or record["code"] != payload.token or time.time() > record["expires"]:
        raise HTTPException(400, "Invalid or expired OTP")
        
    async with async_session() as session:
        q = select(User).where((User.email == identifier) | (User.phone == identifier))
        res = await session.exec(q)
        user = res.first()
        if not user:
            raise HTTPException(404, "User not found")
            
        user.hashed_password = hash_password(payload.new_password)
        session.add(user)
        await session.commit()
    
    del OTP_STORE[identifier]
    return {"message": "Password reset successfully"}

@router.post("/google", response_model=Token)
async def google_auth(payload: GoogleAuthIn):
    resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.token}")
    if resp.status_code != 200:
        raise HTTPException(400, "Invalid Google token")
    
    data = resp.json()
    email = data.get("email")
    name = data.get("name", "Google User")
    
    if not email:
        raise HTTPException(400, "Token does not contain an email")
        
    async with async_session() as session:
        q = select(User).where(User.email == email)
        res = await session.exec(q)
        user = res.first()
        if not user:
            user = User(email=email, name=name, language=payload.language)
            session.add(user)
            await session.commit()
            await session.refresh(user)
            
        token = generate_jwt(user.id)
        return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth token")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")
    
    async with async_session() as session:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(404, "User not found")
        return user
