from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    overview = Column(Text)
    release_date = Column(String)
    runtime = Column(Integer)
    genres = Column(JSON)  # Store as JSON array: ["Action", "Comedy"]
    rating = Column(Float)
    vote_count = Column(Integer)
    poster_path = Column(String)
    backdrop_path = Column(String)
    imdb_id = Column(String, unique=True)
    tmdb_id = Column(Integer, unique=True)
    director = Column(String)
    cast = Column(JSON)  # Store as JSON array
    keywords = Column(JSON)  # For content-based filtering
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    ratings = relationship("Rating", back_populates="movie")