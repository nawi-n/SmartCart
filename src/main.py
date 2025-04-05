from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os
import pandas as pd
from typing import Dict, Any
import json

from .routes import router
from .database import get_db, SessionLocal, Customer, Product, Recommendation, init_db

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SmartCart API",
    description="A multi-agent system for personalized e-commerce recommendations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Initialize database and load initial data"""
    try:
        # Initialize database
        init_db()
        
        db = SessionLocal()
        
        # Load customer data
        customer_df = pd.read_csv("customer_data_collection.csv")
        for _, row in customer_df.iterrows():
            # Convert string representations of lists to actual lists
            browsing_history = json.loads(row['Browsing_History'].replace("'", '"'))
            purchase_history = json.loads(row['Purchase_History'].replace("'", '"'))
            
            customer = Customer(
                customer_id=str(row['Customer_ID']),
                age=int(row['Age']),
                gender=row['Gender'],
                location=row['Location'],
                browsing_history=browsing_history,
                purchase_history=purchase_history,
                customer_segment=row['Customer_Segment'],
                avg_order_value=float(row['Avg_Order_Value']),
                holiday=row['Holiday'],
                season=row['Season']
            )
            db.add(customer)
        
        # Load product data
        product_df = pd.read_csv("product_recommendation_data.csv")
        for _, row in product_df.iterrows():
            # Convert string representations of lists to actual lists
            similar_product_list = json.loads(row['Similar_Product_List'].replace("'", '"'))
            
            product = Product(
                product_id=str(row['Product_ID']),
                category=row['Category'],
                price=float(row['Price']),
                brand=row['Brand'],
                average_rating_similar_products=float(row['Average_Rating_of_Similar_Products']),
                product_rating=float(row['Product_Rating']),
                customer_review_sentiment_score=float(row['Customer_Review_Sentiment_Score']),
                holiday=row['Holiday'],
                season=row['Season'],
                geographical_location=row['Geographical_Location'],
                similar_product_list=similar_product_list,
                probability_of_recommendation=float(row['Probability_of_Recommendation'])
            )
            db.add(product)
        
        db.commit()
        print("Database initialized and data loaded successfully")
    except Exception as e:
        print(f"Error during startup: {e}")
        raise
    finally:
        db.close()

@app.get("/")
async def root():
    return {
        "message": "Welcome to SmartCart API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 