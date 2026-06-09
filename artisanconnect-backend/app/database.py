from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

# If it's testing, ensure SQLite is supported async
engine_url = settings.DATABASE_URL
if engine_url.startswith("sqlite"):
    engine = create_async_engine(engine_url, connect_args={"check_same_thread": False})
else:
    engine = create_async_engine(engine_url, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
