import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.agents.voice_search_agent import VoiceSearchAgent
from src.models.product import Product

@pytest.fixture
def mock_whisper():
    with patch('src.agents.voice_search_agent.whisper') as mock:
        mock.load_model = MagicMock()
        mock.transcribe = MagicMock()
        yield mock

@pytest.fixture
def mock_gemini():
    with patch('src.agents.voice_search_agent.genai.GenerativeModel') as mock:
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
def voice_search_agent(mock_whisper, mock_gemini, mock_db):
    return VoiceSearchAgent(api_key="test_key", db=mock_db)

@pytest.mark.asyncio
async def test_transcribe_audio(voice_search_agent, mock_whisper):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": "show me gaming laptops"}
    
    # Execute
    text = await voice_search_agent._transcribe_audio(audio_data)
    
    # Assert
    assert isinstance(text, str)
    assert text == "show me gaming laptops"
    mock_whisper.transcribe.assert_called_once()

@pytest.mark.asyncio
async def test_extract_search_params(voice_search_agent, mock_gemini):
    # Setup
    text = "show me gaming laptops under $1000"
    mock_gemini.generate_content.return_value.text = '{"category": "laptops", "price_range": "under_1000", "tags": ["gaming"]}'
    
    # Execute
    params = await voice_search_agent._extract_search_params(text)
    
    # Assert
    assert isinstance(params, dict)
    assert "category" in params
    assert "price_range" in params
    assert "tags" in params
    mock_gemini.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_search_products(voice_search_agent, mock_db):
    # Setup
    search_params = {
        "category": "laptops",
        "price_range": "under_1000",
        "tags": ["gaming"]
    }
    products = [
        Product(id="1", name="Gaming Laptop 1", category="laptops", price=999.99),
        Product(id="2", name="Gaming Laptop 2", category="laptops", price=899.99)
    ]
    mock_db.query.return_value.filter.return_value.all.return_value = products
    
    # Execute
    results = await voice_search_agent._search_products(search_params)
    
    # Assert
    assert isinstance(results, list)
    assert len(results) == 2
    assert all(isinstance(product, Product) for product in results)

@pytest.mark.asyncio
async def test_process_voice_search(voice_search_agent, mock_whisper, mock_gemini, mock_db):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": "show me gaming laptops under $1000"}
    mock_gemini.generate_content.return_value.text = '{"category": "laptops", "price_range": "under_1000", "tags": ["gaming"]}'
    products = [
        Product(id="1", name="Gaming Laptop 1", category="laptops", price=999.99),
        Product(id="2", name="Gaming Laptop 2", category="laptops", price=899.99)
    ]
    mock_db.query.return_value.filter.return_value.all.return_value = products
    
    # Execute
    results = await voice_search_agent.process(audio_data)
    
    # Assert
    assert isinstance(results, dict)
    assert "transcription" in results
    assert "products" in results
    assert len(results["products"]) == 2
    mock_whisper.transcribe.assert_called_once()
    mock_gemini.generate_content.assert_called_once()

@pytest.mark.asyncio
async def test_process_with_empty_audio(voice_search_agent):
    # Setup
    audio_data = b""
    
    # Execute and Assert
    with pytest.raises(ValueError):
        await voice_search_agent.process(audio_data)

@pytest.mark.asyncio
async def test_process_with_no_speech(voice_search_agent, mock_whisper):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": ""}
    
    # Execute and Assert
    with pytest.raises(ValueError):
        await voice_search_agent.process(audio_data)

@pytest.mark.asyncio
async def test_process_with_no_search_params(voice_search_agent, mock_whisper, mock_gemini):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": "hello world"}
    mock_gemini.generate_content.return_value.text = '{}'
    
    # Execute
    results = await voice_search_agent.process(audio_data)
    
    # Assert
    assert isinstance(results, dict)
    assert "transcription" in results
    assert "products" in results
    assert len(results["products"]) == 0

@pytest.mark.asyncio
async def test_process_with_invalid_search_params(voice_search_agent, mock_whisper, mock_gemini):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": "show me products"}
    mock_gemini.generate_content.return_value.text = 'invalid json'
    
    # Execute and Assert
    with pytest.raises(ValueError):
        await voice_search_agent.process(audio_data)

@pytest.mark.asyncio
async def test_process_with_specific_product_query(voice_search_agent, mock_whisper, mock_gemini, mock_db):
    # Setup
    audio_data = b"test audio data"
    mock_whisper.transcribe.return_value = {"text": "show me the MacBook Pro"}
    mock_gemini.generate_content.return_value.text = '{"category": "laptops", "brand": "Apple", "model": "MacBook Pro"}'
    products = [
        Product(id="1", name="MacBook Pro", category="laptops", brand="Apple", price=1299.99)
    ]
    mock_db.query.return_value.filter.return_value.all.return_value = products
    
    # Execute
    results = await voice_search_agent.process(audio_data)
    
    # Assert
    assert isinstance(results, dict)
    assert "transcription" in results
    assert "products" in results
    assert len(results["products"]) == 1
    assert results["products"][0].name == "MacBook Pro" 