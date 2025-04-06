from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..database.models import ChatHistory, Customer
from ..schemas.chat import ChatMessageCreate, ChatMessageResponse
from ..routes.auth import get_current_user
from ..services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat/messages/", response_model=ChatMessageResponse)
async def send_message(
    message: ChatMessageCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get customer
    customer = db.query(Customer).filter(Customer.id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Process message and get response
    response = await chat_service.process_message(
        customer_id=customer.id,
        message=message.message
    )
    
    # Save chat history
    chat_history = ChatHistory(
        customer_id=customer.id,
        message=message.message,
        response=response
    )
    db.add(chat_history)
    db.commit()
    db.refresh(chat_history)
    
    return chat_history

@router.get("/chat/history/", response_model=List[ChatMessageResponse])
async def get_chat_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_history = db.query(ChatHistory).filter(
        ChatHistory.customer_id == current_user.id
    ).order_by(ChatHistory.created_at.desc()).all()
    
    return chat_history

@router.delete("/chat/history/")
async def clear_chat_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(ChatHistory).filter(
        ChatHistory.customer_id == current_user.id
    ).delete()
    db.commit()
    
    return {"message": "Chat history cleared successfully"} 