"""
Base agent class for all agents in the SmartCart application.
"""
from typing import Dict, Any
from abc import ABC, abstractmethod
import google.generativeai as genai
from typing import Any, Dict, List
import os
from dotenv import load_dotenv

load_dotenv()

class BaseAgent(ABC):
    """Base class for all agents in the SmartCart application."""
    
    def __init__(self):
        # Initialize Gemini API
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-2.0-flash-001')
        
    @abstractmethod
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the input data and return the result.
        
        Args:
            data: Input data to process
            
        Returns:
            Processed result
        """
        pass
    
    @abstractmethod
    async def explain(self, data: Dict[str, Any]) -> str:
        """
        Generate an explanation for the given data.
        
        Args:
            data: Data to explain
            
        Returns:
            Generated explanation
        """
        pass
    
    async def generate_response(self, prompt: str) -> str:
        """Generate a response using Gemini API"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I'm having trouble generating a response at the moment."
    
    def format_data(self, data: Dict[str, Any]) -> str:
        """Format data into a string for the LLM"""
        return str(data) 