from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Mood(str, Enum):
    HAPPY = "Happy"
    NEUTRAL = "Neutral"
    SAD = "Sad"
    EXCITED = "Excited"
    FRUSTRATED = "Frustrated"
    RELAXED = "Relaxed"

class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    
class CustomerCreate(CustomerBase):
    pass

class CustomerPersonaBase(BaseModel):
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = Field(None, max_length=50)
    interests: Optional[List[str]] = Field(default_factory=list)
    psychographic_traits: Optional[Dict[str, Any]] = Field(default_factory=dict)
    behavioral_patterns: Optional[Dict[str, Any]] = Field(default_factory=dict)
    purchase_history: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class CustomerPersonaCreate(CustomerPersonaBase):
    pass

class CustomerBehaviorBase(BaseModel):
    viewed_products: Optional[List[str]] = Field(default_factory=list)
    time_spent: Optional[Dict[str, float]] = Field(default_factory=dict)
    search_history: Optional[List[str]] = Field(default_factory=list)
    category_interests: Optional[Dict[str, float]] = Field(default_factory=dict)

class CustomerBehaviorCreate(CustomerBehaviorBase):
    pass

class CustomerMoodBase(BaseModel):
    mood: Mood
    
class CustomerMoodCreate(CustomerMoodBase):
    pass

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    brand: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None)
    price: Optional[float] = Field(None, ge=0)
    features: Optional[List[str]] = Field(default_factory=list)
    unique_selling_points: Optional[List[str]] = Field(default_factory=list)
    price_point: Optional[str] = Field(None, max_length=50)
    quality_level: Optional[str] = Field(None, max_length=50)
    mood_tags: Optional[List[str]] = Field(default_factory=list)
    story: Optional[str] = Field(None)
    image_url: Optional[str] = Field(None)

class ProductCreate(ProductBase):
    pass

class RecommendationBase(BaseModel):
    product_id: str
    psychographic_match: float = Field(..., ge=0, le=1)
    explanation: str

class RecommendationCreate(RecommendationBase):
    customer_id: str

class ChatMessageBase(BaseModel):
    message: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ChatMessageCreate(ChatMessageBase):
    customer_id: str

class ChatResponse(BaseModel):
    response: str
    recommendations: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class VoiceSearchQuery(BaseModel):
    query: str = Field(..., min_length=1)

class VoiceSearchResponse(BaseModel):
    products: List[Dict[str, Any]]
    explanation: Optional[str] = None 