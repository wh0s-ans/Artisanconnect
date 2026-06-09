from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    punctuality: int = Field(ge=1, le=5)
    quality: int = Field(ge=1, le=5)
    cleanliness: int = Field(ge=1, le=5)
    communication: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    photo_url: Optional[str] = None
    is_public: bool = True

class ReviewCreate(ReviewBase):
    project_id: str
    reviewee_id: str

class ReviewResponse(ReviewBase):
    id: str
    project_id: str
    reviewer_id: str
    reviewee_id: str
    reply: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
