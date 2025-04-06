from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os
import pandas as pd
from typing import Dict, Any
import json

from .routes import router
from .database import init_db, SessionLocal, Customer, Product

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
        
        # Load sample data if database is empty
        if db.query(Customer).count() == 0:
            # Create a sample customer
            customer = Customer(
                id="CUST001",
                email="john.doe@example.com",
                name="John Doe"
            )
            db.add(customer)
        
        if db.query(Product).count() == 0:
            # Create a sample product
            product = Product(
                id="PROD001",
                name="Sample Product",
                description="A great product for testing",
                price=99.99,
                category="Electronics",
                story="This is a sample product story",
                product_metadata={"tags": ["sample", "test"]}
            )
            db.add(product)
        
        db.commit()
        print("Database initialized successfully")
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