from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...schemas.movie import MovieResponse, MovieRecommendation
from ...services.movie_service import MovieService
from ...services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/", response_model=List[MovieResponse])
def get_movies(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    movie_service = MovieService(db)
    movies = movie_service.get_movies(skip=skip, limit=limit)
    return movies

@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie_service = MovieService(db)
    movie = movie_service.get_movie(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.get("/search/{query}", response_model=List[MovieResponse])
def search_movies(query: str, limit: int = 20, db: Session = Depends(get_db)):
    movie_service = MovieService(db)
    movies = movie_service.search_movies(query, limit)
    return movies

@router.get("/genre/{genre}", response_model=List[MovieResponse])
def get_movies_by_genre(genre: str, limit: int = 20, db: Session = Depends(get_db)):
    movie_service = MovieService(db)
    movies = movie_service.get_movies_by_genre(genre, limit)
    return movies

@router.get("/{movie_id}/recommendations", response_model=MovieRecommendation)
def get_movie_recommendations(movie_id: int, limit: int = 10, db: Session = Depends(get_db)):
    recommendation_service = RecommendationService(db)
    recommendations = recommendation_service.get_content_based_recommendations(movie_id, limit)
    
    return MovieRecommendation(
        movies=recommendations,
        recommendation_type="content_based",
        confidence_score=0.8
    )

@router.get("/trending/now", response_model=List[MovieResponse])
def get_trending_movies(limit: int = 20, db: Session = Depends(get_db)):
    movie_service = MovieService(db)
    movies = movie_service.get_trending_movies(limit)
    return movies