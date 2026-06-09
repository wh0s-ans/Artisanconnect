from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.chat import Chat, Message
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatResponse, MessageCreate, MessageResponse
from app.services.auth import get_current_user
from typing import List

router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("", response_model=List[ChatResponse])
async def get_chats(
    limit: int = 20, offset: int = 0,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # In a real app we'd query chats where current_user.id is in participants array.
    # Postgres JSON/ARRAY syntax would be used: Chat.participants.contains([current_user.id])
    # Assuming SQLAlchemy ARRAY support
    query = select(Chat).where(Chat.participants.contains([current_user.id])).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/start", response_model=ChatResponse)
async def start_chat(
    chat_data: ChatCreate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    participants = [current_user.id, chat_data.participant_id]
    new_chat = Chat(participants=participants, request_id=chat_data.request_id)
    db.add(new_chat)
    await db.commit()
    await db.refresh(new_chat)
    return new_chat

@router.get("/{id}/messages", response_model=List[MessageResponse])
async def get_messages(
    id: str, 
    limit: int = 50, offset: int = 0,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Message).where(Message.chat_id == id).order_by(Message.created_at.desc()).offset(offset).limit(limit))
    return result.scalars().all()

@router.post("/{id}/messages", response_model=MessageResponse)
async def send_message(
    id: str, 
    message_data: MessageCreate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Chat).where(Chat.id == id))
    chat = result.scalars().first()
    if not chat or current_user.id not in chat.participants:
        raise HTTPException(status_code=404, detail={"error": "Chat not found or access denied"})
        
    new_message = Message(chat_id=id, sender_id=current_user.id, content=message_data.content)
    db.add(new_message)
    
    # Update chat last_message
    chat.last_message = message_data.content
    
    await db.commit()
    await db.refresh(new_message)
    return new_message

@router.put("/{id}/read")
async def mark_as_read(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat).where(Chat.id == id))
    chat = result.scalars().first()
    if not chat or current_user.id not in chat.participants:
        raise HTTPException(status_code=404, detail={"error": "Chat not found or access denied"})
        
    from sqlalchemy import update
    from sqlalchemy.sql import func
    await db.execute(
        update(Message)
        .where(Message.chat_id == id, Message.sender_id != current_user.id, Message.is_read == False)
        .values(is_read=True, read_at=func.now())
    )
    await db.commit()
    return {"message": "Chat messages marked as read"}
