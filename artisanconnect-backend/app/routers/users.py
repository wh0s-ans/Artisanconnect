from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth import get_current_user
from app.utils.geo import calculate_distance
from typing import List, Optional

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/{id}/public-profile", response_model=UserResponse)
async def get_public_profile(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "User not found", "code": "USER_NOT_FOUND"})
    return user

@router.put("/me/availability", response_model=UserResponse)
async def update_availability(is_available: bool, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.is_available = is_available
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.put("/me/fcm-token")
async def update_fcm_token(fcm_token: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.fcm_token = fcm_token
    await db.commit()
    return {"message": "FCM token updated successfully"}

@router.get("/nearby", response_model=List[UserResponse])
async def get_nearby_artisans(
    lat: float, 
    lng: float, 
    radius: float = Query(50.0, description="Radius in km"), 
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    import math
    # Bounding box filter at SQL level to avoid loading all users in memory
    lat_delta = radius / 111.0
    try:
        cos_lat = math.cos(math.radians(lat))
        lng_delta = radius / (111.0 * cos_lat) if cos_lat > 0.01 else 360.0
    except Exception:
        lng_delta = 360.0

    query = select(User).where(
        User.role == "artisan", 
        User.is_available == True,
        User.lat >= lat - lat_delta,
        User.lat <= lat + lat_delta,
        User.lng >= lng - lng_delta,
        User.lng <= lng + lng_delta
    )
    result = await db.execute(query)
    artisans = result.scalars().all()
    
    nearby = []
    for artisan in artisans:
        if artisan.lat is not None and artisan.lng is not None:
            dist = calculate_distance(lat, lng, artisan.lat, artisan.lng)
            if dist <= radius:
                if category and category not in (artisan.specialties or []):
                    continue
                nearby.append(artisan)
    
    return nearby[offset:offset+limit]
