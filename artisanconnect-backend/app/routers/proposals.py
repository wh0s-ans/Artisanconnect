from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.proposal import Proposal
from app.models.request import Request
from app.models.user import User
from app.schemas.proposal import ProposalCreate, ProposalUpdateStatus, ProposalResponse
from app.services.auth import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/proposals", tags=["proposals"])

@router.post("", response_model=ProposalResponse, status_code=201)
async def create_proposal(
    proposal_data: ProposalCreate, 
    current_user: User = Depends(require_role(["artisan"])), 
    db: AsyncSession = Depends(get_db)
):
    # Verify request exists
    result = await db.execute(select(Request).where(Request.id == proposal_data.request_id))
    request = result.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Request not found"})
        
    new_proposal = Proposal(**proposal_data.model_dump(), artisan_id=current_user.id)
    db.add(new_proposal)
    await db.commit()
    await db.refresh(new_proposal)
    return new_proposal

@router.get("/request/{request_id}", response_model=List[ProposalResponse])
async def get_request_proposals(
    request_id: str, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Request).where(Request.id == request_id))
    request = result.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Request not found"})
        
    if request.client_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    result = await db.execute(select(Proposal).where(Proposal.request_id == request_id))
    return result.scalars().all()

@router.get("/mine", response_model=List[ProposalResponse])
async def get_my_proposals(
    limit: int = 20, offset: int = 0,
    current_user: User = Depends(require_role(["artisan"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Proposal).where(Proposal.artisan_id == current_user.id).offset(offset).limit(limit)
    )
    return result.scalars().all()

@router.put("/{id}/accept", response_model=ProposalResponse)
async def accept_proposal(
    id: str, 
    current_user: User = Depends(require_role(["client"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Proposal).where(Proposal.id == id))
    proposal = result.scalars().first()
    if not proposal:
        raise HTTPException(status_code=404, detail={"error": "Proposal not found"})
        
    # Check if user owns the request
    req_res = await db.execute(select(Request).where(Request.id == proposal.request_id))
    request = req_res.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Associated request not found"})
    if request.client_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    proposal.status = "accepted"
    request.status = "assigned"
    request.assigned_artisan_id = proposal.artisan_id
    
    # Create a Project
    from app.models.project import Project
    new_project = Project(
        request_id=proposal.request_id,
        proposal_id=proposal.id,
        client_id=current_user.id,
        artisan_id=proposal.artisan_id,
        status="in_progress"
    )
    db.add(new_project)
    
    await db.commit()
    await db.refresh(proposal)
    return proposal

@router.put("/{id}/refuse", response_model=ProposalResponse)
async def refuse_proposal(
    id: str, 
    update_data: ProposalUpdateStatus,
    current_user: User = Depends(require_role(["client"])), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Proposal).where(Proposal.id == id))
    proposal = result.scalars().first()
    if not proposal:
        raise HTTPException(status_code=404, detail={"error": "Proposal not found"})
        
    # Check if user owns the request
    req_res = await db.execute(select(Request).where(Request.id == proposal.request_id))
    request = req_res.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Associated request not found"})
    if request.client_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    proposal.status = "refused"
    proposal.refusal_reason = update_data.refusal_reason
    await db.commit()
    await db.refresh(proposal)
    return proposal
