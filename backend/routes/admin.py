# routes/admin.py
from fastapi import APIRouter
from db import async_session
from models import User, Farm, NDVIAnalysis
from sqlmodel import select

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/usage")
async def usage():
    async with async_session() as session:
        u = await session.exec(select(User))
        f = await session.exec(select(Farm))
        n = await session.exec(select(NDVIAnalysis))
        return {
            "user_count": len(u.all()),
            "farm_count": len(f.all()),
            "ndvi_analyses": len(n.all())
        }
