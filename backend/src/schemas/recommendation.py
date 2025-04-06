from pydantic import BaseModel, ConfigDict
from typing import Optional

class RecommendationBase(BaseModel):
    product_id: str
    match_score: float
    explanation: str

class RecommendationCreate(RecommendationBase):
    customer_id: str

class RecommendationUpdate(BaseModel):
    match_score: Optional[float] = None
    explanation: Optional[str] = None
    feedback: Optional[dict] = None

class RecommendationResponse(RecommendationBase):
    id: int
    customer_id: str
    feedback: Optional[dict] = None
    created_at: str
    
    model_config = ConfigDict(from_attributes=True) 