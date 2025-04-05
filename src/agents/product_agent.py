from .base_agent import BaseAgent
from typing import Dict, Any, List
import json

class ProductAgent(BaseAgent):
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process product data and generate detailed profile"""
        # Generate or update product profile
        profile = await self.generate_profile(data)
        
        # Store the profile in the data
        data['profile'] = profile
        
        return data
    
    async def generate_profile(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a detailed product profile using Gemini"""
        prompt = f"""
        Based on the following product data, generate a detailed product profile:
        
        Product Data:
        {self.format_data(product_data)}
        
        Please provide a JSON response with the following structure:
        {{
            "product_attributes": {{
                "category": "string",
                "brand_positioning": "string",
                "price_positioning": "string",
                "quality_indicators": {{
                    "product_rating": float,
                    "similar_products_rating": float,
                    "sentiment_score": float
                }}
            }},
            "market_context": {{
                "geographical_relevance": ["string"],
                "seasonal_relevance": ["string"],
                "holiday_relevance": ["string"],
                "competitive_position": "string"
            }},
            "customer_appeal": {{
                "target_segments": ["string"],
                "value_proposition": ["string"],
                "emotional_triggers": ["string"],
                "practical_benefits": ["string"]
            }},
            "recommendation_metrics": {{
                "probability_score": float,
                "similar_products": ["string"],
                "seasonal_factors": ["string"],
                "holiday_factors": ["string"]
            }}
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "product_attributes": {
                    "category": "unknown",
                    "brand_positioning": "unknown",
                    "price_positioning": "unknown",
                    "quality_indicators": {
                        "product_rating": 0.0,
                        "similar_products_rating": 0.0,
                        "sentiment_score": 0.0
                    }
                },
                "market_context": {
                    "geographical_relevance": [],
                    "seasonal_relevance": [],
                    "holiday_relevance": [],
                    "competitive_position": "unknown"
                },
                "customer_appeal": {
                    "target_segments": [],
                    "value_proposition": [],
                    "emotional_triggers": [],
                    "practical_benefits": []
                },
                "recommendation_metrics": {
                    "probability_score": 0.0,
                    "similar_products": [],
                    "seasonal_factors": [],
                    "holiday_factors": []
                }
            }
    
    async def match_with_persona(self, product_profile: Dict[str, Any], customer_persona: Dict[str, Any]) -> Dict[str, Any]:
        """Generate compatibility analysis between product and customer persona"""
        prompt = f"""
        Analyze the compatibility between this product and customer persona, considering seasonal and geographical factors:
        
        Product Profile:
        {self.format_data(product_profile)}
        
        Customer Persona:
        {self.format_data(customer_persona)}
        
        Please provide a JSON response with the following structure:
        {{
            "compatibility_score": float,
            "match_factors": ["string"],
            "potential_concerns": ["string"],
            "recommendation_strength": "string",
            "seasonal_relevance": "string",
            "geographical_relevance": "string",
            "price_sensitivity_match": "string",
            "brand_preference_match": "string"
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "compatibility_score": 0.0,
                "match_factors": [],
                "potential_concerns": [],
                "recommendation_strength": "unknown",
                "seasonal_relevance": "unknown",
                "geographical_relevance": "unknown",
                "price_sensitivity_match": "unknown",
                "brand_preference_match": "unknown"
            }
    
    async def generate_product_story(self, product_data: Dict[str, Any]) -> str:
        """Generate an engaging product story using Gemini"""
        prompt = f"""
        Create an engaging product story for:
        
        Product Data:
        {self.format_data(product_data)}
        
        The story should:
        1. Highlight key features and benefits
        2. Consider seasonal and holiday relevance
        3. Address geographical preferences
        4. Incorporate customer sentiment and ratings
        5. Connect emotionally with potential customers
        """
        
        return await self.generate_response(prompt)
    
    async def analyze_seasonal_performance(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze product's seasonal performance and trends"""
        prompt = f"""
        Analyze the seasonal performance and trends for this product:
        
        Product Data:
        {self.format_data(product_data)}
        
        Please provide a JSON response with the following structure:
        {{
            "seasonal_performance": {{
                "spring": {{
                    "performance_score": float,
                    "key_factors": ["string"]
                }},
                "summer": {{
                    "performance_score": float,
                    "key_factors": ["string"]
                }},
                "fall": {{
                    "performance_score": float,
                    "key_factors": ["string"]
                }},
                "winter": {{
                    "performance_score": float,
                    "key_factors": ["string"]
                }}
            }},
            "holiday_performance": {{
                "holiday_name": {{
                    "performance_score": float,
                    "recommendation_strength": "string",
                    "target_segments": ["string"]
                }}
            }},
            "geographical_performance": {{
                "location": {{
                    "performance_score": float,
                    "market_fit": "string",
                    "recommendation_strength": "string"
                }}
            }}
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "seasonal_performance": {
                    "spring": {"performance_score": 0.0, "key_factors": []},
                    "summer": {"performance_score": 0.0, "key_factors": []},
                    "fall": {"performance_score": 0.0, "key_factors": []},
                    "winter": {"performance_score": 0.0, "key_factors": []}
                },
                "holiday_performance": {},
                "geographical_performance": {}
            } 