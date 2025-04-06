from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ChatMessageBase(BaseModel):
    message: str
    sender: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: int
    response: str
    timestamp: datetime
    metadata: Optional[dict] = None
    
    model_config = ConfigDict(from_attributes=True) 