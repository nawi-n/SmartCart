from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, DateTime, ForeignKey, Boolean, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Create SQLite database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./smartcart.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True)
    age = Column(Integer)
    gender = Column(String)
    location = Column(String)
    browsing_history = Column(JSON)
    purchase_history = Column(JSON)
    customer_segment = Column(String)
    avg_order_value = Column(Float)
    holiday = Column(String)
    season = Column(String)
    persona = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    recommendations = relationship("Recommendation", back_populates="customer")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, unique=True, index=True)
    category = Column(String)
    price = Column(Float)
    brand = Column(String)
    average_rating_similar_products = Column(Float)
    product_rating = Column(Float)
    customer_review_sentiment_score = Column(Float)
    holiday = Column(String)
    season = Column(String)
    geographical_location = Column(String)
    similar_product_list = Column(JSON)
    probability_of_recommendation = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    recommendations = relationship("Recommendation", back_populates="product")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    match_score = Column(Float)
    explanation = Column(String)
    feedback = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("Customer", back_populates="recommendations")
    product = relationship("Product", back_populates="recommendations")

def init_db():
    """Initialize the database by dropping existing tables and creating new ones"""
    # Drop all existing tables
    metadata = MetaData()
    metadata.reflect(bind=engine)
    metadata.drop_all(bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 