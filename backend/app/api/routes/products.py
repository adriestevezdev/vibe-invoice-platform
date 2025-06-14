from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from app.database.connection import SessionDep
from app.database import models
from app.schemas import product

router = APIRouter()

@router.get("/", response_model=List[product.Product])
def get_products(session: SessionDep, skip: int = 0, limit: int = 100):
    """Get all products with pagination"""
    products = session.query(models.Product).offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=product.Product)
def get_product(product_id: int, session: SessionDep):
    """Get a specific product by ID"""
    db_product = session.get(models.Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/", response_model=product.Product, status_code=status.HTTP_201_CREATED)
def create_product(product_data: product.ProductCreate, session: SessionDep):
    """Create a new product"""
    db_product = models.Product(**product_data.model_dump())
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=product.Product)
def update_product(product_id: int, product_data: product.ProductUpdate, session: SessionDep):
    """Update an existing product"""
    db_product = session.get(models.Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    session.commit()
    session.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, session: SessionDep):
    """Delete a product"""
    db_product = session.get(models.Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    session.delete(db_product)
    session.commit()
    return None