from pydantic import BaseModel, Field
from datetime import datetime

class RatingBase(BaseModel):
    movie_id: int
    rating: float = Field(..., ge=1.0, le=5.0)

class RatingCreate(RatingBase):
    pass

class RatingResponse(RatingBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  