from fastapi import APIRouter
import requests
import os
import time
from loguru import logger
from typing import List, Dict, Any

router = APIRouter(prefix="/api/news", tags=["news"])

# --- CACHING SYSTEM (Step 7) ---
CACHE = {
    "data": None,
    "expiry": 0
}
CACHE_DURATION = 3600  # 1 hour in seconds

# --- FALLBACK DATA (Step 5) ---
MOCK_NEWS = [
    {
        "title": "Innovative Smart Irrigation Systems Boosting Yields in Rural India",
        "description": "New automated moisture control technologies are helping farmers save up to 40% water while increasing overall crop productivity.",
        "image": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
        "source": "AgriTech Daily",
        "url": "https://example.com/irrigation-success",
        "publishedAt": "2024-03-20T10:00:00Z"
    },
    {
        "title": "Government Expansion of Organic Farming Subsidies for 2024",
        "description": "Ministry of Agriculture announces new financial support packages for small-scale farmers transitioning to chemical-free cultivation.",
        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        "source": "Govt Bulletin",
        "url": "https://example.com/govt-subsidy",
        "publishedAt": "2024-03-19T14:30:00Z"
    }
]

@router.get("/")
@router.get("")
async def get_news():
    """
    Backend proxy for GNews API (Step 1-3)
    Transforms response (Step 4) & Handles errors (Step 5)
    Implemented Caching (Step 7)
    """
    global CACHE

    # 1. Check Cache Validity
    current_time = time.time()
    if CACHE["data"] and current_time < CACHE["expiry"]:
        logger.info("Serving news from cache")
        return {"articles": CACHE["data"], "status": "success", "cached": True}

    # 2. Prepare API Call
    gnews_key = os.getenv("GNEWS_API_KEY") or os.getenv("VITE_GNEWS_API_KEY")
    
    if not gnews_key:
        logger.warning("GNEWS_API_KEY missing. Serving MOCK_NEWS.")
        return {"articles": MOCK_NEWS, "status": "success", "source": "mock"}

    url = "https://gnews.io/api/v4/search"
    params = {
        "q": "agriculture OR farming OR crops OR mandi india",
        "lang": "en",
        "country": "in",
        "max": 10,
        "apikey": gnews_key
    }

    try:
        # 3. Execute Fetch (Step 3)
        response = requests.get(url, params=params, timeout=12)
        
        if response.status_code != 200:
            logger.error(f"GNews API returned {response.status_code}. Using fallbacks.")
            return {"articles": MOCK_NEWS, "status": "success", "source": "fallback"}
            
        data = response.json()
        raw_articles = data.get("articles", [])
        
        if not raw_articles:
            return {"articles": MOCK_NEWS, "status": "success", "source": "empty_api"}

        # 4. Transform Response (Step 4)
        formatted_articles = [
            {
                "title": a.get("title"),
                "description": a.get("description"),
                "image": a.get("image"),
                "url": a.get("url"),
                "source": a.get("source", {}).get("name"),
                "publishedAt": a.get("publishedAt")
            }
            for a in raw_articles
        ]
        
        # 5. Update Cache
        CACHE["data"] = formatted_articles
        CACHE["expiry"] = current_time + CACHE_DURATION
        
        return {"articles": formatted_articles, "status": "success", "source": "live"}

    except Exception as e:
        logger.error(f"News Proxy Critical Error: {e}. Using safety fallbacks.")
        return {"articles": MOCK_NEWS, "status": "success", "error": str(e)}




