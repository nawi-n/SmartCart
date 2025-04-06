import pytest
from fastapi.testclient import TestClient
from ..main import app
from ..database.schema import Base, engine
from sqlalchemy.orm import sessionmaker

client = TestClient(app)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.rollback()
    Base.metadata.drop_all(bind=engine)

def test_generate_customer_persona(db_session):
    response = client.post(
        "/customer/persona",
        json={"name": "Test Customer"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "name" in data
    assert data["name"] == "Test Customer"

def test_get_recommendations(db_session):
    # First create a customer
    customer_response = client.post(
        "/customer/persona",
        json={"name": "Test Customer"}
    )
    customer_id = customer_response.json()["id"]
    
    # Then get recommendations
    response = client.get(f"/recommendations/{customer_id}")
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

def test_track_mood(db_session):
    # First create a customer
    customer_response = client.post(
        "/customer/persona",
        json={"name": "Test Customer"}
    )
    customer_id = customer_response.json()["id"]
    
    # Then track mood
    response = client.post(
        "/mood/track",
        json={
            "customer_id": customer_id,
            "mood": "Happy"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Mood tracked successfully"

def test_voice_search(db_session):
    response = client.post(
        "/voice/search",
        json={"query": "Find me a laptop"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert isinstance(data["products"], list)
    if data["products"]:
        assert "name" in data["products"][0]
        assert "category" in data["products"][0]

def test_chat_assistant(db_session):
    # First create a customer
    customer_response = client.post(
        "/customer/persona",
        json={"name": "Test Customer"}
    )
    customer_id = customer_response.json()["id"]
    
    # Then send a chat message
    response = client.post(
        "/chat",
        json={
            "customer_id": customer_id,
            "message": "What laptops do you recommend?",
            "context": {}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0

def test_get_products(db_session):
    response = client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "id" in data[0]
        assert "name" in data[0]
        assert "price" in data[0]

def test_error_handling():
    # Test invalid customer ID
    response = client.get("/recommendations/invalid_id")
    assert response.status_code == 404
    
    # Test invalid mood
    response = client.post(
        "/mood/track",
        json={
            "customer_id": "invalid_id",
            "mood": "InvalidMood"
        }
    )
    assert response.status_code == 422
    
    # Test invalid chat message
    response = client.post(
        "/chat",
        json={
            "customer_id": "invalid_id",
            "message": "",
            "context": {}
        }
    )
    assert response.status_code == 422 