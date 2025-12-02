# routes/recommend.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from db import async_session
from models import Farm, NDVIAnalysis
from jose import jwt
import os
from schemas import RecommendationOut

JWT_SECRET = os.getenv("JWT_SECRET") or "supersecretjwtkey"
router = APIRouter(prefix="/recommend", tags=["recommend"])

# simple internal translations dictionary
TRANSLATIONS = {
    "low": {
        "en": "Low NDVI: Recommend soil test. Apply Nitrogen-rich (Urea) + balanced NPK. Ensure irrigation.",
        "hi": "कम NDVI: मृदा परीक्षण की सलाह. नाइट्रोजन-समृद्ध (यूरेया) और संतुलित NPK लगाएँ. सिंचाई सुनिश्चित करें.",
        "or": "କମ୍ NDVI: ମାଟି ପରୀକ୍ଷା ସୁପାରିଶ. ନାଇଟ୍ରୋଜେନ୍-ଧନ (ଉରିଆ) + ସମତୁଳିତ NPK ଦିଅନ୍ତୁ. ପାଣି ଯାଞ୍ଚ କରନ୍ତୁ."
    },
    "moderate": {
        "en": "Moderate NDVI: Consider balanced NPK and monitor pests. Slight irrigation recommended.",
        "hi": "मध्यम NDVI: संतुलित NPK पर विचार करें और कीटों पर नजर रखें. हल्की सिंचाई सुझाई जाती है.",
        "or": "ମଧ୍ୟମ NDVI: ସମତୁଳିତ NPK ଭାବନା କରନ୍ତୁ ଏବଂ ପୋକମକ୍ରା ନିରୀକ୍ଷଣ କରନ୍ତୁ. ସାଲ୍କା ଜଳଦାନ ସୁପାରିଶ."
    },
    "high": {
        "en": "Healthy NDVI: Continue current practices and monitor.",
        "hi": "स्वस्थ NDVI: वर्तमान प्रथाओं को जारी रखें और निगरानी करते रहें.",
        "or": "ସୁସ୍ଥ NDVI: ବର୍ତ୍ତମାନ ପ୍ରଥା ଜାରି ରଖନ୍ତୁ ଏବଂ ନିରୀକ୍ଷଣ କରନ୍ତୁ."
    }
}

def choose_band(ndvi):
    if ndvi is None: return "unknown"
    if ndvi < 0.30: return "low"
    if ndvi < 0.50: return "moderate"
    return "high"

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Missing auth")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(401, "Invalid token")

@router.get("/", response_model=RecommendationOut)
async def recommend(farm_id: int, lang: str = "en", user_id: int = Depends(get_current_user)):
    async with async_session() as session:
        farm = await session.get(Farm, farm_id)
        if not farm or farm.user_id != user_id:
            raise HTTPException(404, "Farm not found")
        # get latest analysis
        q = select(NDVIAnalysis).where(NDVIAnalysis.farm_id == farm_id).order_by(NDVIAnalysis.created_at.desc())
        res = await session.exec(q)
        last = res.first()
        ndv = last.ndvi_mean if last else None
        band = choose_band(ndv)
        msg = TRANSLATIONS.get(band, TRANSLATIONS["moderate"])
        text = msg.get(lang, msg["en"])
        return {"language": lang, "message": text, "ndvi_mean": ndv}
