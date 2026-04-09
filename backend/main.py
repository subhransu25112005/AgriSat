import sys, os
sys.path.append(os.path.dirname(__file__))


# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

# ✅ Load .env file from project root (AgriSat/.env)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ✅ Print DATABASE_URL to confirm loading
print("Loaded DATABASE_URL:", os.getenv("DATABASE_URL"))

# ✅ Import database initializer
from db import init_db

# ✅ Import routers
from routes import auth, farms, ndvi_extended, weather , predict, market, schemes

# ✅ Create FastAPI app
app = FastAPI(title="AgriSat Backend")

# ✅ Enable CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(auth.router)
app.include_router(farms.router)
app.include_router(ndvi_extended.router)
app.include_router(weather.router)
app.include_router(predict.router)
app.include_router(market.router)
app.include_router(schemes.router)

# ✅ Event: Initialize DB at startup
@app.on_event("startup")
async def on_startup():
    await init_db()
    print("✅ Database initialized successfully!")

# ✅ Default route for testing
@app.get("/")
def root():
    return {"message": "AgriSat Backend is running 🚀"}

# ✅ Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
