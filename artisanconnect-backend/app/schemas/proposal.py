from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProposalBase(BaseModel):
    price: int
    labor_cost: Optional[int] = None
    material_cost: Optional[int] = None
    delay_days: int
    message: str
    valid_until: Optional[datetime] = None

class ProposalCreate(ProposalBase):
    request_id: str

class ProposalUpdateStatus(BaseModel):
    status: str = Field(pattern="^(pending|accepted|refused|expired)$")
    refusal_reason: Optional[str] = None

class ProposalResponse(ProposalBase):
    id: str
    request_id: str
    artisan_id: str
    status: str
    refusal_reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
