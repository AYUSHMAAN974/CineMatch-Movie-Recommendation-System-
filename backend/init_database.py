#!/usr/bin/env python3
"""
Initialize CineMatch database with tables and sample data
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.init_db import init_database, create_sample_users

# Update the main() function call
def main():
    print("🎬 CineMatch Database Initialization")
    print("=" * 50)
    
    if not init_database():
        print("❌ Database initialization failed!")
        return False
    
    create_sample_users()  # ✅ Changed from create_sample_data()
    
    print("\n🚀 Database ready! You can now start the server:")
    print("   python run_server.py")
    return True

if __name__ == "__main__":
    main()