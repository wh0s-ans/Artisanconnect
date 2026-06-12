from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectUpdateStatus, ProjectResponse
from app.services.auth import get_current_user
from typing import List

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/mine")
async def get_my_projects(
    limit: int = 20, offset: int = 0,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    from app.models.request import Request
    from app.models.proposal import Proposal

    query = select(Project).where(
        or_(Project.client_id == current_user.id, Project.artisan_id == current_user.id)
    ).offset(offset).limit(limit)
    result = await db.execute(query)
    projects = result.scalars().all()

    enriched = []
    for project in projects:
        # Fetch associated request
        req_res = await db.execute(select(Request).where(Request.id == project.request_id))
        req = req_res.scalars().first()
        # Fetch associated proposal
        prop_res = await db.execute(select(Proposal).where(Proposal.id == project.proposal_id))
        prop = prop_res.scalars().first()

        enriched.append({
            "id": project.id,
            "request_id": project.request_id,
            "proposal_id": project.proposal_id,
            "client_id": project.client_id,
            "artisan_id": project.artisan_id,
            "status": project.status,
            "checklist": project.checklist,
            "before_photos": project.before_photos,
            "after_photos": project.after_photos,
            "started_at": project.started_at,
            "completed_at": project.completed_at,
            "created_at": project.created_at,
            # Enriched from request
            "title": req.title if req else "Mission",
            "category": req.category if req else None,
            "location": req.location if req else None,
            "budget": req.budget if req else None,
            # Enriched from proposal
            "price": prop.price if prop else None,
            "delay_days": prop.delay_days if prop else None,
        })

    return enriched

@router.get("/{id}", response_model=ProjectResponse)
async def get_project(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
        
    if project.client_id != current_user.id and project.artisan_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
    return project

@router.put("/{id}/status", response_model=ProjectResponse)
async def update_project_status(
    id: str, 
    update_data: ProjectUpdateStatus,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
        
    if project.client_id != current_user.id and project.artisan_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    project.status = update_data.status
    await db.commit()
    await db.refresh(project)
    return project

@router.put("/{id}/complete", response_model=ProjectResponse)
async def complete_project(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from datetime import datetime
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
        
    if project.client_id != current_user.id and project.artisan_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
        
    project.status = "completed"
    project.completed_at = datetime.utcnow()
    await db.commit()
    await db.refresh(project)
    return project

@router.put("/{id}/checklist")
async def update_project_checklist(
    id: str, 
    checklist: list,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
    
    if project.client_id != current_user.id and project.artisan_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
    
    project.checklist = checklist
    await db.commit()
    return {"message": "Checklist updated"}

@router.post("/{id}/before-photos")
async def add_before_photos(
    id: str, 
    photos: List[str], 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
        
    if project.client_id != current_user.id and project.artisan_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
    
    current_photos = project.before_photos or []
    current_photos.extend(photos)
    project.before_photos = current_photos
    await db.commit()
    return {"message": "Photos added"}

@router.post("/{id}/after-photos")
async def add_after_photos(
    id: str, 
    photos: List[str], 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found"})
        
    if project.client_id != current_user.id and project.artisan_id != current_user.id:
        raise HTTPException(status_code=403, detail={"error": "Not authorized"})
    
    current_photos = project.after_photos or []
    current_photos.extend(photos)
    project.after_photos = current_photos
    await db.commit()
    return {"message": "Photos added"}
