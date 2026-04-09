# routes/schemes.py
from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

CURATED_SCHEMES = [
    { 
        "title": "PM-Kisan Samman Nidhi", 
        "shortDescription": "Providing ₹6,000 per year income support to all landholding farmers' families in three equal installments.", 
        "slug": "pm-kisan-samman-nidhi" 
    },
    { 
        "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", 
        "shortDescription": "An yield-based insurance scheme which provides financial support to farmers suffering crop loss/damage.", 
        "slug": "pradhan-mantri-fasal-bima-yojana" 
    },
    { 
        "title": "Kisan Credit Card (KCC)", 
        "shortDescription": "Provides farmers with timely access to credit for their cultivation and other needs.", 
        "slug": "kisan-credit-card" 
    },
    { 
        "title": "Soil Health Card Scheme", 
        "shortDescription": "Helps farmers to know the nutrient status of their soil along with recommendations on appropriate dosage.", 
        "slug": "soil-health-card-scheme" 
    },
    { 
        "title": "Paramparagat Krishi Vikas Yojana", 
        "shortDescription": "Promoting cluster based organic farming with PGS certification. Incentivizing farmers for organic farming.", 
        "slug": "paramparagat-krishi-vikas-yojana" 
    }
]

@router.get("/")
async def get_schemes(q: Optional[str] = ""):
    query = q.lower()
    filtered = [
        s for s in CURATED_SCHEMES 
        if query in s["title"].lower() or query in s["shortDescription"].lower()
    ]
    return {"data": filtered if filtered else CURATED_SCHEMES}
