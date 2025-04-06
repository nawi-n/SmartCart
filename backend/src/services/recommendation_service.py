from typing import List, Dict, Any
import google.generativeai as genai
from ..config import settings
from ..database import get_db, Product, Customer
from sqlalchemy.orm import Session

class RecommendationService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    async def generate_recommendations(
        self,
        customer_id: str,
        limit: int = 5,
        db: Session = None
    ) -> List[Dict[str, Any]]:
        if not self.model:
            return []
        
        try:
            if not db:
                db = next(get_db())
            
            # Get customer and products
            customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
            if not customer:
                raise ValueError(f"Customer with ID {customer_id} not found")
            
            products = db.query(Product).all()
            if not products:
                raise ValueError("No products available")
            
            # Prepare the prompt with customer and product information
            prompt = f"""
            You are a product recommendation system for SmartCart. Based on the following information:
            
            Customer:
            - ID: {customer.customer_id}
            - Name: {customer.name}
            - Email: {customer.email}
            
            Available Products:
            {[f"- {p.name} (ID: {p.id}, Category: {p.category}, Price: ${p.price})" for p in products]}
            
            Please recommend {limit} products that would be most relevant to this customer.
            For each recommendation, provide:
            1. The product ID
            2. A brief explanation of why this product would be a good match
            3. A match score between 0 and 1
            
            Format your response as a JSON array of objects with the following structure:
            [
                {{
                    "product_id": str,
                    "explanation": str,
                    "match_score": float
                }},
                ...
            ]
            """
            
            # Generate recommendations
            response = await self.model.generate_content(prompt)
            recommendations = response.text
            
            # Parse the response
            try:
                recommendations = eval(recommendations)  # Convert string to list
            except:
                recommendations = []
            
            return recommendations
            
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return []
        finally:
            if not db:
                db.close()
    
    async def explain_recommendation(
        self,
        customer_id: str,
        product_id: str,
        db: Session = None
    ) -> str:
        if not self.model:
            return "Recommendation service is not available."
        
        try:
            if not db:
                db = next(get_db())
            
            # Get customer and product
            customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
            if not customer:
                raise ValueError(f"Customer with ID {customer_id} not found")
            
            product = db.query(Product).filter(Product.product_id == product_id).first()
            if not product:
                raise ValueError(f"Product with ID {product_id} not found")
            
            # Prepare the prompt
            prompt = f"""
            You are a product recommendation system for SmartCart. Explain why the following product
            would be a good match for this customer:
            
            Customer:
            - ID: {customer.customer_id}
            - Name: {customer.name}
            - Email: {customer.email}
            
            Product:
            - Name: {product.name}
            - Category: {product.category}
            - Price: ${product.price}
            - Description: {product.description}
            
            Please provide a detailed explanation of why this product would be a good match
            for this customer, considering their preferences and the product's features.
            """
            
            # Generate explanation
            response = await self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error explaining recommendation: {e}")
            return "Unable to generate explanation."
        finally:
            if not db:
                db.close() 