from sqlalchemy import Column, String, DateTime, ARRAY, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Chat(Base):
    __tablename__ = "chats"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    participants = Column(ARRAY(String), nullable=False) # list of user ids
    request_id = Column(String, ForeignKey("requests.id"), nullable=True)
    last_message = Column(String, nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String, ForeignKey("chats.id"), nullable=False, index=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
