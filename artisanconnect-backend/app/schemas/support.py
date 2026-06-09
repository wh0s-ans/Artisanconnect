from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SupportTicketBase(BaseModel):
    subject: str
    message: str

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketUpdateStatus(BaseModel):
    status: str = Field(pattern="^(open|closed)$")
    admin_response: Optional[str] = None

class SupportTicketResponse(SupportTicketBase):
    id: str
    user_id: str
    status: str
    admin_response: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
