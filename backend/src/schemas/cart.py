from pydantic import BaseModel
from typing import List, Optional
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: int
    product: ProductResponse
    
    class Config:
        orm_mode = True

class CartResponse(BaseModel):
    id: int
    items: List[CartItemResponse]
    
    class Config:
        orm_mode = True 