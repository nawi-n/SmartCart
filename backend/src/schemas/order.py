from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .product import ProductResponse

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemResponse(OrderItemBase):
    id: int
    product: ProductResponse
    
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        orm_mode = True 