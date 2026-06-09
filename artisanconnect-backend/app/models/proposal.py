from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String, ForeignKey("requests.id"), nullable=False, index=True)
    artisan_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    price = Column(Integer, nullable=False)
    labor_cost = Column(Integer, nullable=True)
    material_cost = Column(Integer, nullable=True)
    delay_days = Column(Integer, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="pending", index=True) # pending, accepted, refused, expired
    refusal_reason = Column(String, nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
