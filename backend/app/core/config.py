import os
from typing import Optional, List

class Settings:
    # Environment
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cinematch.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CineMatch"
    PROJECT_VERSION: str = "1.0.0"
    
    # CORS - Fixed parsing
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")
        return [origin.strip() for origin in cors_origins.split(",")]
    
    # TMDB
    TMDB_API_KEY: Optional[str] = os.getenv("TMDB_API_KEY")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

# Create settings instance
settings = Settings()