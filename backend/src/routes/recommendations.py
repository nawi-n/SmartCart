from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.schemas.recommendation import RecommendationResponse
from src.services.recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()

@router.get("/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(
    customer_id: str,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """Get personalized product recommendations for a customer."""
    try:
        recommendations = await recommendation_service.generate_recommendations(
            customer_id=customer_id,
            limit=limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/{product_id}/explanation", response_model=str)
async def get_recommendation_explanation(
    product_id: str,
    customer_id: str,
    db: Session = Depends(get_db)
):
    """Get an explanation for why a product is recommended to a customer."""
    try:
        explanation = await recommendation_service.explain_recommendation(
            customer_id=customer_id,
            product_id=product_id
        )
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 