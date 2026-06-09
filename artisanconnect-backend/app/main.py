from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ArtisanConnect API",
    description="Backend for ArtisanConnect Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

from app.routers import auth, users, requests, proposals, projects, reviews, chat, notifications, support, admin

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(requests.router)
app.include_router(proposals.router)
app.include_router(projects.router)
app.include_router(reviews.router)
app.include_router(chat.router)
app.include_router(notifications.router)
app.include_router(support.router)
app.include_router(admin.router)
