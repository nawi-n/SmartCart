"""
Database package initialization.
This file makes the database directory a Python package.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..config import settings

# Create SQLite database engine
engine = create_engine(settings.DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Import models to ensure they are registered with SQLAlchemy
from .models import Base, Customer, Product, CustomerPersona, CustomerBehavior, CustomerMood, Recommendation, ChatHistory

def init_db():
    """Initialize the database by creating all tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

__all__ = [
    'init_db', 
    'get_db', 
    'engine', 
    'SessionLocal', 
    'Base',
    'Customer',
    'Product',
    'CustomerPersona',
    'CustomerBehavior',
    'CustomerMood',
    'Recommendation',
    'ChatHistory'
] 