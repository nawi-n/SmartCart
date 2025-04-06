from .base_agent import BaseAgent
from typing import Dict, Any
import json
from sqlalchemy.orm import Session
from ..database.models import CustomerPersona, CustomerBehavior
from ..services.gemini_service import GeminiService
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class CustomerAgent(BaseAgent):
    """Agent responsible for customer-related operations."""
    
    def __init__(self, db: Session, gemini_service: GeminiService):
        super().__init__()
        self.db = db
        self.gemini_service = gemini_service

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process customer data and generate/update persona.
        
        Args:
            data: Dictionary containing customer information
            
        Returns:
            Dictionary containing the generated/updated persona
        """
        try:
            # Generate persona using Gemini
            persona = await self.generate_persona(data)
            
            # Store persona in database
            # Note: In a real implementation, you would use a database session
            # and handle the actual storage of the persona
            
            return {
                "status": "success",
                "persona": persona
            }
        except Exception as e:
            logger.error(f"Error processing customer data: {str(e)}")
            raise
    
    async def explain(self, data: Dict[str, Any]) -> str:
        """
        Generate an explanation for the customer persona.
        
        Args:
            data: Dictionary containing customer information
            
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
    
    async def update_behavior(self, customer_id: str, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update customer behavior based on their actions.
        
        Args:
            customer_id: ID of the customer
            behavior_data: Dictionary containing behavior information
            
        Returns:
            Dictionary containing the updated behavior
        """
        try:
            # Store behavior in database
            # Note: In a real implementation, you would use a database session
            # and handle the actual storage of the behavior
            
            return {
                "status": "success",
                "message": "Behavior updated successfully"
            }
        except Exception as e:
            logger.error(f"Error updating behavior: {str(e)}")
            raise
    
    async def get_persona(self, customer_id: str) -> Dict[str, Any]:
        """
        Get customer persona.
        
        Args:
            customer_id: ID of the customer
            
        Returns:
            Dictionary containing the customer's persona
        """
        try:
            # Get persona from database
            # Note: In a real implementation, you would use a database session
            # and handle the actual retrieval of the persona
            
            return {
                "status": "success",
                "persona": {
                    "demographics": {},
                    "preferences": {},
                    "behavior": {},
                    "personality": {}
                }
            }
        except Exception as e:
            logger.error(f"Error getting persona: {str(e)}")
            raise
    
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

    async def update_persona_from_behavior(self, customer_id: str, behavior: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update customer persona based on behavior patterns
        """
        try:
            # Get current persona
            persona = self.db.query(CustomerPersona).filter(
                CustomerPersona.customer_id == customer_id
            ).first()

            if not persona:
                logger.error(f"No persona found for customer {customer_id}")
                return None

            # Get recent behaviors
            recent_behaviors = self.db.query(CustomerBehavior).filter(
                CustomerBehavior.customer_id == customer_id
            ).order_by(CustomerBehavior.created_at.desc()).limit(10).all()

            # Prepare behavior context
            behavior_context = {
                "current_persona": persona.to_dict(),
                "recent_behaviors": [b.to_dict() for b in recent_behaviors],
                "new_behavior": behavior
            }

            # Generate updated persona using Gemini
            prompt = f"""
            Based on the following customer behavior data, update the customer persona:
            Current Persona: {behavior_context['current_persona']}
            Recent Behaviors: {behavior_context['recent_behaviors']}
            New Behavior: {behavior_context['new_behavior']}

            Update the persona traits considering:
            1. Changes in interests based on viewed products
            2. Shifts in purchase patterns
            3. Updated psychographic traits
            4. New behavioral patterns

            Return the updated persona in the same format as the current persona.
            """

            updated_persona = await self.gemini_service.generate_content(prompt)

            # Update persona in database
            for key, value in updated_persona.items():
                setattr(persona, key, value)

            self.db.commit()
            logger.info(f"Updated persona for customer {customer_id}")

            return updated_persona

        except Exception as e:
            logger.error(f"Error updating persona from behavior: {str(e)}")
            self.db.rollback()
            raise

    async def analyze_behavior_patterns(self, customer_id: str) -> Dict[str, Any]:
        """
        Analyze behavior patterns to identify trends and insights
        """
        try:
            # Get all behaviors
            behaviors = self.db.query(CustomerBehavior).filter(
                CustomerBehavior.customer_id == customer_id
            ).all()

            if not behaviors:
                return {}

            # Prepare behavior data for analysis
            behavior_data = {
                "viewed_products": [],
                "time_spent": [],
                "search_history": [],
                "category_interests": {}
            }

            for behavior in behaviors:
                behavior_data["viewed_products"].extend(behavior.viewed_products or [])
                behavior_data["time_spent"].append(behavior.time_spent or 0)
                behavior_data["search_history"].extend(behavior.search_history or [])
                
                # Track category interests
                for category in behavior.category_interests or []:
                    behavior_data["category_interests"][category] = behavior_data["category_interests"].get(category, 0) + 1

            # Generate insights using Gemini
            prompt = f"""
            Analyze the following customer behavior data and provide insights:
            Viewed Products: {behavior_data['viewed_products']}
            Time Spent: {behavior_data['time_spent']}
            Search History: {behavior_data['search_history']}
            Category Interests: {behavior_data['category_interests']}

            Provide insights about:
            1. Product preferences
            2. Shopping patterns
            3. Category interests
            4. Search behavior trends
            """

            insights = await self.gemini_service.generate_content(prompt)
            return insights

        except Exception as e:
            logger.error(f"Error analyzing behavior patterns: {str(e)}")
            raise 