from sqlalchemy import Column, String, DateTime, JSON, ARRAY, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String, ForeignKey("requests.id"), nullable=False, index=True)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    client_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    artisan_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, default="pending", index=True) # pending, accepted, in_progress, completed, cancelled
    
    checklist = Column(JSON, nullable=True) # array of {item, checked, checked_by, checked_at}
    before_photos = Column(ARRAY(String), nullable=True)
    after_photos = Column(ARRAY(String), nullable=True)
    timeline_events = Column(JSON, nullable=True) # array of {type, timestamp, description, photo}
    
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
