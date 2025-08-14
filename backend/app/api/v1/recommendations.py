from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...api.deps import get_current_user
from ...models.user import User
from ...schemas.movie import MovieRecommendation, MovieResponse
from ...services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/for-me", response_model=MovieRecommendation)
def get_personal_recommendations(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recommendation_service = RecommendationService(db)
    recommendations = recommendation_service.get_user_recommendations(
        current_user.id, limit
    )
    
    return MovieRecommendation(
        movies=recommendations,
        recommendation_type="personalized",
        confidence_score=0.9
    )

@router.get("/popular", response_model=List[MovieResponse])
def get_popular_recommendations(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    recommendation_service = RecommendationService(db)
    recommendations = recommendation_service.get_popular_recommendations(limit)
    return recommendations

@router.get("/similar/{movie_id}", response_model=MovieRecommendation)
def get_similar_movies(
    movie_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    recommendation_service = RecommendationService(db)
    recommendations = recommendation_service.get_content_based_recommendations(
        movie_id, limit
    )
    
    return MovieRecommendation(
        movies=recommendations,
        recommendation_type="content_based",
        confidence_score=0.8
    )