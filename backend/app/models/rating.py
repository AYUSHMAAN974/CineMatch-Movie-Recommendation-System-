from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String  # ✅ Added String
from sqlalchemy.orm import relationship
from app.database.base import Base
from datetime import datetime

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tmdb_movie_id = Column(Integer, nullable=False)  # TMDB ID instead of local movie_id
    rating = Column(Float, nullable=False)  # 1.0 to 5.0
    
    # Store movie info for faster access (optional)
    movie_title = Column(String(255))  # ✅ Now String is imported
    movie_poster = Column(String(500))  # ✅ Store poster URL
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

    def __repr__(self):
        return f"<Rating(user_id={self.user_id}, tmdb_movie_id={self.tmdb_movie_id}, rating={self.rating})>"