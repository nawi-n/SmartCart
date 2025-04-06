from typing import Optional
import google.generativeai as genai
from ..config import settings

class ChatService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

    async def process_message(self, customer_id: str, message: str) -> str:
        if not self.model:
            return "Chat service is not configured. Please set GEMINI_API_KEY in your environment variables."

        try:
            # Prepare the prompt with context
            prompt = f"""
            You are a helpful shopping assistant. A customer with ID {customer_id} has sent the following message:
            {message}
            
            Please provide a helpful and friendly response that assists with their shopping needs.
            """

            # Generate response
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            return f"Error processing message: {str(e)}" 