import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.database import engine, Base
from app.models.user import User
from app.models.movie import Movie
from app.models.rating import Rating

def reset_database():
    print("🗑️ Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped!")
    
    print("🏗️ Creating tables with fixed relationships...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    reset_database()