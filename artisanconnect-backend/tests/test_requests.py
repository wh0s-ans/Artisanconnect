import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_request(client: AsyncClient):
    # Register client
    reg_response = await client.post(
        "/auth/register",
        json={
            "email": "client@req.com",
            "password": "password123",
            "role": "client",
            "display_name": "Client Req"
        }
    )
    token = reg_response.json()["access_token"]
    
    # Create request
    response = await client.post(
        "/requests",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Fix pipe",
            "description": "Leaking pipe in kitchen",
            "category": "plumbing",
            "location": "123 Main St",
            "city": "Paris",
            "urgency": "urgent",
            "is_public": True
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Fix pipe"
    assert data["status"] == "open"
