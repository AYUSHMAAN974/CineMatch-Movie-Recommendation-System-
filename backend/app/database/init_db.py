from sqlalchemy.orm import Session
from app.core.database import engine  # ✅ Updated import
from app.database.base import Base
from app.models.user import User
# from app.models.movie import Movie  # ✅ Remove this import
from app.models.rating import Rating

def init_database():
    """Initialize database with tables"""
    print("🎬 Initializing CineMatch database...")
    
    try:
        # Create all tables (users, ratings only)
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def create_sample_users():
    """Create sample users for testing"""
    from sqlalchemy.orm import sessionmaker
    from passlib.context import CryptContext
    from app.core.database import SessionLocal  # ✅ Updated import
    
    db = SessionLocal()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    try:
        # Check if users already exist
        if db.query(User).count() == 0:
            # Create sample users
            users = [
                User(
                    username="john_doe",
                    email="john@example.com",
                    hashed_password=pwd_context.hash("password123")
                ),
                User(
                    username="jane_smith",
                    email="jane@example.com", 
                    hashed_password=pwd_context.hash("password123")
                )
            ]
            
            for user in users:
                db.add(user)
            db.commit()
            print("✅ Sample users created!")
        
        print("🎉 Database initialization completed!")
        print(f"📊 Users: {db.query(User).count()}")
        
    except Exception as e:
        print(f"❌ Error creating sample users: {e}")
        db.rollback()
    finally:
        db.close()