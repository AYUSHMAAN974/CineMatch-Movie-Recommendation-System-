from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db  
from app.services.tmdb_service import tmdb_service
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def get_movies(
    category: str = Query("popular", description="Category: popular, trending, now_playing, upcoming, top_rated"),
    page: int = Query(1, ge=1, le=500, description="Page number"),
    genre: Optional[str] = Query(None, description="Filter by genre name")
) -> Dict:
    """Get real movies from TMDB API"""
    try:
        logger.info(f"Fetching {category} movies, page {page}")
        
        # Get data from TMDB based on category
        if category == "popular":
            tmdb_data = tmdb_service.get_popular_movies(page)
        elif category == "trending":
            tmdb_data = tmdb_service.get_trending_movies("day", page)
        elif category == "now_playing":
            tmdb_data = tmdb_service.get_now_playing_movies(page)
        elif category == "upcoming":
            tmdb_data = tmdb_service.get_upcoming_movies(page)
        elif category == "top_rated":
            tmdb_data = tmdb_service.get_top_rated_movies(page)
        else:
            tmdb_data = tmdb_service.get_popular_movies(page)
        
        # Format movies data
        movies = []
        for tmdb_movie in tmdb_data.get("results", []):
            # Skip adult content and movies without posters
            if tmdb_movie.get("adult", False) or not tmdb_movie.get("poster_path"):
                continue
                
            formatted_movie = tmdb_service.format_movie_data(tmdb_movie)
            
            # Apply genre filter if specified
            if genre:
                if genre.lower() not in formatted_movie["genre"].lower():
                    continue
            
            movies.append(formatted_movie)
        
        return {
            "items": movies,
            "total": tmdb_data.get("total_results", 0),
            "page": page,
            "total_pages": tmdb_data.get("total_pages", 1),
            "category": category,
            "limit": len(movies)
        }
        
    except Exception as e:
        logger.error(f"Error fetching movies: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch movies")

@router.get("/search")
async def search_movies(
    query: str = Query(..., description="Search query"),
    page: int = Query(1, ge=1, le=500, description="Page number")
) -> Dict:
    """Search movies by title"""
    try:
        tmdb_data = tmdb_service.search_movies(query, page)
        
        movies = []
        for tmdb_movie in tmdb_data.get("results", []):
            if tmdb_movie.get("adult", False) or not tmdb_movie.get("poster_path"):
                continue
                
            formatted_movie = tmdb_service.format_movie_data(tmdb_movie)
            movies.append(formatted_movie)
        
        return {
            "items": movies,
            "total": tmdb_data.get("total_results", 0),
            "page": page,
            "total_pages": tmdb_data.get("total_pages", 1),
            "query": query,
            "limit": len(movies)
        }
        
    except Exception as e:
        logger.error(f"Error searching movies: {e}")
        raise HTTPException(status_code=500, detail="Failed to search movies")

@router.get("/{movie_id}")
async def get_movie_details(movie_id: int) -> Dict:
    """Get detailed movie information"""
    try:
        movie_data = tmdb_service.get_movie_details(movie_id)
        credits_data = tmdb_service.get_movie_credits(movie_id)
        
        if not movie_data.get("id"):
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Get cast and crew info
        cast = credits_data.get("cast", [])[:10]  # Top 10 cast members
        crew = credits_data.get("crew", [])
        
        # Find director
        director = next((person["name"] for person in crew if person["job"] == "Director"), "Unknown")
        
        # Format cast names
        cast_names = [person["name"] for person in cast]
        
        return {
            "id": movie_data["id"],
            "title": movie_data["title"],
            "overview": movie_data["overview"],
            "genres": [g["name"] for g in movie_data.get("genres", [])],
            "release_date": movie_data.get("release_date"),
            "runtime": movie_data.get("runtime"),
            "poster_url": tmdb_service._get_full_image_url(movie_data.get("poster_path")),
            "backdrop_url": tmdb_service._get_full_image_url(movie_data.get("backdrop_path")),
            "vote_average": movie_data.get("vote_average"),
            "vote_count": movie_data.get("vote_count"),
            "popularity": movie_data.get("popularity"),
            "director": director,
            "cast": cast_names[:5],  # Top 5 cast
            "production_companies": [c["name"] for c in movie_data.get("production_companies", [])[:3]],
            "budget": movie_data.get("budget"),
            "revenue": movie_data.get("revenue"),
            "status": movie_data.get("status"),
            "tagline": movie_data.get("tagline")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching movie details: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch movie details")

@router.get("/categories/all")
async def get_movie_categories() -> Dict:
    """Get all available movie categories"""
    return {
        "categories": [
            {"id": "popular", "name": "Popular", "description": "Most popular movies right now"},
            {"id": "trending", "name": "Trending", "description": "Trending movies today"},
            {"id": "now_playing", "name": "Now Playing", "description": "Currently in theaters"},
            {"id": "upcoming", "name": "Upcoming", "description": "Coming soon to theaters"},
            {"id": "top_rated", "name": "Top Rated", "description": "Highest rated movies of all time"}
        ],
        "genres": [
            {"id": "Action", "name": "Action"},
            {"id": "Comedy", "name": "Comedy"},
            {"id": "Drama", "name": "Drama"},
            {"id": "Horror", "name": "Horror"},
            {"id": "Romance", "name": "Romance"},
            {"id": "Science Fiction", "name": "Science Fiction"},
            {"id": "Thriller", "name": "Thriller"},
            {"id": "Animation", "name": "Animation"},
            {"id": "Crime", "name": "Crime"},
            {"id": "Fantasy", "name": "Fantasy"}
        ]
    }