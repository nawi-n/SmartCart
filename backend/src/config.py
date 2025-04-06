from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./smartcart.db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Gemini API
    GEMINI_API_KEY: Optional[str] = None
    
    # Speech Recognition
    SPEECH_RECOGNITION_LANGUAGE: str = "en-US"
    
    class Config:
        env_file = ".env"

settings = Settings() 