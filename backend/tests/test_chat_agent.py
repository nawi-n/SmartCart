import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.agents.chat_agent import ChatAgent
from src.models.customer import Customer
from src.models.chat_history import ChatHistory

@pytest.fixture
def mock_gemini():
    with patch('src.agents.chat_agent.genai.GenerativeModel') as mock:
        model = MagicMock()
        model.generate_content = AsyncMock()
        mock.return_value = model
        yield model

@pytest.fixture
def mock_db():
    db = MagicMock()
    db.query = MagicMock()
    db.add = MagicMock()
    db.commit = MagicMock()
    yield db

@pytest.fixture
def chat_agent(mock_gemini, mock_db):
    return ChatAgent(api_key="test_key", db=mock_db)

@pytest.mark.asyncio
async def test_process_message(chat_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    message = "What electronics do you recommend?"
    mock_gemini.generate_content.return_value.text = "I recommend a smartphone based on your preferences."
    
    # Execute
    response = await chat_agent.process_message(customer, message)
    
    # Assert
    assert isinstance(response, str)
    assert len(response) > 0
    mock_gemini.generate_content.assert_called_once()
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_get_chat_history(chat_agent, mock_db):
    # Setup
    customer_id = "1"
    chat_history = [
        ChatHistory(
            id="1",
            customer_id=customer_id,
            message="Hi",
            response="Hello!",
            created_at="2024-01-01T00:00:00"
        ),
        ChatHistory(
            id="2",
            customer_id=customer_id,
            message="How are you?",
            response="I'm doing well!",
            created_at="2024-01-01T00:01:00"
        )
    ]
    mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = chat_history
    
    # Execute
    history = await chat_agent.get_chat_history(customer_id)
    
    # Assert
    assert isinstance(history, list)
    assert len(history) == 2
    assert all(isinstance(entry, ChatHistory) for entry in history)

@pytest.mark.asyncio
async def test_process_message_with_context(chat_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    message = "Tell me more about that smartphone"
    chat_history = [
        ChatHistory(
            id="1",
            customer_id=customer.id,
            message="What electronics do you recommend?",
            response="I recommend a smartphone based on your preferences.",
            created_at="2024-01-01T00:00:00"
        )
    ]
    mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = chat_history
    mock_gemini.generate_content.return_value.text = "The smartphone has great features..."
    
    # Execute
    response = await chat_agent.process_message(customer, message)
    
    # Assert
    assert isinstance(response, str)
    assert len(response) > 0
    mock_gemini.generate_content.assert_called_once()
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_process_message_with_empty_message(chat_agent):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    message = ""
    
    # Execute and Assert
    with pytest.raises(ValueError):
        await chat_agent.process_message(customer, message)

@pytest.mark.asyncio
async def test_process_message_with_long_history(chat_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    message = "What's your recommendation?"
    chat_history = [
        ChatHistory(
            id=str(i),
            customer_id=customer.id,
            message=f"Message {i}",
            response=f"Response {i}",
            created_at=f"2024-01-01T00:{i:02d}:00"
        )
        for i in range(20)  # Create 20 history entries
    ]
    mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = chat_history
    mock_gemini.generate_content.return_value.text = "Here's my recommendation..."
    
    # Execute
    response = await chat_agent.process_message(customer, message)
    
    # Assert
    assert isinstance(response, str)
    assert len(response) > 0
    mock_gemini.generate_content.assert_called_once()
    # Verify that only recent history was used in the context
    context = mock_gemini.generate_content.call_args[0][0]
    assert isinstance(context, str)
    assert len(context.split('\n')) <= 10  # Check if context is limited

@pytest.mark.asyncio
async def test_process_message_with_product_query(chat_agent, mock_gemini, mock_db):
    # Setup
    customer = Customer(id="1", name="Test User", preferences={"category": "electronics"})
    message = "Show me gaming laptops under $1000"
    mock_gemini.generate_content.return_value.text = "Here are some gaming laptops within your budget..."
    
    # Execute
    response = await chat_agent.process_message(customer, message)
    
    # Assert
    assert isinstance(response, str)
    assert len(response) > 0
    mock_gemini.generate_content.assert_called_once()
    # Verify that product-related context was included
    context = mock_gemini.generate_content.call_args[0][0]
    assert "gaming laptops" in context.lower()
    assert "$1000" in context 