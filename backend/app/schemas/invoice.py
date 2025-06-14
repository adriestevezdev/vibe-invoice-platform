from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .client import Client

class LineItemBase(BaseModel):
    description: str
    quantity: float
    unit_price: float
    tax_rate: float = 0.0
    product_id: Optional[int] = None

class LineItemCreate(LineItemBase):
    pass

class LineItem(LineItemBase):
    id: int
    total_amount: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    client_id: int
    due_date: Optional[datetime] = None
    currency: str = "USD"
    notes: Optional[str] = None
    payment_terms: Optional[str] = None
    discount_amount: float = 0.0

class InvoiceCreate(InvoiceBase):
    line_items: List[LineItemCreate] = []

class InvoiceUpdate(BaseModel):
    client_id: Optional[int] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    currency: Optional[str] = None
    notes: Optional[str] = None
    payment_terms: Optional[str] = None
    discount_amount: Optional[float] = None

class Invoice(InvoiceBase):
    id: int
    invoice_number: str
    issue_date: datetime
    status: str
    subtotal: float
    tax_amount: float
    total_amount: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    client: Optional[Client] = None
    line_items: List[LineItem] = []
    
    class Config:
        from_attributes = True