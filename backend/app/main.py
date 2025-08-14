from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.config import settings
from .core.database import test_db_connection, test_redis_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CineMatch...")
    print(f"Environment: {settings.ENVIRONMENT}")
    
    db_ok = test_db_connection()
    redis_ok = test_redis_connection()
    
    if not db_ok or not redis_ok:
        raise Exception("Database connection failed")
    
    print("✅ All systems ready!")
    yield
    print("🛑 Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Advanced Movie Recommendation Platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to CineMatch API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}