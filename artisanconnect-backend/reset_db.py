import asyncio
import asyncpg
import sys

async def main():
    try:
        print("Connecting to DB...")
        conn = await asyncpg.connect('postgresql://postgres:whosans@localhost:5432/artisanconnect')
        print("Dropping public schema...")
        await conn.execute('DROP SCHEMA public CASCADE;')
        print("Creating public schema...")
        await conn.execute('CREATE SCHEMA public;')
        await conn.execute('GRANT ALL ON SCHEMA public TO postgres;')
        await conn.execute('GRANT ALL ON SCHEMA public TO public;')
        print("Schema reset successful.")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

asyncio.run(main())
