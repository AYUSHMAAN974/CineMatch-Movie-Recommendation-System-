from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import test_db_connection, test_redis_connection
from app.api.v1.api import api_router  # Add this import
import logging

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes - ADD THIS
app.include_router(api_router, prefix=settings.API_V1_STR)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("🎬 Starting CineMatch API...")
    
    # Test database connection
    if test_db_connection():
        logger.info("✅ Database connection verified")
    else:
        logger.error("❌ Database connection failed")
    
    # Test Redis connection (optional)
    test_redis_connection()

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "CineMatch API is running!",
        "version": settings.PROJECT_VERSION
    }

# Root endpoint  
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CineMatch API",
        "docs": "/docs",
        "health": "/health"
    }

# Global exception handler
@app.exception_handler(500)
async def internal_server_error(request, exc):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )