from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Annotated
from fastapi import Depends
import os

# Database URL from environment variable or default
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://vibe_user:vibe_password@postgres:5432/vibe_invoice_db"
)

# Create database engine
engine = create_engine(
    DATABASE_URL,
    echo=True  # Enable SQL logging for development
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Type annotation for dependency injection
SessionDep = Annotated[Session, Depends(get_db)]

# Function to create all tables
def create_db_and_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)