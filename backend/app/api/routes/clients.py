from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from app.database.connection import SessionDep
from app.database import models
from app.schemas import client

router = APIRouter()

@router.get("/", response_model=List[client.Client])
def get_clients(session: SessionDep, skip: int = 0, limit: int = 100):
    """Get all clients with pagination"""
    clients = session.query(models.Client).offset(skip).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=client.Client)
def get_client(client_id: int, session: SessionDep):
    """Get a specific client by ID"""
    db_client = session.get(models.Client, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.post("/", response_model=client.Client, status_code=status.HTTP_201_CREATED)
def create_client(client_data: client.ClientCreate, session: SessionDep):
    """Create a new client"""
    db_client = models.Client(**client_data.model_dump())
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.put("/{client_id}", response_model=client.Client)
def update_client(client_id: int, client_data: client.ClientUpdate, session: SessionDep):
    """Update an existing client"""
    db_client = session.get(models.Client, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = client_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)
    
    session.commit()
    session.refresh(db_client)
    return db_client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, session: SessionDep):
    """Delete a client"""
    db_client = session.get(models.Client, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    session.delete(db_client)
    session.commit()
    return None