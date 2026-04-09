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

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None

class SendOtpIn(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

class VerifyOtpIn(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    code: str

class ForgotPasswordIn(BaseModel):
    email: str

class ResetPasswordIn(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    token: str
    new_password: str

class GoogleAuthIn(BaseModel):
    token: str
    language: Optional[str] = "en"

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

class InsightCreate(BaseModel):
    farm_id: Optional[int] = None
    type: str
    title: str
    content: Optional[Any] = None

class InsightOut(BaseModel):
    id: int
    user_id: int
    farm_id: Optional[int]
    type: str
    title: str
    content: Optional[Any]
    created_at: Any

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: Any

class SupportIn(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class KnowledgeArticleOut(BaseModel):
    id: int
    title: str
    category: str
    summary: str
    content: str
    author: Optional[str]
    created_at: Any
