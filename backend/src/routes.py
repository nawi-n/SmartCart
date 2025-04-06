from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime

from .database import get_db, Customer, Product, CustomerMood
from .agents.customer_agent import CustomerAgent
from .agents.product_agent import ProductAgent
from .agents.recommendation_agent import RecommendationAgent
from .services.gemini_service import GeminiService

router = APIRouter()

# Initialize services
gemini_service = GeminiService()

# Initialize agents with dependencies
def get_customer_agent(db: Session = Depends(get_db)) -> CustomerAgent:
    return CustomerAgent(db=db, gemini_service=gemini_service)

def get_product_agent() -> ProductAgent:
    return ProductAgent()

def get_recommendation_agent() -> RecommendationAgent:
    return RecommendationAgent()

@router.post("/customer/persona")
async def generate_customer_persona(
    customer_data: Dict[str, Any],
    customer_agent: CustomerAgent = Depends(get_customer_agent)
):
    """Generate or update customer persona"""
    try:
        result = await customer_agent.process(customer_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/product/profile")
async def generate_product_profile(
    product_data: Dict[str, Any],
    product_agent: ProductAgent = Depends(get_product_agent)
):
    """Generate or update product profile"""
    try:
        result = await product_agent.process(product_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations")
async def get_recommendations(
    request_data: Dict[str, Any],
    recommendation_agent: RecommendationAgent = Depends(get_recommendation_agent),
    db: Session = Depends(get_db)
):
    """Get personalized product recommendations"""
    try:
        result = await recommendation_agent.process(request_data, db)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/explain")
async def explain_recommendation(
    recommendation: Dict[str, Any],
    recommendation_agent: RecommendationAgent = Depends(get_recommendation_agent)
):
    """Get detailed explanation for a recommendation"""
    try:
        explanation = await recommendation_agent.explain_recommendation(recommendation)
        return {"status": "success", "explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/mood")
async def get_mood_based_recommendations(
    request_data: Dict[str, Any],
    recommendation_agent: RecommendationAgent = Depends(get_recommendation_agent)
):
    """Get mood-based recommendations"""
    try:
        customer_data = request_data.get('customer_data', {})
        mood = request_data.get('mood', 'neutral')
        recommendations = await recommendation_agent.generate_mood_based_recommendations(customer_data, mood)
        return {"status": "success", "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/product/story")
async def get_product_story(
    product_data: Dict[str, Any],
    product_agent: ProductAgent = Depends(get_product_agent)
):
    """Generate engaging product story"""
    try:
        story = await product_agent.generate_product_story(product_data)
        return {"status": "success", "story": story}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/feedback")
async def update_recommendation_feedback(
    request_data: Dict[str, Any],
    recommendation_agent: RecommendationAgent = Depends(get_recommendation_agent)
):
    """Update recommendation based on feedback"""
    try:
        recommendation = request_data.get('recommendation', {})
        feedback = request_data.get('feedback', {})
        updated_recommendation = await recommendation_agent.update_recommendation_feedback(recommendation, feedback)
        return {"status": "success", "updated_recommendation": updated_recommendation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice/search")
async def voice_search(
    request_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Process voice search query and return relevant products"""
    try:
        query = request_data.get('query', '').lower()
        if not query:
            raise HTTPException(status_code=400, detail="Search query is required")

        # Get all products from database
        products = db.query(Product).all()
        
        # Simple keyword matching (in a real app, use proper search engine)
        matched_products = []
        for product in products:
            if (query in product.name.lower() or 
                query in product.category.lower()):
                matched_products.append(product)
        
        return {
            "status": "success",
            "results": matched_products
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mood/track")
async def track_mood(
    request_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Track and update customer's mood"""
    try:
        customer_id = request_data.get('customer_id')
        mood = request_data.get('mood')
        if not customer_id or not mood:
            raise HTTPException(status_code=400, detail="Customer ID and mood are required")

        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        # Create new mood entry
        new_mood = CustomerMood(
            id=f"MOOD_{datetime.utcnow().timestamp()}",
            customer_id=customer_id,
            mood=mood
        )
        db.add(new_mood)
        db.commit()

        return {"status": "success", "message": "Mood tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 