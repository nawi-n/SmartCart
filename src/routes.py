from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import pandas as pd

from .database import get_db
from .agents.customer_agent import CustomerAgent
from .agents.product_agent import ProductAgent
from .agents.recommendation_agent import RecommendationAgent

router = APIRouter()
customer_agent = CustomerAgent()
product_agent = ProductAgent()
recommendation_agent = RecommendationAgent()

@router.post("/customer/persona")
async def generate_customer_persona(customer_data: Dict[str, Any]):
    """Generate or update customer persona"""
    try:
        result = await customer_agent.process(customer_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/product/profile")
async def generate_product_profile(product_data: Dict[str, Any]):
    """Generate or update product profile"""
    try:
        result = await product_agent.process(product_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations")
async def get_recommendations(request_data: Dict[str, Any]):
    """Get personalized product recommendations"""
    try:
        result = await recommendation_agent.process(request_data)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/explain")
async def explain_recommendation(recommendation: Dict[str, Any]):
    """Get detailed explanation for a recommendation"""
    try:
        explanation = await recommendation_agent.explain_recommendation(recommendation)
        return {"status": "success", "explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/mood")
async def get_mood_based_recommendations(request_data: Dict[str, Any]):
    """Get mood-based recommendations"""
    try:
        customer_data = request_data.get('customer_data', {})
        mood = request_data.get('mood', 'neutral')
        recommendations = await recommendation_agent.generate_mood_based_recommendations(customer_data, mood)
        return {"status": "success", "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/product/story")
async def get_product_story(product_data: Dict[str, Any]):
    """Generate engaging product story"""
    try:
        story = await product_agent.generate_product_story(product_data)
        return {"status": "success", "story": story}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations/feedback")
async def update_recommendation_feedback(request_data: Dict[str, Any]):
    """Update recommendation based on feedback"""
    try:
        recommendation = request_data.get('recommendation', {})
        feedback = request_data.get('feedback', {})
        updated_recommendation = await recommendation_agent.update_recommendation_feedback(recommendation, feedback)
        return {"status": "success", "updated_recommendation": updated_recommendation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 