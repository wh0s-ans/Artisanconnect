import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

# Set working directory to load .env correctly
os.chdir('c:/Artisanconnect/artisanconnect-backend')

DATABASE_URL = "postgresql+asyncpg://postgres:whosans@localhost:5432/artisanconnect"

async def test_connection():
    print(f"Tentative de connexion à {DATABASE_URL}...")
    try:
        engine = create_async_engine(DATABASE_URL)
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("✅ Connexion réussie à la base de données PostgreSQL !")
            
            # Count users
            result_users = await conn.execute(text("SELECT COUNT(*) FROM users"))
            count = result_users.scalar()
            print(f"📊 Nombre d'utilisateurs dans la base: {count}")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
