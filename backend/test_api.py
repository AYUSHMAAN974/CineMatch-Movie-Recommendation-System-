import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.movie import Movie
from app.models.rating import Rating

def test_database_data():
    print("🧪 Testing database data...")
    db = SessionLocal()
    
    try:
        # Test users
        users = db.query(User).all()
        print(f"✅ Users in database: {len(users)}")
        for user in users:
            print(f"   - {user.username} ({user.email})")
        
        # Test movies
        movies = db.query(Movie).all()
        print(f"✅ Movies in database: {len(movies)}")
        for movie in movies:
            print(f"   - {movie.title} ({movie.rating}/10)")
        
        # Test ratings
        ratings = db.query(Rating).all()
        print(f"✅ Ratings in database: {len(ratings)}")
        
        print("\n🎉 Database is working perfectly!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_database_data()