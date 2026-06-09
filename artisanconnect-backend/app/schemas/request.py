from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class RequestBase(BaseModel):
    title: str
    description: str
    category: str
    location: str
    city: str
    budget: Optional[int] = None
    urgency: str = Field(pattern="^(normal|urgent|very_urgent)$")
    material_provided: bool = False
    access_info: Optional[str] = None
    area_sqm: Optional[float] = None
    availability_slots: Optional[Dict[str, Any]] = None
    photos: Optional[List[str]] = None
    is_public: bool = True

class RequestCreate(RequestBase):
    pass

class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    budget: Optional[int] = None
    urgency: Optional[str] = Field(None, pattern="^(normal|urgent|very_urgent)$")
    status: Optional[str] = Field(None, pattern="^(open|in_progress|completed|cancelled)$")
    material_provided: Optional[bool] = None
    access_info: Optional[str] = None
    area_sqm: Optional[float] = None
    availability_slots: Optional[Dict[str, Any]] = None
    photos: Optional[List[str]] = None
    is_public: Optional[bool] = None

class RequestResponse(RequestBase):
    id: str
    client_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
