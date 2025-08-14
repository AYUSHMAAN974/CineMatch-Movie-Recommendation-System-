from sqlalchemy.orm import Session
from ..core.database import engine, SessionLocal, Base
from ..models.user import User
from ..models.movie import Movie
from ..models.rating import Rating
from ..core.security import get_password_hash

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def create_sample_data():
    """Create sample data for testing"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Sample data already exists, skipping...")
            return
        
        print("Creating sample data...")
        
        # Create sample users
        sample_users = [
            {
                "email": "john@example.com",
                "username": "john_doe",
                "hashed_password": get_password_hash("password123"),
                "full_name": "John Doe"
            },
            {
                "email": "jane@example.com", 
                "username": "jane_smith",
                "hashed_password": get_password_hash("password123"),
                "full_name": "Jane Smith"
            }
        ]
        
        for user_data in sample_users:
            user = User(**user_data)
            db.add(user)
        
        # Create sample movies
        sample_movies = [
            {
                "title": "The Matrix",
                "overview": "A computer programmer discovers reality is a simulation.",
                "release_date": "1999-03-31",
                "runtime": 136,
                "genres": ["Action", "Sci-Fi"],
                "rating": 8.7,
                "vote_count": 1500000,
                "director": "The Wachowskis",
                "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
                "keywords": ["virtual reality", "chosen one", "red pill"]
            },
            {
                "title": "Inception",
                "overview": "A thief enters people's dreams to steal secrets.",
                "release_date": "2010-07-16", 
                "runtime": 148,
                "genres": ["Action", "Sci-Fi", "Thriller"],
                "rating": 8.8,
                "vote_count": 2000000,
                "director": "Christopher Nolan",
                "cast": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
                "keywords": ["dreams", "heist", "mind bending"]
            },
            {
                "title": "The Shawshank Redemption",
                "overview": "A banker sentenced to life in prison befriends a fellow inmate.",
                "release_date": "1994-09-23",
                "runtime": 142,
                "genres": ["Drama"],
                "rating": 9.3,
                "vote_count": 2500000,
                "director": "Frank Darabont", 
                "cast": ["Tim Robbins", "Morgan Freeman"],
                "keywords": ["prison", "friendship", "hope"]
            }
        ]
        
        for movie_data in sample_movies:
            movie = Movie(**movie_data)
            db.add(movie)
        
        db.commit()
        print("✅ Sample data created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

def init_database():
    """Initialize database with tables and sample data"""
    print("🗄️ Initializing database...")
    create_tables()
    create_sample_data()
    print("✅ Database initialization complete!")

if __name__ == "__main__":
    init_database()