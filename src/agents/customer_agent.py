from .base_agent import BaseAgent
from typing import Dict, Any
import json

class CustomerAgent(BaseAgent):
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process customer data and generate/update persona"""
        # Generate or update customer persona
        persona = await self.generate_persona(data)
        
        # Store the persona in the data
        data['persona'] = persona
        
        return data
    
    async def generate_persona(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a detailed customer persona using Gemini"""
        prompt = f"""
        Based on the following customer data, generate a detailed customer persona:
        
        Customer Data:
        {self.format_data(customer_data)}
        
        Please provide a JSON response with the following structure:
        {{
            "demographics": {{
                "age_group": "string",
                "customer_segment": "string",
                "location_insights": "string",
                "spending_habits": {{
                    "avg_order_value": float,
                    "purchase_frequency": "string",
                    "price_sensitivity": "string"
                }}
            }},
            "behavioral_patterns": {{
                "browsing_preferences": ["string"],
                "purchase_history_analysis": ["string"],
                "seasonal_behavior": ["string"],
                "holiday_shopping_patterns": ["string"]
            }},
            "psychographics": {{
                "personality_traits": ["string"],
                "shopping_motivations": ["string"],
                "decision_factors": ["string"],
                "brand_preferences": ["string"]
            }},
            "recommendation_preferences": {{
                "preferred_categories": ["string"],
                "price_range_preference": "string",
                "brand_preferences": ["string"],
                "seasonal_preferences": ["string"]
            }}
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "demographics": {
                    "age_group": "unknown",
                    "customer_segment": "unknown",
                    "location_insights": "unknown",
                    "spending_habits": {
                        "avg_order_value": 0.0,
                        "purchase_frequency": "unknown",
                        "price_sensitivity": "unknown"
                    }
                },
                "behavioral_patterns": {
                    "browsing_preferences": [],
                    "purchase_history_analysis": [],
                    "seasonal_behavior": [],
                    "holiday_shopping_patterns": []
                },
                "psychographics": {
                    "personality_traits": [],
                    "shopping_motivations": [],
                    "decision_factors": [],
                    "brand_preferences": []
                },
                "recommendation_preferences": {
                    "preferred_categories": [],
                    "price_range_preference": "unknown",
                    "brand_preferences": [],
                    "seasonal_preferences": []
                }
            }
    
    async def update_persona(self, current_persona: Dict[str, Any], new_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing persona with new data"""
        prompt = f"""
        Update the following customer persona with new data, considering seasonal and holiday patterns:
        
        Current Persona:
        {self.format_data(current_persona)}
        
        New Data:
        {self.format_data(new_data)}
        
        Please provide an updated persona that incorporates:
        1. Seasonal shopping patterns
        2. Holiday-specific preferences
        3. Updated spending habits
        4. Recent behavioral changes
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return current_persona
    
    async def analyze_seasonal_behavior(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze customer's seasonal shopping patterns"""
        prompt = f"""
        Analyze the seasonal shopping behavior for this customer:
        
        Customer Data:
        {self.format_data(customer_data)}
        
        Please provide a JSON response with the following structure:
        {{
            "seasonal_patterns": {{
                "spring": ["string"],
                "summer": ["string"],
                "fall": ["string"],
                "winter": ["string"]
            }},
            "holiday_preferences": {{
                "holiday_name": {{
                    "preferred_categories": ["string"],
                    "spending_pattern": "string",
                    "gift_preferences": ["string"]
                }}
            }},
            "seasonal_recommendations": {{
                "current_season": "string",
                "recommended_categories": ["string"],
                "price_range_suggestions": "string"
            }}
        }}
        """
        
        response = await self.generate_response(prompt)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "seasonal_patterns": {
                    "spring": [],
                    "summer": [],
                    "fall": [],
                    "winter": []
                },
                "holiday_preferences": {},
                "seasonal_recommendations": {
                    "current_season": "unknown",
                    "recommended_categories": [],
                    "price_range_suggestions": "unknown"
                }
            } 