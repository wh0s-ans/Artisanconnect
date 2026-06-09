import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_proposal(client: AsyncClient):
    # 1. Register Client
    reg_client = await client.post("/auth/register", json={
        "email": "client@prop.com", "password": "password123", "role": "client", "display_name": "Client"
    })
    client_token = reg_client.json()["access_token"]
    
    # 2. Create Request
    req_res = await client.post("/requests", headers={"Authorization": f"Bearer {client_token}"}, json={
        "title": "Fix pipe", "description": "Leak", "category": "plumbing", "location": "123 St", "city": "Paris", "urgency": "urgent"
    })
    request_id = req_res.json()["id"]
    
    # 3. Register Artisan
    reg_artisan = await client.post("/auth/register", json={
        "email": "artisan@prop.com", "password": "password123", "role": "artisan", "display_name": "Artisan"
    })
    artisan_token = reg_artisan.json()["access_token"]
    
    # 4. Create Proposal
    prop_res = await client.post("/proposals", headers={"Authorization": f"Bearer {artisan_token}"}, json={
        "request_id": request_id,
        "price": 500,
        "delay_days": 2,
        "message": "I can fix it tomorrow"
    })
    assert prop_res.status_code == 201
    assert prop_res.json()["status"] == "pending"
    assert prop_res.json()["price"] == 500
