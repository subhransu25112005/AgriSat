# models.py
from typing import Optional, Any
from sqlmodel import SQLModel, Field, Column, JSON
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: Optional[str] = Field(index=True, nullable=True)
    phone: Optional[str] = Field(index=True, nullable=True)
    hashed_password: Optional[str] = Field(default=None)
    name: Optional[str] = Field(default=None)
    language: str = Field(default="en")  # store 'en' / 'hi' / 'or'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Farm(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    name: str
    geom: dict = Field(sa_column=Column(JSON), default=None)
    center: Optional[dict] = Field(sa_column=Column(JSON), default=None)
    size_km: float = Field(default=1.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NDVIAnalysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int = Field(index=True)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    ndvi_mean: Optional[float] = None
    thumbnail_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AlertSubscription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    farm_id: Optional[int] = Field(default=None)
    alert_type: str = Field(default="weather")  # e.g., 'weather','ndvi_drop'
    enabled: bool = Field(default=True)
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FarmPhoto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int = Field(index=True)
    user_id: int = Field(index=True)
    filename: str
    caption: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SavedInsight(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    farm_id: Optional[int] = Field(default=None)
    type: str = Field(default="general")  # 'ndvi', 'market', 'weather', 'general'
    title: str
    content: Optional[Any] = Field(sa_column=Column(JSON), default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    title: str
    message: str
    type: str = Field(default="info")  # 'info', 'warning', 'error', 'success'
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SupportRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None)
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class KnowledgeArticle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str = Field(default="general")  # 'crops', 'fertilizer', 'pest'
    summary: str
    content: str
    author: Optional[str] = Field(default="AgriSat Team")
    created_at: datetime = Field(default_factory=datetime.utcnow)
