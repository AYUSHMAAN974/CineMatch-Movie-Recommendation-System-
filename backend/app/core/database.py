import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
import redis
import logging

logger = logging.getLogger(__name__)

# Database URL
DATABASE_URL = settings.DATABASE_URL

# Create engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=settings.DEBUG  # This will work now
    )
else:
    engine = create_engine(DATABASE_URL, echo=settings.DEBUG)

# Create SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_db_connection():
    """Test database connection"""
    try:
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
        
        logger.info("✅ Database connection successful")
        return True
        
    except SQLAlchemyError as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected database error: {e}")
        return False

def test_redis_connection():
    """Test Redis connection (optional)"""
    try:
        # Skip Redis test if using SQLite (development mode)
        if DATABASE_URL.startswith("sqlite"):
            logger.info("⏭️  Skipping Redis test (SQLite mode)")
            return True
            
        redis_client = redis.from_url(settings.REDIS_URL)
        redis_client.ping()
        
        logger.info("✅ Redis connection successful")
        return True
        
    except redis.ConnectionError as e:
        logger.warning(f"⚠️  Redis connection failed (optional): {e}")
        return False
    except Exception as e:
        logger.warning(f"⚠️  Redis test error (optional): {e}")
        return False