from .base_agent import BaseAgent
from typing import Dict, Any, List
import json

class RecommendationAgent(BaseAgent):
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process recommendation request and generate personalized suggestions"""
        customer_data = data.get('customer_data', {})
        product_data = data.get('product_data', {})
        
        # Generate recommendations
        recommendations = await self.generate_recommendations(customer_data, product_data)
        
        return {
            'customer_id': customer_data.get('customer_id'),
            'recommendations': recommendations
        }
    
    async def generate_recommendations(self, customer_data: Dict[str, Any], product_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate personalized product recommendations"""
        prompt = f"""
        Based on the following customer and product data, generate personalized recommendations:
        
        Customer Data:
        {self.format_data(customer_data)}
        
        Product Data:
        {self.format_data(product_data)}
        
        Please provide a JSON response with an array of recommendations, each with the following structure:
        [
            {{
                "product_id": "string",
                "match_score": float,
                "explanation": "string",
                "key_benefits": ["string"],
                "potential_concerns": ["string"],
                "personalization_factors": ["string"],
                "seasonal_relevance": "string",
                "geographical_relevance": "string",
                "price_sensitivity_match": "string",
                "brand_preference_match": "string",
                "sentiment_analysis": {{
                    "overall_sentiment": "string",
                    "key_positive_aspects": ["string"],
                    "key_negative_aspects": ["string"]
                }},
                "similar_products_analysis": {{
                    "average_rating": float,
                    "common_features": ["string"],
                    "differentiating_factors": ["string"]
                }}
            }}
        ]
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return []
    
    async def explain_recommendation(self, recommendation: Dict[str, Any]) -> str:
        """Generate a detailed explanation for a specific recommendation"""
        prompt = f"""
        Explain why this product would be a good match for the customer:
        
        Recommendation:
        {self.format_data(recommendation)}
        
        Provide a detailed, conversational explanation that highlights:
        1. Key matching factors and personalization
        2. Seasonal and geographical relevance
        3. Price sensitivity and brand preference alignment
        4. Customer sentiment and similar products analysis
        5. Specific benefits and potential considerations
        """
        
        return await self.generate_response(prompt)
    
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