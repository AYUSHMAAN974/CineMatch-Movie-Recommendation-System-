from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MovieBase(BaseModel):
    title: str
    overview: Optional[str] = None
    release_date: Optional[str] = None
    runtime: Optional[int] = None
    genres: Optional[List[str]] = []
    rating: Optional[float] = None
    director: Optional[str] = None
    cast: Optional[List[str]] = []

class MovieCreate(MovieBase):
    tmdb_id: Optional[int] = None
    imdb_id: Optional[str] = None

class MovieResponse(MovieBase):
    id: int
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_count: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class MovieRecommendation(BaseModel):
    movies: List[MovieResponse]
    recommendation_type: str
    confidence_score: Optional[float] = None