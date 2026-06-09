import asyncio
import asyncpg
import sys

async def create_test_db():
    try:
        # Connect to the default postgres database to create the test db
        sys_conn = await asyncpg.connect('postgresql://postgres:whosans@localhost:5432/postgres')
        # Check if db exists
        db_exists = await sys_conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'artisanconnect_test'")
        if not db_exists:
            print("Creating artisanconnect_test database...")
            await sys_conn.execute('CREATE DATABASE artisanconnect_test')
        else:
            print("Database artisanconnect_test already exists.")
        await sys_conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

asyncio.run(create_test_db())
