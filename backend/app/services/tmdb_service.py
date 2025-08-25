import requests
import os
from typing import List, Dict, Optional
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class TMDBService:
    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p/w500"
        
        # Debug logging
        print(f"🔑 TMDB_API_KEY loaded: {bool(self.api_key)}")
        if self.api_key:
            print(f"🔑 Key starts with: {self.api_key[:10]}...")
        
        if not self.api_key:
            logger.warning("TMDB_API_KEY not found. Using sample data.")
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make request to TMDB API"""
        if not self.api_key:
            return {"results": [], "total_pages": 0, "total_results": 0}
            
        if params is None:
            params = {}
        
        params['api_key'] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"TMDB API request failed: {e}")
            return {"results": [], "total_pages": 0, "total_results": 0}
    
    def get_popular_movies(self, page: int = 1) -> Dict:
        """Get popular movies"""
        return self._make_request("movie/popular", {"page": page})
    
    def get_trending_movies(self, time_window: str = "day", page: int = 1) -> Dict:
        """Get trending movies (day/week)"""
        return self._make_request(f"trending/movie/{time_window}", {"page": page})
    
    def get_now_playing_movies(self, page: int = 1) -> Dict:
        """Get now playing movies"""
        return self._make_request("movie/now_playing", {"page": page})
    
    def get_upcoming_movies(self, page: int = 1) -> Dict:
        """Get upcoming movies"""
        return self._make_request("movie/upcoming", {"page": page})
    
    def get_top_rated_movies(self, page: int = 1) -> Dict:
        """Get top rated movies"""
        return self._make_request("movie/top_rated", {"page": page})
    
    def search_movies(self, query: str, page: int = 1) -> Dict:
        """Search movies by title"""
        return self._make_request("search/movie", {"query": query, "page": page})
    
    def get_movies_by_genre(self, genre_id: int, page: int = 1) -> Dict:
        """Get movies by genre ID"""
        return self._make_request("discover/movie", {
            "with_genres": genre_id,
            "page": page,
            "sort_by": "popularity.desc"
        })
    
    def get_movie_details(self, movie_id: int) -> Dict:
        """Get detailed movie information"""
        return self._make_request(f"movie/{movie_id}")
    
    def get_movie_credits(self, movie_id: int) -> Dict:
        """Get movie cast and crew"""
        return self._make_request(f"movie/{movie_id}/credits")
    
    def format_movie_data(self, tmdb_movie: Dict) -> Dict:
        """Convert TMDB movie data to our format"""
        return {
            "tmdb_id": tmdb_movie.get("id"),
            "title": tmdb_movie.get("title", "Unknown Title"),
            "overview": tmdb_movie.get("overview", "No overview available"),
            "genre": self._get_primary_genre(tmdb_movie.get("genre_ids", [])),
            "release_date": tmdb_movie.get("release_date"),
            "poster_url": self._get_full_image_url(tmdb_movie.get("poster_path")),
            "backdrop_url": self._get_full_image_url(tmdb_movie.get("backdrop_path")),
            "average_rating": round(tmdb_movie.get("vote_average", 0), 1),
            "rating_count": tmdb_movie.get("vote_count", 0),
            "popularity": tmdb_movie.get("popularity", 0),
            "adult": tmdb_movie.get("adult", False),
            "original_language": tmdb_movie.get("original_language"),
            "original_title": tmdb_movie.get("original_title")
        }
    
    def _get_full_image_url(self, image_path: str) -> Optional[str]:
        """Get full image URL"""
        if not image_path:
            return None
        return f"{self.image_base_url}{image_path}"
    
    def _get_primary_genre(self, genre_ids: List[int]) -> str:
        """Get primary genre name from genre IDs"""
        genre_map = {
            28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
            80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
            14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
            9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
            10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        }
        
        if not genre_ids:
            return "Unknown"
        
        return genre_map.get(genre_ids[0], "Unknown")

# Create singleton instance
tmdb_service = TMDBService()