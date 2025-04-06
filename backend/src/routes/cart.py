from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..database.models import Cart, CartItem, Product
from ..schemas.cart import CartResponse, CartItemCreate, CartItemUpdate
from ..routes.auth import get_current_user

router = APIRouter()

@router.get("/cart/", response_model=CartResponse)
async def get_cart(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        cart = Cart(customer_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.post("/cart/items/", response_model=CartResponse)
async def add_to_cart(
    item: CartItemCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get or create cart
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        cart = Cart(customer_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already exists in cart
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item.product_id
    ).first()
    
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(cart)
    return cart

@router.put("/cart/items/{product_id}", response_model=CartResponse)
async def update_cart_item(
    product_id: int,
    item: CartItemUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    if item.quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = item.quantity
    
    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/cart/items/{product_id}", response_model=CartResponse)
async def remove_from_cart(
    product_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    db.delete(cart_item)
    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/cart/", response_model=CartResponse)
async def clear_cart(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.customer_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return cart 