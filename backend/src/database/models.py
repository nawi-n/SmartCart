"""
Database models for the SmartCart application.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    personas = relationship("CustomerPersona", back_populates="customer")
    behaviors = relationship("CustomerBehavior", back_populates="customer")
    moods = relationship("CustomerMood", back_populates="customer")
    recommendations = relationship("Recommendation", back_populates="customer")
    chat_history = relationship("ChatHistory", back_populates="customer")

class CustomerPersona(Base):
    __tablename__ = 'customer_personas'
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'), nullable=False)
    preferences = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="personas")

class CustomerBehavior(Base):
    __tablename__ = 'customer_behaviors'
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'), nullable=False)
    product_id = Column(String, ForeignKey('products.id'), nullable=False)
    time_spent = Column(Integer, nullable=False)
    clicks = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="behaviors")
    product = relationship("Product", back_populates="behaviors")

class CustomerMood(Base):
    __tablename__ = 'customer_moods'
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'), nullable=False)
    mood = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="moods")

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    story = Column(Text)
    product_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    behaviors = relationship("CustomerBehavior", back_populates="product")
    recommendations = relationship("Recommendation", back_populates="product")

class Recommendation(Base):
    __tablename__ = 'recommendations'
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'), nullable=False)
    product_id = Column(String, ForeignKey('products.id'), nullable=False)
    score = Column(Float, nullable=False)
    explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="recommendations")
    product = relationship("Product", back_populates="recommendations")

class ChatHistory(Base):
    __tablename__ = 'chat_history'
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey('customers.id'), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="chat_history") 