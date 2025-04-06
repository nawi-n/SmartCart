from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    story: Optional[str] = None
    product_metadata: Optional[dict] = None
    average_rating_similar_products: Optional[float] = None
    product_rating: Optional[float] = None
    customer_review_sentiment_score: Optional[float] = None
    holiday: Optional[str] = None
    season: Optional[str] = None
    geographical_location: Optional[str] = None
    similar_product_list: Optional[dict] = None
    probability_of_recommendation: Optional[float] = None

class ProductCreate(ProductBase):
    product_id: str  # Add this since it's required in the database

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    story: Optional[str] = None
    product_metadata: Optional[dict] = None
    average_rating_similar_products: Optional[float] = None
    product_rating: Optional[float] = None
    customer_review_sentiment_score: Optional[float] = None
    holiday: Optional[str] = None
    season: Optional[str] = None
    geographical_location: Optional[str] = None
    similar_product_list: Optional[dict] = None
    probability_of_recommendation: Optional[float] = None

class ProductResponse(ProductBase):
    id: int  # Primary key from SQLAlchemy
    product_id: str  # Unique identifier from SQLAlchemy
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,  # This replaces orm_mode=True in Pydantic v2
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    ) 