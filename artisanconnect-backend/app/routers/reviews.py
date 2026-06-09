from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.auth import get_current_user
from typing import List

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("", response_model=ReviewResponse, status_code=201)
async def create_review(
    review_data: ReviewCreate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    new_review = Review(**review_data.model_dump(), reviewer_id=current_user.id)
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return new_review

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
async def get_user_reviews(
    user_id: str, 
    limit: int = 20, offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Review).where(Review.reviewee_id == user_id, Review.is_public == True).offset(offset).limit(limit)
    )
    return result.scalars().all()

@router.get("/project/{project_id}", response_model=List[ReviewResponse])
async def get_project_reviews(
    project_id: str, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Review).where(Review.project_id == project_id))
    return result.scalars().all()

@router.put("/{id}/reply", response_model=ReviewResponse)
async def reply_review(
    id: str, 
    reply: str, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Review).where(Review.id == id))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    if review.reviewee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to reply to this review")
        
    review.reply = reply
    await db.commit()
    await db.refresh(review)
    return review
