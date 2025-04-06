from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import pandas as pd
from typing import Dict, Any
import json
from sqlalchemy import text

from .routes.products import router as products_router
from .routes.recommendations import router as recommendations_router
from .routes.auth import router as auth_router
from .routes.voice import router as voice_router
from .routes.chat import router as chat_router
from .routes.cart import router as cart_router
from .routes.orders import router as orders_router
from .database import get_db, engine
from .models import Base, Customer, Product
from .config import settings

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SmartCart API",
    description="A GenAI-powered multi-agent personalized e-commerce system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    """Initialize database and load initial data"""
    try:
        # Initialize database
        Base.metadata.create_all(bind=engine)
        
        db = next(get_db())
        
        # Load sample data if database is empty
        if db.query(Customer).count() == 0:
            # Create a sample customer
            customer = Customer(
                email="john.doe@example.com",
                name="John Doe",
                password="hashed_password_here",  # In production, this should be properly hashed
                age=30,
                gender="Male",
                location="New York",
                browsing_history={},
                purchase_history={},
                customer_segment="Regular",
                avg_order_value=0.0,
                holiday="None",
                season="Spring",
                persona={}
            )
            db.add(customer)
        
        if db.query(Product).count() == 0:
            # Create a sample product with all required fields
            product = Product(
                product_id="PROD001",
                name="Sample Product",
                description="A great product for testing",
                price=99.99,
                category="Electronics",
                subcategory="Gadgets",
                brand="Sample Brand",
                image_url="https://example.com/sample.jpg",
                rating=4.5,
                stock=100,
                story="This is a sample product story",
                product_metadata={"tags": ["sample", "test"]},
                average_rating_similar_products=4.2,
                product_rating=4.5,
                customer_review_sentiment_score=0.8,
                holiday="None",
                season="Spring",
                geographical_location="Global",
                similar_product_list={"products": ["PROD002", "PROD003"]},
                probability_of_recommendation=0.9
            )
            db.add(product)
        
        db.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error during startup: {e}")
        raise
    finally:
        db.close()

# Include routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(products_router, prefix="/api", tags=["Products"])
app.include_router(cart_router, prefix="/api", tags=["Cart"])
app.include_router(orders_router, prefix="/api", tags=["Orders"])
app.include_router(recommendations_router, prefix="/api", tags=["Recommendations"])
app.include_router(voice_router, prefix="/api", tags=["Voice"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to SmartCart API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 