"""
Recommendation agent for handling product recommendations.
"""
from .base_agent import BaseAgent
from typing import Dict, Any, List
import json
import google.generativeai as genai
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database.schema import Customer, Product, Recommendation, CustomerMood
from ..services.gemini_service import GeminiService
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class RecommendationAgent(BaseAgent):
    """Agent responsible for generating product recommendations."""
    
    def __init__(self, api_key: str):
        super().__init__()
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.gemini_service = GeminiService()
    
    async def process(self, request_data: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """
        Process customer data and generate recommendations.
        
        Args:
            request_data: Dictionary containing customer information
            db: SQLAlchemy session
            
        Returns:
            Dictionary containing the generated recommendations
        """
        try:
            customer_id = request_data.get('customer_id')
            if not customer_id:
                raise ValueError("Customer ID is required")
            
            # Get customer data
            customer = db.query(Customer).filter(Customer.id == customer_id).first()
            if not customer:
                raise ValueError("Customer not found")
            
            # Get recent mood
            recent_mood = db.query(CustomerMood)\
                .filter(CustomerMood.customer_id == customer_id)\
                .order_by(CustomerMood.created_at.desc())\
                .first()
            
            # Get all products
            products = db.query(Product).all()
            
            # Generate recommendations
            recommendations = []
            for product in products:
                match_score = await self._calculate_match_score(customer, product, recent_mood)
                if match_score > 0.5:  # Only include products with good match
                    explanation = await self._generate_explanation(customer, product, match_score, recent_mood)
                    recommendations.append({
                        'product_id': product.id,
                        'psychographic_match': match_score,
                        'explanation': explanation
                    })
            
            # Sort by match score
            recommendations.sort(key=lambda x: x['psychographic_match'], reverse=True)
            
            # Store recommendations
            for rec in recommendations:
                db_rec = Recommendation(
                    customer_id=customer_id,
                    product_id=rec['product_id'],
                    psychographic_match=rec['psychographic_match'],
                    explanation=rec['explanation']
                )
                db.add(db_rec)
            
            db.commit()
            
            return {
                "status": "success",
                "recommendations": recommendations[:10],  # Return top 10
                "mood_considered": recent_mood.mood if recent_mood else None
            }
        except Exception as e:
            logger.error(f"Error processing recommendations: {str(e)}")
            raise
    
    async def _calculate_match_score(
        self,
        customer: Customer,
        product: Product,
        recent_mood: CustomerMood
    ) -> float:
        prompt = f"""
        Calculate a psychographic match score (0-1) between this customer and product.
        
        Customer Persona:
        {customer.persona.psychographic_traits}
        Current Mood: {recent_mood.mood if recent_mood else 'neutral'}
        
        Product:
        Name: {product.name}
        Category: {product.category}
        Mood Tags: {product.mood_tags}
        Price Point: {product.price_point}
        Quality Level: {product.quality_level}
        
        Consider:
        1. Personality alignment
        2. Mood compatibility
        3. Price sensitivity
        4. Quality preferences
        5. Category interests
        
        Return only the score as a float between 0 and 1.
        """
        
        response = await self.model.generate_content(prompt)
        try:
            score = float(response.text.strip())
            return max(0, min(1, score))  # Ensure score is between 0 and 1
        except ValueError:
            return 0.5  # Default score if parsing fails
    
    async def _generate_explanation(
        self,
        customer: Customer,
        product: Product,
        match_score: float,
        recent_mood: CustomerMood
    ) -> str:
        prompt = f"""
        Explain why this product is a good match for this customer.
        
        Customer Persona:
        {customer.persona.psychographic_traits}
        Current Mood: {recent_mood.mood if recent_mood else 'neutral'}
        
        Product:
        Name: {product.name}
        Category: {product.category}
        Mood Tags: {product.mood_tags}
        Price Point: {product.price_point}
        Quality Level: {product.quality_level}
        
        Match Score: {match_score}
        
        Write a concise, friendly explanation (2-3 sentences) highlighting:
        1. Key personality matches
        2. Mood alignment
        3. Why this product suits their preferences
        """
        
        response = await self.model.generate_content(prompt)
        return response.text.strip()
    
    async def explain(self, data: Dict[str, Any]) -> str:
        """
        Generate an explanation for the recommendations.
        
        Args:
            data: Dictionary containing recommendation information
            
        Returns:
            Generated explanation
        """
        try:
            # Generate explanation using Gemini
            explanation = await self.gemini_service.generate_explanation(data)
            return explanation
        except Exception as e:
            logger.error(f"Error generating explanation: {str(e)}")
            raise
    
    async def explain_recommendation(self, recommendation: Dict[str, Any]) -> str:
        prompt = f"""
        Explain this product recommendation in detail.
        
        Recommendation:
        {recommendation}
        
        Write a detailed explanation (3-4 sentences) that:
        1. Explains the psychographic match
        2. Highlights key product features
        3. Connects to customer preferences
        4. Suggests usage scenarios
        """
        
        response = await self.model.generate_content(prompt)
        return response.text.strip()
    
    async def update_recommendation_feedback(self, recommendation: Dict[str, Any], feedback: Dict[str, Any]) -> Dict[str, Any]:
        """Update recommendation based on customer feedback"""
        prompt = f"""
        Update the recommendation based on customer feedback:
        
        Original Recommendation:
        {self.format_data(recommendation)}
        
        Customer Feedback:
        {self.format_data(feedback)}
        
        Please provide an updated recommendation that considers:
        1. Updated match scores and explanations
        2. Adjusted seasonal and geographical relevance
        3. Modified price sensitivity and brand preference matches
        4. Updated sentiment analysis
        5. Revised similar products analysis
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return recommendation
    
    async def generate_mood_based_recommendations(self, customer_data: Dict[str, Any], mood: str) -> List[Dict[str, Any]]:
        """Generate recommendations based on customer's current mood"""
        prompt = f"""
        Generate product recommendations based on the customer's current mood:
        
        Customer Data:
        {self.format_data(customer_data)}
        
        Current Mood: {mood}
        
        Please provide mood-appropriate recommendations that consider:
        1. Emotional state and mood enhancement
        2. Seasonal and geographical context
        3. Price sensitivity and brand preferences
        4. Customer sentiment and similar products
        5. Personalization factors
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return []
    
    async def analyze_recommendation_performance(self, recommendations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze the performance and effectiveness of recommendations"""
        prompt = f"""
        Analyze the performance and effectiveness of these recommendations:
        
        Recommendations:
        {self.format_data(recommendations)}
        
        Please provide a JSON response with the following structure:
        {{
            "overall_performance": {{
                "average_match_score": float,
                "success_rate": float,
                "key_success_factors": ["string"],
                "improvement_areas": ["string"]
            }},
            "seasonal_analysis": {{
                "season": {{
                    "performance_score": float,
                    "recommendation_strength": "string",
                    "key_factors": ["string"]
                }}
            }},
            "geographical_analysis": {{
                "location": {{
                    "performance_score": float,
                    "market_fit": "string",
                    "recommendation_strength": "string"
                }}
            }},
            "customer_segment_analysis": {{
                "segment": {{
                    "performance_score": float,
                    "recommendation_strength": "string",
                    "key_factors": ["string"]
                }}
            }}
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "overall_performance": {
                    "average_match_score": 0.0,
                    "success_rate": 0.0,
                    "key_success_factors": [],
                    "improvement_areas": []
                },
                "seasonal_analysis": {},
                "geographical_analysis": {},
                "customer_segment_analysis": {}
            }

    async def generate_recommendations(self, customer_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate product recommendations based on customer data.
        
        Args:
            customer_data: Dictionary containing customer information
            
        Returns:
            List of recommendation dictionaries
        """
        try:
            # In a real implementation, this would:
            # 1. Get customer persona
            # 2. Get available products
            # 3. Calculate match scores
            # 4. Generate explanations
            # 5. Return top recommendations
            
            # For now, return a mock recommendation
            return [{
                "product_id": "PROD001",
                "score": 0.95,
                "explanation": "This product matches your preferences perfectly!"
            }]
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise 