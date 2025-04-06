import pytest
from unittest.mock import AsyncMock, patch
from typing import Dict, Any
import json
import unittest
from unittest.mock import Mock
from src.agents.customer_agent import CustomerAgent
from src.agents.recommendation_agent import RecommendationAgent
from src.agents.product_agent import ProductAgent
from src.agents.voice_agent import VoiceAgent
from src.database.models import Customer, Product, CustomerPersona, CustomerBehavior
from sqlalchemy.orm import Session

from src.agents.customer_agent import CustomerAgent
from src.agents.product_agent import ProductAgent
from src.agents.recommendation_agent import RecommendationAgent
from src.agents.chat_agent import ChatAgent
from src.services.gemini_service import GeminiService

@pytest.fixture
def mock_gemini():
    """Create a mock Gemini service."""
    gemini = AsyncMock(spec=GeminiService)
    gemini.generate_content.return_value = json.dumps({
        "psychographic_traits": ["adventurous", "tech-savvy"],
        "behavioral_patterns": ["early_adopter", "brand_loyal"],
        "interests": ["technology", "gaming"]
    })
    return gemini

@pytest.fixture
def mock_db_session():
    """Create a mock database session."""
    session = AsyncMock()
    return session

@pytest.mark.asyncio
async def test_customer_agent(mock_gemini, mock_db_session):
    """Test customer agent functionality."""
    agent = CustomerAgent(mock_db_session, mock_gemini)
    
    # Test persona generation
    customer_data = {
        "name": "Test Customer",
        "email": "test@example.com",
        "age": 30,
        "gender": "male"
    }
    persona = await agent.generate_persona(customer_data)
    assert "psychographic_traits" in persona
    assert "behavioral_patterns" in persona
    assert "interests" in persona
    
    # Test behavior analysis
    behavior_data = {
        "viewed_products": ["product1", "product2"],
        "time_spent": 300,
        "search_history": ["query1", "query2"]
    }
    analysis = await agent.analyze_behavior_patterns(behavior_data)
    assert "trends" in analysis
    assert "insights" in analysis

@pytest.mark.asyncio
async def test_product_agent(mock_gemini, mock_db_session):
    """Test product agent functionality."""
    agent = ProductAgent(mock_gemini)
    
    # Test product profile generation
    product_data = {
        "name": "Test Product",
        "brand": "Test Brand",
        "category": "electronics",
        "description": "Test description"
    }
    profile = await agent.generate_profile(product_data)
    assert "unique_selling_points" in profile
    assert "target_audience" in profile
    assert "psychographic_appeal" in profile
    
    # Test story generation
    story = await agent.generate_story(product_data)
    assert isinstance(story, str)
    assert len(story) > 0

@pytest.mark.asyncio
async def test_recommendation_agent(mock_gemini, mock_db_session):
    """Test recommendation agent functionality."""
    agent = RecommendationAgent(mock_gemini)
    
    # Test recommendation generation
    customer_context = {
        "persona": {
            "psychographic_traits": ["adventurous", "tech-savvy"],
            "interests": ["technology", "gaming"]
        },
        "current_mood": "excited",
        "recent_behavior": {
            "viewed_products": ["product1", "product2"],
            "search_history": ["gaming laptop", "wireless headphones"]
        }
    }
    
    products = [
        {
            "id": "1",
            "name": "Gaming Laptop",
            "category": "electronics",
            "price": 999.99,
            "features": ["high-performance", "gaming-optimized"],
            "mood_tags": ["excited", "focused"]
        },
        {
            "id": "2",
            "name": "Wireless Headphones",
            "category": "electronics",
            "price": 199.99,
            "features": ["noise-cancelling", "long-battery"],
            "mood_tags": ["relaxed", "focused"]
        }
    ]
    
    recommendations = await agent.generate_recommendations(
        customer_context,
        products
    )
    
    assert len(recommendations) > 0
    for rec in recommendations:
        assert "product_id" in rec
        assert "match_score" in rec
        assert "explanation" in rec

@pytest.mark.asyncio
async def test_chat_agent(mock_gemini, mock_db_session):
    """Test chat agent functionality."""
    agent = ChatAgent(mock_gemini)
    
    # Test chat response generation
    message = "What are your best recommendations for gaming laptops?"
    context = {
        "customer_persona": {
            "psychographic_traits": ["tech-savvy", "gamer"],
            "interests": ["gaming", "technology"]
        },
        "current_mood": "excited",
        "available_products": [
            {
                "id": "1",
                "name": "Gaming Laptop",
                "category": "electronics",
                "price": 999.99
            }
        ]
    }
    
    response = await agent.generate_response(message, context)
    assert "response" in response
    assert "recommendations" in response
    assert len(response["recommendations"]) > 0

@pytest.mark.asyncio
async def test_agent_interaction(mock_gemini, mock_db_session):
    """Test interaction between different agents."""
    # Initialize agents
    customer_agent = CustomerAgent(mock_db_session, mock_gemini)
    product_agent = ProductAgent(mock_gemini)
    recommendation_agent = RecommendationAgent(mock_gemini)
    chat_agent = ChatAgent(mock_gemini)
    
    # Create customer and generate persona
    customer_data = {
        "name": "Test Customer",
        "email": "test@example.com",
        "age": 30,
        "gender": "male"
    }
    persona = await customer_agent.generate_persona(customer_data)
    
    # Track customer behavior
    behavior_data = {
        "viewed_products": ["product1", "product2"],
        "time_spent": 300,
        "search_history": ["gaming laptop", "wireless headphones"]
    }
    await customer_agent.track_behavior(customer_data["email"], behavior_data)
    
    # Generate product profiles
    products = [
        {
            "id": "1",
            "name": "Gaming Laptop",
            "category": "electronics",
            "price": 999.99
        },
        {
            "id": "2",
            "name": "Wireless Headphones",
            "category": "electronics",
            "price": 199.99
        }
    ]
    
    product_profiles = []
    for product in products:
        profile = await product_agent.generate_profile(product)
        product_profiles.append(profile)
    
    # Generate recommendations
    recommendations = await recommendation_agent.generate_recommendations(
        {
            "persona": persona,
            "current_mood": "excited",
            "recent_behavior": behavior_data
        },
        product_profiles
    )
    
    # Test chat interaction
    message = "What gaming laptops do you recommend?"
    chat_response = await chat_agent.generate_response(
        message,
        {
            "customer_persona": persona,
            "current_mood": "excited",
            "available_products": product_profiles,
            "recommendations": recommendations
        }
    )
    
    assert "response" in chat_response
    assert "recommendations" in chat_response
    assert len(chat_response["recommendations"]) > 0

class TestCustomerAgent(unittest.TestCase):
    def setUp(self):
        self.db = Mock(spec=Session)
        self.gemini_service = Mock()
        self.agent = CustomerAgent(self.db, self.gemini_service)
        
    def test_generate_persona(self):
        # Test data
        customer_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30,
            "gender": "male"
        }
        
        # Mock Gemini response
        self.gemini_service.generate_content.return_value = Mock(text='{"demographics": {"age_group": "30-40"}}')
        
        # Test
        persona = self.agent.generate_persona(customer_data)
        
        # Assertions
        self.assertIsInstance(persona, dict)
        self.assertIn("demographics", persona)
        self.gemini_service.generate_content.assert_called_once()
        
    def test_update_persona(self):
        # Test data
        current_persona = {"demographics": {"age_group": "30-40"}}
        new_data = {"purchase_history": ["product1", "product2"]}
        
        # Mock Gemini response
        self.gemini_service.generate_content.return_value = Mock(text='{"demographics": {"age_group": "30-40"}, "purchase_history": ["product1", "product2"]}')
        
        # Test
        updated_persona = self.agent.update_persona(current_persona, new_data)
        
        # Assertions
        self.assertIsInstance(updated_persona, dict)
        self.assertIn("purchase_history", updated_persona)
        self.gemini_service.generate_content.assert_called_once()

class TestRecommendationAgent(unittest.TestCase):
    def setUp(self):
        self.agent = RecommendationAgent("test_api_key")
        
    def test_calculate_match_score(self):
        # Test data
        customer = Mock(spec=Customer)
        product = Mock(spec=Product)
        recent_mood = Mock()
        
        # Mock Gemini response
        with patch.object(self.agent.model, 'generate_content') as mock_generate:
            mock_generate.return_value = Mock(text='0.8')
            
            # Test
            score = self.agent._calculate_match_score(customer, product, recent_mood)
            
            # Assertions
            self.assertIsInstance(score, float)
            self.assertGreaterEqual(score, 0)
            self.assertLessEqual(score, 1)
            mock_generate.assert_called_once()
            
    def test_generate_explanation(self):
        # Test data
        customer = Mock(spec=Customer)
        product = Mock(spec=Product)
        match_score = 0.8
        recent_mood = Mock()
        
        # Mock Gemini response
        with patch.object(self.agent.model, 'generate_content') as mock_generate:
            mock_generate.return_value = Mock(text='This product matches your preferences perfectly!')
            
            # Test
            explanation = self.agent._generate_explanation(customer, product, match_score, recent_mood)
            
            # Assertions
            self.assertIsInstance(explanation, str)
            self.assertGreater(len(explanation), 0)
            mock_generate.assert_called_once()

class TestProductAgent(unittest.TestCase):
    def setUp(self):
        self.agent = ProductAgent()
        
    def test_generate_profile(self):
        # Test data
        product_data = {
            "name": "Test Product",
            "description": "A test product",
            "price": 99.99
        }
        
        # Mock Gemini response
        with patch.object(self.agent, 'generate_response') as mock_generate:
            mock_generate.return_value = '{"product_attributes": {"category": "test"}}'
            
            # Test
            profile = self.agent.generate_profile(product_data)
            
            # Assertions
            self.assertIsInstance(profile, dict)
            self.assertIn("product_attributes", profile)
            mock_generate.assert_called_once()
            
    def test_match_with_persona(self):
        # Test data
        product_profile = {"category": "test"}
        customer_persona = {"preferences": ["test"]}
        
        # Mock Gemini response
        with patch.object(self.agent, 'generate_response') as mock_generate:
            mock_generate.return_value = '{"compatibility_score": 0.8}'
            
            # Test
            match = self.agent.match_with_persona(product_profile, customer_persona)
            
            # Assertions
            self.assertIsInstance(match, dict)
            self.assertIn("compatibility_score", match)
            mock_generate.assert_called_once()

class TestVoiceAgent(unittest.TestCase):
    def setUp(self):
        self.agent = VoiceAgent("test_api_key")
        
    def test_speech_to_text(self):
        # Test data
        audio_data = b'test_audio_data'
        
        # Mock speech recognition
        with patch.object(self.agent.recognizer, 'recognize_google') as mock_recognize:
            mock_recognize.return_value = "test text"
            
            # Test
            text = self.agent._speech_to_text(audio_data)
            
            # Assertions
            self.assertIsInstance(text, str)
            self.assertEqual(text, "test text")
            mock_recognize.assert_called_once()
            
    def test_text_to_speech(self):
        # Test data
        text = "test text"
        
        # Mock text-to-speech
        with patch.object(self.agent.engine, 'save_to_file') as mock_save:
            with patch.object(self.agent.engine, 'runAndWait') as mock_run:
                # Test
                audio_data = self.agent._text_to_speech(text)
                
                # Assertions
                self.assertIsInstance(audio_data, bytes)
                mock_save.assert_called_once()
                mock_run.assert_called_once()

if __name__ == '__main__':
    unittest.main() 