import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "role": "client",
            "display_name": "Test Client"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    # First register
    await client.post(
        "/auth/register",
        json={
            "email": "login@example.com",
            "password": "password123",
            "role": "artisan",
            "display_name": "Test Artisan"
        }
    )
    
    # Then login
    response = await client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    
@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    response = await client.post(
        "/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 401
