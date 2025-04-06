from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    subcategory: str
    brand: str
    image_url: str
    rating: float
    stock: int

class ProductCreate(ProductBase):
    pass

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

class ProductResponse(ProductBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True) 