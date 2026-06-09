from sqlalchemy import Column, String, Boolean, Float, Integer, ARRAY, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # client, artisan, admin
    display_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Artisan specifics
    profession = Column(String, nullable=True)
    specialties = Column(ARRAY(String), nullable=True)
    location = Column(String, nullable=True)
    city = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    available_days = Column(ARRAY(String), nullable=True)
    languages = Column(ARRAY(String), nullable=True)
    is_available = Column(Boolean, default=True)
    price_range_min = Column(Integer, nullable=True)
    price_range_max = Column(Integer, nullable=True)
    free_quote = Column(Boolean, default=False)
    bio = Column(String, nullable=True)
    
    # Metrics
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)
    response_time_minutes = Column(Integer, default=0)
    
    # System & Verification
    fcm_token = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    id_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen = Column(DateTime(timezone=True), nullable=True)
