from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: str
    chat_id: str
    sender_id: str
    is_read: bool
    read_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    request_id: Optional[str] = None
    participant_id: str

class ChatResponse(BaseModel):
    id: str
    participants: List[str]
    request_id: Optional[str]
    last_message: Optional[str]
    last_message_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
