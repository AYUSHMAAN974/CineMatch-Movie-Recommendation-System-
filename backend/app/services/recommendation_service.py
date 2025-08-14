from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ..models.movie import Movie
from ..models.rating import Rating
from ..models.user import User

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_content_based_recommendations(self, movie_id: int, limit: int = 10) -> List[Movie]:
        """Content-based filtering using movie genres and keywords"""
        # Get the target movie
        target_movie = self.db.query(Movie).filter(Movie.id == movie_id).first()
        if not target_movie:
            return []
        
        # Get all movies
        all_movies = self.db.query(Movie).all()
        
        # Create content strings for each movie
        movie_data = []
        for movie in all_movies:
            genres_str = ' '.join(movie.genres or [])
            keywords_str = ' '.join(movie.keywords or [])
            content = f"{genres_str} {keywords_str} {movie.director or ''}"
            movie_data.append({
                'id': movie.id,
                'content': content,
                'movie': movie
            })
        
        # Create TF-IDF vectors
        contents = [item['content'] for item in movie_data]
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(contents)
        
        # Calculate similarity scores
        target_idx = next(i for i, item in enumerate(movie_data) if item['id'] == movie_id)
        cosine_scores = cosine_similarity(tfidf_matrix[target_idx], tfidf_matrix).flatten()
        
        # Get top similar movies (excluding the target movie)
        movie_scores = [(i, score) for i, score in enumerate(cosine_scores) if i != target_idx]
        movie_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top recommendations
        recommendations = []
        for idx, score in movie_scores[:limit]:
            recommendations.append(movie_data[idx]['movie'])
        
        return recommendations
    
    def get_popular_recommendations(self, limit: int = 10) -> List[Movie]:
        """Get popular movies based on ratings and vote count"""
        return self.db.query(Movie).filter(
            Movie.rating >= 7.0,
            Movie.vote_count >= 100
        ).order_by(
            Movie.rating.desc(),
            Movie.vote_count.desc()
        ).limit(limit).all()
    
    def get_user_recommendations(self, user_id: int, limit: int = 10) -> List[Movie]:
        """Get recommendations for a specific user based on their ratings"""
        # Get user's ratings
        user_ratings = self.db.query(Rating).filter(Rating.user_id == user_id).all()
        
        if not user_ratings:
            # New user - return popular movies
            return self.get_popular_recommendations(limit)
        
        # Get user's favorite genres
        rated_movies = [rating.movie for rating in user_ratings if rating.rating >= 4.0]
        favorite_genres = {}
        
        for movie in rated_movies:
            for genre in movie.genres or []:
                favorite_genres[genre] = favorite_genres.get(genre, 0) + 1
        
        # Get top genre
        if favorite_genres:
            top_genre = max(favorite_genres.keys(), key=lambda x: favorite_genres[x])
            
            # Get movies from favorite genre that user hasn't rated
            rated_movie_ids = [rating.movie_id for rating in user_ratings]
            recommendations = self.db.query(Movie).filter(
                Movie.genres.contains([top_genre]),
                ~Movie.id.in_(rated_movie_ids),
                Movie.rating >= 7.0
            ).order_by(Movie.rating.desc()).limit(limit).all()
            
            return recommendations
        
        return self.get_popular_recommendations(limit)