from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from datetime import datetime
import string
import random
from app.database.connection import SessionDep
from app.database import models
from app.schemas import invoice

router = APIRouter()

def generate_invoice_number():
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.digits, k=4))
    return f"INV-{timestamp}-{random_suffix}"

def calculate_invoice_totals(line_items: List[models.LineItem]):
    subtotal = sum(item.quantity * item.unit_price for item in line_items)
    tax_amount = sum(item.quantity * item.unit_price * (item.tax_rate / 100) for item in line_items)
    return subtotal, tax_amount

@router.get("/", response_model=List[invoice.Invoice])
def get_invoices(session: SessionDep, skip: int = 0, limit: int = 100):
    """Get all invoices with pagination"""
    invoices = session.query(models.Invoice).offset(skip).limit(limit).all()
    return invoices

@router.get("/{invoice_id}", response_model=invoice.Invoice)
def get_invoice(invoice_id: int, session: SessionDep):
    """Get a specific invoice by ID"""
    db_invoice = session.get(models.Invoice, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.post("/", response_model=invoice.Invoice, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice_data: invoice.InvoiceCreate, session: SessionDep):
    """Create a new invoice with line items"""
    client = session.get(models.Client, invoice_data.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db_invoice = models.Invoice(
        invoice_number=generate_invoice_number(),
        client_id=invoice_data.client_id,
        due_date=invoice_data.due_date,
        currency=invoice_data.currency,
        notes=invoice_data.notes,
        payment_terms=invoice_data.payment_terms,
        discount_amount=invoice_data.discount_amount
    )
    
    session.add(db_invoice)
    session.flush()
    
    line_items = []
    for item_data in invoice_data.line_items:
        total_amount = item_data.quantity * item_data.unit_price
        line_item = models.LineItem(
            invoice_id=db_invoice.id,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            tax_rate=item_data.tax_rate,
            total_amount=total_amount,
            product_id=item_data.product_id
        )
        line_items.append(line_item)
        session.add(line_item)
    
    subtotal, tax_amount = calculate_invoice_totals(line_items)
    total_amount = subtotal + tax_amount - invoice_data.discount_amount
    
    db_invoice.subtotal = subtotal
    db_invoice.tax_amount = tax_amount
    db_invoice.total_amount = total_amount
    
    session.commit()
    session.refresh(db_invoice)
    return db_invoice

@router.put("/{invoice_id}", response_model=invoice.Invoice)
def update_invoice(invoice_id: int, invoice_data: invoice.InvoiceUpdate, session: SessionDep):
    """Update an existing invoice"""
    db_invoice = session.get(models.Invoice, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    update_data = invoice_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    
    session.commit()
    session.refresh(db_invoice)
    return db_invoice

@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(invoice_id: int, session: SessionDep):
    """Delete an invoice"""
    db_invoice = session.get(models.Invoice, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    session.delete(db_invoice)
    session.commit()
    return None

@router.patch("/{invoice_id}/status")
def update_invoice_status(invoice_id: int, status: str, session: SessionDep):
    """Update invoice status"""
    db_invoice = session.get(models.Invoice, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    valid_statuses = ["draft", "sent", "paid", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    db_invoice.status = status
    session.commit()
    session.refresh(db_invoice)
    return {"message": f"Invoice status updated to {status}"}