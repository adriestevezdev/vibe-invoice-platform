from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import clients, products, invoices
from app.database.connection import engine, create_db_and_tables

app = FastAPI(
    title="Vibe Invoice Platform API",
    description="Professional invoice management system API",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://frontend:3000",  # Docker service name
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["invoices"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Vibe Invoice Platform API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "vibe-invoice-api"}

# Startup event
@app.on_event("startup")
def on_startup():
    # Create database tables
    create_db_and_tables()
    print("Database tables created successfully")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)