from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_
from app.database import get_db
from app.models.request import Request
from app.models.user import User
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse
from app.services.auth import get_current_user, require_role
from typing import List, Optional

router = APIRouter(prefix="/requests", tags=["requests"])

@router.get("/mine", response_model=List[RequestResponse])
async def get_my_requests(
    limit: int = 20, offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Request).where(Request.client_id == current_user.id)
        .order_by(Request.created_at.desc()).offset(offset).limit(limit)
    )
    return result.scalars().all()

@router.get("", response_model=List[RequestResponse])
async def get_requests(
    category: Optional[str] = None,
    city: Optional[str] = None,
    urgency: Optional[str] = None,
    status: Optional[str] = "open",
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(Request)
    if status:
        query = query.where(Request.status == status)
    if category:
        query = query.where(Request.category == category)
    if city:
        query = query.where(Request.city == city)
    if urgency:
        query = query.where(Request.urgency == urgency)
        
    query = query.where(Request.is_public == True).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=RequestResponse, status_code=201)
async def create_request(
    request_data: RequestCreate, 
    current_user: User = Depends(require_role(["client"])), 
    db: AsyncSession = Depends(get_db)
):
    new_request = Request(**request_data.model_dump(), client_id=current_user.id)
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)
    return new_request

@router.get("/{id}", response_model=RequestResponse)
async def get_request(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Request).where(Request.id == id))
    request = result.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Request not found", "code": "NOT_FOUND"})
    return request

@router.put("/{id}", response_model=RequestResponse)
async def update_request(
    id: str, 
    request_update: RequestUpdate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Request).where(Request.id == id))
    request = result.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Request not found"})
    if request.client_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    update_data = request_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(request, key, value)
        
    await db.commit()
    await db.refresh(request)
    return request

@router.delete("/{id}")
async def delete_request(
    id: str, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Request).where(Request.id == id))
    request = result.scalars().first()
    if not request:
        raise HTTPException(status_code=404, detail={"error": "Request not found"})
    if request.client_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    await db.delete(request)
    await db.commit()
    return {"message": "Request deleted successfully"}
