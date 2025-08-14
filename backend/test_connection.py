import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.database import test_db_connection, test_redis_connection

def main():
    print("🔍 Testing database connections...")
    print("-" * 50)
    
    print("Testing PostgreSQL connection...")
    db_success = test_db_connection()
    
    print("\nTesting Redis connection...")
    redis_success = test_redis_connection()
    
    print("\n" + "=" * 50)
    if db_success and redis_success:
        print("🎉 ALL CONNECTIONS SUCCESSFUL!")
        print("Ready to create tables and add data!")
    else:
        print("❌ Some connections failed.")
        print("Check docker-compose services and .env file.")
    print("=" * 50)

if __name__ == "__main__":
    main()