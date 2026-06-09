from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChecklistItem(BaseModel):
    item: str
    checked: bool = False
    checked_by: Optional[str] = None
    checked_at: Optional[datetime] = None

class TimelineEvent(BaseModel):
    type: str
    timestamp: datetime
    description: str
    photo: Optional[str] = None

class ProjectBase(BaseModel):
    checklist: Optional[List[Dict[str, Any]]] = None
    before_photos: Optional[List[str]] = None
    after_photos: Optional[List[str]] = None

class ProjectUpdateStatus(BaseModel):
    status: str = Field(pattern="^(pending|accepted|in_progress|completed|cancelled)$")

class ProjectResponse(ProjectBase):
    id: str
    request_id: str
    proposal_id: str
    client_id: str
    artisan_id: str
    status: str
    timeline_events: Optional[List[Dict[str, Any]]]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
