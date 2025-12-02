# schemas.py
from pydantic import BaseModel
from typing import Optional, List, Any

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: str
    phone: str
    password: str
    name: str
    language: str = "en"

class UserOut(BaseModel):
    id: int
    email: Optional[str]
    phone: Optional[str]
    name: Optional[str]
    language: str

class FarmCreate(BaseModel):
    name: str
    geom: Optional[Any]
    center: Optional[dict]
    size_km: float = 1.0

class FarmOut(BaseModel):
    id: int
    user_id: int
    name: str
    geom: Optional[Any]
    center: Optional[dict]
    size_km: float

class NDVIResult(BaseModel):
    ndvi_mean: Optional[float]
    thumbnail_url: Optional[str]
    source: str

class NDVITimePoint(BaseModel):
    start: str
    end: str
    mean: Optional[float]

class NDVITimeSeries(BaseModel):
    series: List[NDVITimePoint]

class RecommendationOut(BaseModel):
    language: str
    message: str
    ndvi_mean: Optional[float]

class AlertSubscribeIn(BaseModel):
    farm_id: Optional[int]
    alert_type: str  # 'weather','ndvi_drop', etc.
    phone: Optional[str] = None

class AlertOut(BaseModel):
    id: int
    user_id: int
    farm_id: Optional[int]
    alert_type: str
    enabled: bool

class UploadOut(BaseModel):
    id: int
    filename: str
    caption: Optional[str]
