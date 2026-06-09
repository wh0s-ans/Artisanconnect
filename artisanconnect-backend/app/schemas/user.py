from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    role: str = Field(pattern="^(client|artisan|admin)$")
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserArtisanProfile(BaseModel):
    profession: Optional[str] = None
    specialties: Optional[List[str]] = None
    location: Optional[str] = None
    city: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    available_days: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    is_available: bool = True
    price_range_min: Optional[int] = None
    price_range_max: Optional[int] = None
    free_quote: bool = False
    bio: Optional[str] = None

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Artisan specific
    profession: Optional[str] = None
    specialties: Optional[List[str]] = None
    location: Optional[str] = None
    city: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    available_days: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    is_available: Optional[bool] = None
    price_range_min: Optional[int] = None
    price_range_max: Optional[int] = None
    free_quote: Optional[bool] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: str
    profession: Optional[str]
    specialties: Optional[List[str]]
    location: Optional[str]
    city: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    available_days: Optional[List[str]]
    languages: Optional[List[str]]
    is_available: bool
    price_range_min: Optional[int]
    price_range_max: Optional[int]
    free_quote: bool
    bio: Optional[str]
    
    rating: float
    review_count: int
    completion_rate: float
    response_time_minutes: int
    
    is_verified: bool
    id_verified: bool
    created_at: datetime
    last_seen: Optional[datetime]
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str
    role: str
