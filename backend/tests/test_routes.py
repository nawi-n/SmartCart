import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from typing import Dict, Any
import asyncio
from datetime import datetime, timedelta

from src.main import app
from tests.utils.route_discovery import (
    get_all_routes,
    create_route_test_cases,
    validate_response
)

@pytest.mark.asyncio
async def test_all_routes(async_client: AsyncClient):
    """Test all routes dynamically."""
    routes = get_all_routes(app)
    
    for route in routes:
        test_cases = create_route_test_cases(route)
        
        for test_case in test_cases:
            # Skip test cases for routes that require authentication
            if any(tag == "auth" for tag in route.get("tags", [])):
                continue
                
            for method in route["methods"]:
                if method == "GET":
                    response = await async_client.get(
                        route["path"],
                        params=test_case["params"]
                    )
                elif method == "POST":
                    response = await async_client.post(
                        route["path"],
                        json=test_case["body"],
                        params=test_case["params"]
                    )
                elif method == "PUT":
                    response = await async_client.put(
                        route["path"],
                        json=test_case["body"],
                        params=test_case["params"]
                    )
                elif method == "DELETE":
                    response = await async_client.delete(
                        route["path"],
                        params=test_case["params"]
                    )
                else:
                    continue
                
                assert response.status_code == test_case["expected_status"]
                
                if response.status_code == 200:
                    assert validate_response(response.json(), route)

@pytest.mark.asyncio
async def test_customer_flow(async_client: AsyncClient):
    """Test the complete customer flow."""
    # Create customer
    customer_data = {
        "name": "Test Customer",
        "email": "test@example.com"
    }
    response = await async_client.post("/customers", json=customer_data)
    assert response.status_code == 200
    customer = response.json()
    customer_id = customer["id"]
    
    # Generate persona
    response = await async_client.post(f"/customers/{customer_id}/generate-persona")
    assert response.status_code == 200
    persona = response.json()
    assert "psychographic_traits" in persona
    
    # Track behavior
    behavior_data = {
        "viewed_products": ["product1", "product2"],
        "time_spent": 300,
        "search_history": ["query1", "query2"],
        "category_interests": {"electronics": 5, "clothing": 3}
    }
    response = await async_client.post(
        f"/customers/{customer_id}/behavior",
        json=behavior_data
    )
    assert response.status_code == 200
    
    # Track mood
    response = await async_client.post(
        f"/customers/{customer_id}/mood",
        json={"mood": "happy"}
    )
    assert response.status_code == 200
    
    # Get recommendations
    response = await async_client.get(f"/recommendations/{customer_id}")
    assert response.status_code == 200
    recommendations = response.json()
    assert len(recommendations) > 0
    assert all("psychographic_match" in rec for rec in recommendations)

@pytest.mark.asyncio
async def test_product_flow(async_client: AsyncClient):
    """Test the complete product flow."""
    # Create product
    product_data = {
        "name": "Test Product",
        "brand": "Test Brand",
        "category": "electronics",
        "description": "Test description",
        "price": 99.99,
        "features": ["feature1", "feature2"],
        "unique_selling_points": ["usp1", "usp2"],
        "price_point": "mid-range",
        "quality_level": "high",
        "mood_tags": ["happy", "excited"]
    }
    response = await async_client.post("/products", json=product_data)
    assert response.status_code == 200
    product = response.json()
    product_id = product["id"]
    
    # Generate story
    response = await async_client.post(f"/products/{product_id}/generate-story")
    assert response.status_code == 200
    story = response.json()
    assert "story" in story
    
    # Get product details
    response = await async_client.get(f"/products/{product_id}")
    assert response.status_code == 200
    product_details = response.json()
    assert product_details["id"] == product_id
    assert "story" in product_details

@pytest.mark.asyncio
async def test_chat_flow(async_client: AsyncClient):
    """Test the chat assistant flow."""
    # Create customer first
    customer_data = {
        "name": "Chat Test Customer",
        "email": "chat@example.com"
    }
    response = await async_client.post("/customers", json=customer_data)
    assert response.status_code == 200
    customer = response.json()
    customer_id = customer["id"]
    
    # Send chat message
    message_data = {
        "message": "What are your best recommendations for me?",
        "context": {
            "current_mood": "happy",
            "recent_views": ["product1", "product2"]
        }
    }
    response = await async_client.post(
        f"/chat/{customer_id}",
        json=message_data
    )
    assert response.status_code == 200
    chat_response = response.json()
    assert "response" in chat_response
    assert "recommendations" in chat_response

@pytest.mark.asyncio
async def test_error_handling(async_client: AsyncClient):
    """Test error handling across endpoints."""
    # Test invalid customer ID
    response = await async_client.get("/customers/invalid-id")
    assert response.status_code == 404
    
    # Test invalid product ID
    response = await async_client.get("/products/invalid-id")
    assert response.status_code == 404
    
    # Test invalid mood
    response = await async_client.post(
        "/customers/invalid-id/mood",
        json={"mood": "invalid-mood"}
    )
    assert response.status_code == 404
    
    # Test invalid chat message
    response = await async_client.post(
        "/chat/invalid-id",
        json={"message": ""}
    )
    assert response.status_code == 404 