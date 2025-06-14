from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    payment_terms: str = "Net 30"

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    payment_terms: Optional[str] = None

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True