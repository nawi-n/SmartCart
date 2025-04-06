"""
Service for interacting with Google's Gemini API.
"""
import os
from typing import Dict, Any, List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiService:
    def __init__(self):
        """Initialize the Gemini service with API key from environment variables."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_text(self, prompt: str) -> str:
        """
        Generate text using Gemini API.
        
        Args:
            prompt: The prompt to send to the model
            
        Returns:
            Generated text response
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error generating text with Gemini: {str(e)}")
    
    async def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """
        Analyze sentiment of text using Gemini API.
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment scores
        """
        prompt = f"""
        Analyze the sentiment of the following text and return a JSON object with scores for:
        - happiness (0-1)
        - sadness (0-1)
        - anger (0-1)
        - surprise (0-1)
        - fear (0-1)
        
        Text: {text}
        
        Return only the JSON object, nothing else.
        """
        
        try:
            response = await self.generate_text(prompt)
            # Parse the response as JSON
            import json
            return json.loads(response)
        except Exception as e:
            raise Exception(f"Error analyzing sentiment: {str(e)}")
    
    async def generate_explanation(self, data: Dict[str, Any]) -> str:
        """
        Generate an explanation for a recommendation or decision.
        
        Args:
            data: Dictionary containing the data to explain
            
        Returns:
            Generated explanation
        """
        prompt = f"""
        Generate a clear and concise explanation for the following data:
        {data}
        
        The explanation should be:
        - Easy to understand
        - Focus on key points
        - Be persuasive but honest
        - Use natural language
        """
        
        try:
            return await self.generate_text(prompt)
        except Exception as e:
            raise Exception(f"Error generating explanation: {str(e)}")
    
    async def generate_persona(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a customer persona based on customer data.
        
        Args:
            customer_data: Dictionary containing customer information
            
        Returns:
            Generated persona as a dictionary
        """
        prompt = f"""
        Generate a detailed customer persona based on the following data:
        {customer_data}
        
        Return a JSON object with the following structure:
        {{
            "demographics": {{
                "age_range": "string",
                "gender": "string",
                "location": "string"
            }},
            "preferences": {{
                "categories": ["string"],
                "price_range": "string",
                "brand_preferences": ["string"]
            }},
            "behavior": {{
                "shopping_frequency": "string",
                "preferred_time": "string",
                "device_preference": "string"
            }},
            "personality": {{
                "traits": ["string"],
                "values": ["string"]
            }}
        }}
        
        Return only the JSON object, nothing else.
        """
        
        try:
            response = await self.generate_text(prompt)
            import json
            return json.loads(response)
        except Exception as e:
            raise Exception(f"Error generating persona: {str(e)}")
    
    async def generate_product_story(self, product_data: Dict[str, Any]) -> str:
        """
        Generate an engaging product story.
        
        Args:
            product_data: Dictionary containing product information
            
        Returns:
            Generated product story
        """
        prompt = f"""
        Generate an engaging and persuasive product story for the following product:
        {product_data}
        
        The story should:
        - Be compelling and memorable
        - Highlight unique features
        - Connect with the target audience
        - Be concise (max 200 words)
        - Use storytelling techniques
        """
        
        try:
            return await self.generate_text(prompt)
        except Exception as e:
            raise Exception(f"Error generating product story: {str(e)}") 