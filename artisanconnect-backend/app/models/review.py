from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, index=True)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    reviewee_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    punctuality = Column(Integer, nullable=False)
    quality = Column(Integer, nullable=False)
    cleanliness = Column(Integer, nullable=False)
    communication = Column(Integer, nullable=False)
    
    comment = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    reply = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
