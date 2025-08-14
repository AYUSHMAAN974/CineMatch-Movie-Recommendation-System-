from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import redis
from .config import settings

# Database Engine Configuration
engine = create_engine(
    settings.DATABASE_URL,
    # Connection pool settings for PostgreSQL
    pool_size=10,  # Number of connections to maintain
    max_overflow=20,  # Maximum overflow connections
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections every 5 minutes
    echo=settings.DEBUG,  # Log SQL queries in debug mode
)

# Session Factory
SessionLocal = sessionmaker(
    autocommit=False,  # Don't auto-commit transactions
    autoflush=False,   # Don't auto-flush changes
    bind=engine
)

# Base class for SQLAlchemy models
Base = declarative_base()

# Redis connection for caching
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True,  # Automatically decode responses to strings
    health_check_interval=30  # Health check every 30 seconds
)

def get_db():
    """
    Dependency function to get database session.
    Used with FastAPI's dependency injection system.
    
    Yields:
        SessionLocal: Database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
    """
    Dependency function to get Redis client.
    
    Returns:
        redis.Redis: Redis client instance
    """
    return redis_client

# Test database connection
def test_db_connection():
    """
    Test database connectivity on startup.
    
    Returns:
        bool: True if connection successful
    """
    try:
        with engine.connect() as connection:
            # Fixed: Use text() to wrap SQL query
            connection.execute(text("SELECT 1"))
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

# Test Redis connection
def test_redis_connection():
    """
    Test Redis connectivity on startup.
    
    Returns:
        bool: True if connection successful
    """
    try:
        redis_client.ping()
        print("✅ Redis connection successful")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return False