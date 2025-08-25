from pydantic import BaseModel, Field
from datetime import datetime

class RatingBase(BaseModel):
    tmdb_movie_id: int  # ✅ TMDB ID instead of movie_id
    rating: float = Field(..., ge=1.0, le=5.0)

class RatingCreate(RatingBase):
    movie_title: str  # ✅ Include for storage
    movie_poster: str = None

class RatingResponse(RatingBase):
    id: int
    user_id: int
    movie_title: str
    movie_poster: str = None
    created_at: datetime
    
    class Config:
        from_attributes = True