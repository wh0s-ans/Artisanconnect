from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.request import Request
from app.models.support import SupportTicket
from app.schemas.user import UserResponse
from app.schemas.request import RequestResponse
from app.schemas.support import SupportTicketResponse, SupportTicketUpdateStatus
from app.services.auth import require_role
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    limit: int = 50, offset: int = 0,
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).offset(offset).limit(limit))
    return result.scalars().all()

@router.put("/users/{id}/verify")
async def verify_user(
    id: str, 
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "User not found"})
        
    user.is_verified = True
    user.id_verified = True
    await db.commit()
    return {"message": "User verified successfully"}

@router.get("/requests", response_model=List[RequestResponse])
async def get_all_requests(
    limit: int = 50, offset: int = 0,
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Request).offset(offset).limit(limit))
    return result.scalars().all()

@router.get("/support/tickets", response_model=List[SupportTicketResponse])
async def get_support_tickets(
    status: str = None,
    limit: int = 50, offset: int = 0,
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    query = select(SupportTicket)
    if status:
        query = query.where(SupportTicket.status == status)
    result = await db.execute(query.offset(offset).limit(limit))
    return result.scalars().all()

@router.put("/support/tickets/{id}/resolve", response_model=SupportTicketResponse)
async def resolve_ticket(
    id: str, 
    update_data: SupportTicketUpdateStatus,
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(SupportTicket).where(SupportTicket.id == id))
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail={"error": "Ticket not found"})
        
    ticket.status = update_data.status
    if update_data.admin_response:
        ticket.admin_response = update_data.admin_response
    if update_data.status == "closed":
        ticket.resolved_at = func.now()
        
    await db.commit()
    await db.refresh(ticket)
    return ticket

@router.get("/stats")
async def get_stats(
    current_user: User = Depends(require_role(["admin"])), 
    db: AsyncSession = Depends(get_db)
):
    from app.models.proposal import Proposal
    from app.models.project import Project

    users_count = await db.execute(select(func.count(User.id)))
    requests_count = await db.execute(select(func.count(Request.id)))
    proposals_count = await db.execute(select(func.count(Proposal.id)))
    projects_count = await db.execute(select(func.count(Project.id)))
    tickets_count = await db.execute(select(func.count(SupportTicket.id)))
    
    return {
        "total_users": users_count.scalar(),
        "total_requests": requests_count.scalar(),
        "total_proposals": proposals_count.scalar(),
        "total_projects": projects_count.scalar(),
        "total_tickets": tickets_count.scalar()
    }
