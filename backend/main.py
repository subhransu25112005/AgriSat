import sys, os
sys.path.append(os.path.dirname(__file__))


# backend/main.py

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from loguru import logger
import os

# ✅ Load .env file from project root (AgriSat/.env)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ✅ Print DATABASE_URL to confirm loading
print("Loaded DATABASE_URL:", os.getenv("DATABASE_URL"))

# ✅ Import database initializer
from db import init_db
from routes.news import router as news_router

# Dynamic Router Inclusions (Error-safe for missing API files)
route_modules = [
    "auth", "farms", "ndvi_extended", "weather", 
    "predict", "market", "schemes", "insights", 
    "notifications", "support", "news"
]

routers = {}
for module_name in route_modules:
    try:
        module = __import__(f"routes.{module_name}", fromlist=["router"])
        routers[module_name] = module.router
    except ImportError as e:
        logger.warning(f"⚠️ Could not load router {module_name}: {e}")

# ✅ Create FastAPI app
app = FastAPI(title="AgriSat Backend")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Error Hook: {exc} | URL: {request.url}")
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong on our end.", "detail": str(exc)},
    )

# ✅ Enable CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Safely Include Routers
# Standard dynamic loading handles prefixes within the router files

for name, router in routers.items():
    app.include_router(router)
    logger.info(f"✅ Loaded {name} API routes")

# ✅ Event: Initialize DB at startup
@app.on_event("startup")
async def on_startup():
    await init_db()
    print("✅ Database initialized successfully!")

# ✅ Default route for testing
@app.get("/")
def root():
    return {"status": "API running"}

# ✅ Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=10000, reload=True)
