from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    persona = relationship("CustomerPersona", back_populates="customer", uselist=False)
    behaviors = relationship("CustomerBehavior", back_populates="customer")
    moods = relationship("CustomerMood", back_populates="customer")

class CustomerPersona(Base):
    __tablename__ = 'customer_personas'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    age = Column(Integer)
    gender = Column(String)
    interests = Column(JSON)
    psychographic_traits = Column(JSON)
    behavioral_patterns = Column(JSON)
    purchase_history = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="persona")

class CustomerBehavior(Base):
    __tablename__ = 'customer_behaviors'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    viewed_products = Column(JSON)
    time_spent = Column(JSON)
    search_history = Column(JSON)
    category_interests = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="behaviors")

class CustomerMood(Base):
    __tablename__ = 'customer_moods'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    mood = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="moods")

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    category = Column(String)
    description = Column(String)
    price = Column(Float)
    features = Column(JSON)
    unique_selling_points = Column(JSON)
    price_point = Column(String)
    quality_level = Column(String)
    mood_tags = Column(JSON)
    story = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = 'recommendations'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    product_id = Column(String, ForeignKey('products.id'))
    psychographic_match = Column(Float)
    explanation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = 'chat_history'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    message = Column(String)
    response = Column(String)
    context = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    engine = create_engine('sqlite:///smartcart.db')
    Base.metadata.create_all(engine)
    return engine 