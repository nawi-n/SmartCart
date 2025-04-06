from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..database.models import Order, OrderItem, Cart, CartItem, Product
from ..schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from ..routes.auth import get_current_user

router = APIRouter()

@router.post("/orders/", response_model=OrderResponse)
async def create_order(
    order: OrderCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's cart
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Create order
    db_order = Order(
        customer_id=current_user.id,
        total_amount=0,  # Will be calculated
        status="pending",
        shipping_address=order.shipping_address,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items and calculate total
    total_amount = 0
    for cart_item in cart_items:
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {cart_item.product_id} not found")
        
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for product {product.name}"
            )
        
        # Update product stock
        product.stock -= cart_item.quantity
        
        # Create order item
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=product.price
        )
        db.add(order_item)
        
        # Add to total
        total_amount += product.price * cart_item.quantity
    
    # Update order total
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    
    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    
    return db_order

@router.get("/orders/", response_model=List[OrderResponse])
async def get_orders(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    return orders

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.put("/orders/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending orders can be cancelled"
        )
    
    # Restore product stock
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    for item in order_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
    
    order.status = "cancelled"
    db.commit()
    
    return {"message": "Order cancelled successfully"} 