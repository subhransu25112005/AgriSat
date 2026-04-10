from fastapi import APIRouter
import requests
import os
from loguru import logger

router = APIRouter()

@router.get("/news")
def get_news():
    """
    Backend proxy for GNews API to avoid CORS issues and protect API keys.
    """
    gnews_key = os.getenv("VITE_GNEWS_API_KEY") or os.getenv("GNEWS_API_KEY")
    
    if not gnews_key:
        logger.error("GNEWS_API_KEY is missing from environment variables")
        return {"articles": [], "status": "error", "message": "API Key Missing"}

    url = "https://gnews.io/api/v4/search"
    params = {
        "q": "agriculture OR farming OR crops OR mandi india",
        "lang": "en",
        "country": "in",
        "max": 10,
        "apikey": gnews_key
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code != 200:
            logger.error(f"GNews API failed with status {response.status_code}")
            return {"articles": [], "status": "error", "message": "API Failure"}
            
        data = response.json()
        
        # Format the response to match the frontend expectations
        articles = data.get("articles", [])
        formatted_articles = [
            {
                "title": a.get("title"),
                "description": a.get("description"),
                "image": a.get("image"),
                "source": a.get("source", {}).get("name"),
                "publishedAt": a.get("publishedAt"),
                "url": a.get("url")
            }
            for a in articles
        ]
        
        return {"articles": formatted_articles, "status": "success"}

    except Exception as e:
        logger.error(f"News Proxy Error: {e}")
        return {"articles": [], "status": "error", "message": str(e)}
