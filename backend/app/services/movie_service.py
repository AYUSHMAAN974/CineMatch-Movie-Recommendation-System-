from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.movie import Movie
from ..schemas.movie import MovieCreate

class MovieService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_movie(self, movie_id: int) -> Optional[Movie]:
        return self.db.query(Movie).filter(Movie.id == movie_id).first()
    
    def get_movies(self, skip: int = 0, limit: int = 20) -> List[Movie]:
        return self.db.query(Movie).offset(skip).limit(limit).all()
    
    def get_movies_by_genre(self, genre: str, limit: int = 20) -> List[Movie]:
        return self.db.query(Movie).filter(
            Movie.genres.contains([genre])
        ).limit(limit).all()
    
    def search_movies(self, query: str, limit: int = 20) -> List[Movie]:
        return self.db.query(Movie).filter(
            Movie.title.ilike(f"%{query}%")
        ).limit(limit).all()
    
    def create_movie(self, movie: MovieCreate) -> Movie:
        db_movie = Movie(**movie.dict())
        self.db.add(db_movie)
        self.db.commit()
        self.db.refresh(db_movie)
        return db_movie
    
    def get_trending_movies(self, limit: int = 20) -> List[Movie]:
        return self.db.query(Movie).order_by(
            Movie.vote_count.desc()
        ).limit(limit).all()