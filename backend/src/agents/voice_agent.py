"""
Voice agent for handling voice interactions.
"""
from .base_agent import BaseAgent
from typing import Dict, Any, Optional
import google.generativeai as genai
import speech_recognition as sr
import pyttsx3
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class VoiceAgent(BaseAgent):
    """Agent responsible for voice interactions."""
    
    def __init__(self, api_key: str):
        super().__init__()
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        
        # Configure voice settings
        self.engine.setProperty('rate', 150)  # Speed of speech
        self.engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)
    
    async def process_voice_input(self, audio_data: bytes) -> Dict[str, Any]:
        """
        Process voice input and generate response.
        
        Args:
            audio_data: Raw audio data in bytes
            
        Returns:
            Dictionary containing the response
        """
        try:
            # Convert audio to text
            text = await self._speech_to_text(audio_data)
            
            # Process with Gemini
            response = await self._generate_response(text)
            
            # Convert response to speech
            audio_response = await self._text_to_speech(response)
            
            return {
                "status": "success",
                "text": text,
                "response": response,
                "audio_response": audio_response
            }
        except Exception as e:
            logger.error(f"Error processing voice input: {str(e)}")
            raise
    
    async def _speech_to_text(self, audio_data: bytes) -> str:
        """Convert speech to text using Google Speech Recognition"""
        try:
            with sr.AudioData(audio_data, sample_rate=16000, sample_width=2) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return text
        except sr.UnknownValueError:
            raise ValueError("Could not understand audio")
        except sr.RequestError as e:
            raise ConnectionError(f"Could not request results; {str(e)}")
    
    async def _generate_response(self, text: str) -> str:
        """Generate response using Gemini"""
        try:
            prompt = f"""
            You are a helpful shopping assistant. Respond to the following query:
            
            User: {text}
            
            Provide a helpful, concise response that:
            1. Answers the user's question
            2. Suggests relevant products if appropriate
            3. Maintains a friendly, conversational tone
            """
            
            response = await self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise
    
    async def _text_to_speech(self, text: str) -> bytes:
        """Convert text to speech"""
        try:
            # Save speech to temporary file
            temp_file = "temp_response.wav"
            self.engine.save_to_file(text, temp_file)
            self.engine.runAndWait()
            
            # Read the file and return bytes
            with open(temp_file, 'rb') as f:
                audio_data = f.read()
            
            return audio_data
        except Exception as e:
            logger.error(f"Error converting text to speech: {str(e)}")
            raise
    
    async def handle_product_query(self, text: str, product_data: Dict[str, Any]) -> str:
        """Handle product-specific queries"""
        try:
            prompt = f"""
            You are a product expert. Answer questions about this product:
            
            Product: {product_data['name']}
            Description: {product_data['description']}
            Features: {product_data['features']}
            
            User Query: {text}
            
            Provide a detailed, accurate response that:
            1. Directly answers the user's question
            2. Highlights relevant product features
            3. Compares with similar products if appropriate
            4. Maintains a professional, informative tone
            """
            
            response = await self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error handling product query: {str(e)}")
            raise
    
    async def handle_recommendation_query(self, text: str, customer_data: Dict[str, Any]) -> str:
        """Handle recommendation-related queries"""
        try:
            prompt = f"""
            You are a shopping assistant. Help the customer with their request:
            
            Customer Profile:
            {customer_data}
            
            User Query: {text}
            
            Provide a helpful response that:
            1. Understands the customer's needs
            2. Suggests relevant products
            3. Explains why the recommendations are suitable
            4. Maintains a friendly, helpful tone
            """
            
            response = await self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error handling recommendation query: {str(e)}")
            raise 