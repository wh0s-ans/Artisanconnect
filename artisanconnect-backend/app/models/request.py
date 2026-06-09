from sqlalchemy import Column, String, Boolean, Float, Integer, ARRAY, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Request(Base):
    __tablename__ = "requests"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    budget = Column(Integer, nullable=True)
    urgency = Column(String, nullable=False) # normal, urgent, very_urgent
    status = Column(String, default="open", index=True) # open, in_progress, completed, cancelled
    
    material_provided = Column(Boolean, default=False)
    access_info = Column(String, nullable=True)
    area_sqm = Column(Float, nullable=True)
    availability_slots = Column(JSON, nullable=True)
    photos = Column(ARRAY(String), nullable=True)
    is_public = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
