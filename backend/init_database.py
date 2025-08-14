import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database.init_db import init_database

if __name__ == "__main__":
    print("🗄️ Initializing CineMatch Database...")
    init_database()
    print("🎉 Database setup complete!")