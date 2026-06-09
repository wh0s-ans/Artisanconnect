from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.support import SupportTicket
from app.models.user import User
from app.schemas.support import SupportTicketCreate, SupportTicketResponse
from app.services.auth import get_current_user
from typing import List

router = APIRouter(prefix="/support", tags=["support"])

@router.post("/tickets", response_model=SupportTicketResponse, status_code=201)
async def create_ticket(
    ticket_data: SupportTicketCreate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    new_ticket = SupportTicket(**ticket_data.model_dump(), user_id=current_user.id)
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    return new_ticket

@router.get("/tickets/mine", response_model=List[SupportTicketResponse])
async def get_my_tickets(
    limit: int = 20, offset: int = 0,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SupportTicket).where(SupportTicket.user_id == current_user.id).offset(offset).limit(limit)
    )
    return result.scalars().all()
