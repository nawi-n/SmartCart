"""
Database models for the SmartCart application.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    personas = relationship("CustomerPersona", back_populates="customer")
    behaviors = relationship("CustomerBehavior", back_populates="customer")
    moods = relationship("CustomerMood", back_populates="customer")
    recommendations = relationship("Recommendation", back_populates="customer")
    chat_history = relationship("ChatHistory", back_populates="customer")
    orders = relationship("Order", back_populates="customer")
    cart = relationship("Cart", back_populates="customer", uselist=False)

class CustomerPersona(Base):
    __tablename__ = 'customer_personas'
    
    id = Column(String, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    preferences = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="personas")

class CustomerBehavior(Base):
    __tablename__ = 'customer_behaviors'
    
    id = Column(String, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    time_spent = Column(Integer, nullable=False)
    clicks = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="behaviors")
    product = relationship("Product", back_populates="behaviors")

class CustomerMood(Base):
    __tablename__ = 'customer_moods'
    
    id = Column(String, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    mood = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="moods")

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    category = Column(String)
    subcategory = Column(String)
    brand = Column(String)
    image_url = Column(String)
    rating = Column(Float)
    stock = Column(Integer)
    story = Column(Text)
    product_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    behaviors = relationship("CustomerBehavior", back_populates="product")
    recommendations = relationship("Recommendation", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

class Recommendation(Base):
    __tablename__ = 'recommendations'
    
    id = Column(String, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    score = Column(Float, nullable=False)
    explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="recommendations")
    product = relationship("Product", back_populates="recommendations")

class ChatHistory(Base):
    __tablename__ = 'chat_history'
    
    id = Column(String, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", back_populates="chat_history")

class Cart(Base):
    __tablename__ = 'carts'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship('Customer', back_populates='cart')
    items = relationship('CartItem', back_populates='cart')

class CartItem(Base):
    __tablename__ = 'cart_items'
    
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('carts.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cart = relationship('Cart', back_populates='items')
    product = relationship('Product', back_populates='cart_items')

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    total_amount = Column(Float)
    status = Column(String)  # pending, processing, shipped, delivered, cancelled
    shipping_address = Column(Text)
    payment_method = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship('Customer', back_populates='orders')
    items = relationship('OrderItem', back_populates='order')

class OrderItem(Base):
    __tablename__ = 'order_items'
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer)
    price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order = relationship('Order', back_populates='items')
    product = relationship('Product', back_populates='order_items') 