import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.agents.recommendation_agent import RecommendationAgent
from src.models.customer import Customer
from src.models.product import Product

@pytest.fixture
def mock_gemini():
    with patch('src.agents.recommendation_agent.genai.GenerativeModel') as mock:
        model = MagicMock()
        model.generate_content = AsyncMock()
        mock.return_value = model
        yield model

@pytest.fixture
def mock_db():
    db = MagicMock()
    db.query = MagicMock()
    yield db

@pytest.fixture
def recommendation_agent(mock_gemini, mock_db):
    return RecommendationAgent(api_key="test_key", db=mock_db)

@pytest.mark.asyncio
async def test_calculate_match_score(recommendation_agent, mock_gemini):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    product = Product(id="1", name="Test Product", category="electronics")
    mock_gemini.generate_content.return_value.text = "0.85"

    # Execute
    score = await recommendation_agent._calculate_match_score(customer, product)

    # Assert
    assert 0 <= score <= 1
    mock_gemini.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_generate_explanation(recommendation_agent, mock_gemini):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    product = Product(id="1", name="Test Product", category="electronics")
    mock_gemini.generate_content.return_value.text = "This product matches your interests"

    # Execute
    explanation = await recommendation_agent._generate_explanation(customer, product)

    # Assert
    assert isinstance(explanation, str)
    assert len(explanation) > 0
    mock_gemini.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_process_recommendations(recommendation_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    products = [
        Product(id="1", name="Product 1", category="electronics"),
        Product(id="2", name="Product 2", category="electronics")
    ]
    mock_db.query.return_value.all.return_value = products
    mock_gemini.generate_content.return_value.text = "0.85"

    # Execute
    result = await recommendation_agent.process(customer, mood="happy")

    # Assert
    assert "recommendations" in result
    assert "mood_considered" in result
    assert isinstance(result["recommendations"], list)
    assert len(result["recommendations"]) > 0

@pytest.mark.asyncio
async def test_explain_recommendation(recommendation_agent, mock_gemini):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    product = Product(id="1", name="Test Product", category="electronics")
    mock_gemini.generate_content.return_value.text = "This product matches your interests"

    # Execute
    explanation = await recommendation_agent.explain_recommendation(customer, product)

    # Assert
    assert isinstance(explanation, str)
    assert len(explanation) > 0
    mock_gemini.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_process_with_empty_products(recommendation_agent, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    mock_db.query.return_value.all.return_value = []

    # Execute
    result = await recommendation_agent.process(customer, mood="happy")

    # Assert
    assert "recommendations" in result
    assert len(result["recommendations"]) == 0

@pytest.mark.asyncio
async def test_process_with_invalid_mood(recommendation_agent, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    products = [Product(id="1", name="Test Product", category="electronics")]
    mock_db.query.return_value.all.return_value = products

    # Execute and Assert
    with pytest.raises(ValueError):
        await recommendation_agent.process(customer, mood="invalid_mood")

@pytest.mark.asyncio
async def test_process_with_customer_preferences(recommendation_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(
        id="1",
        name="Test User",
        preferences={
            "category": "electronics",
            "price_range": "high",
            "brand_preferences": ["Brand1", "Brand2"]
        }
    )
    products = [
        Product(id="1", name="Product 1", category="electronics", brand="Brand1"),
        Product(id="2", name="Product 2", category="electronics", brand="Brand3")
    ]
    mock_db.query.return_value.all.return_value = products
    mock_gemini.generate_content.return_value.text = "0.9"

    # Execute
    result = await recommendation_agent.process(customer, mood="happy")

    # Assert
    assert "recommendations" in result
    recommendations = result["recommendations"]
    assert len(recommendations) > 0
    # Verify that Brand1 product has higher score
    brand1_scores = [r["score"] for r in recommendations if r["product"].brand == "Brand1"]
    brand3_scores = [r["score"] for r in recommendations if r["product"].brand == "Brand3"]
    assert all(s1 >= s3 for s1 in brand1_scores for s3 in brand3_scores) 