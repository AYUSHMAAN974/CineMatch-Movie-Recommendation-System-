from celery import current_task
from sqlalchemy.orm import Session
from ..tasks.celery_app import celery_app
from ..core.database import SessionLocal
from ..scrapers.tmdb_scraper import TMDBScraper
from ..models.movie import Movie
from ..services.movie_service import MovieService

@celery_app.task(bind=True)
def scrape_trending_movies(self):
    """Background task to scrape trending movies from TMDB"""
    try:
        db = SessionLocal()
        scraper = TMDBScraper()
        movie_service = MovieService(db)
        
        # Update task status
        current_task.update_state(state='PROGRESS', meta={'status': 'Fetching trending movies'})
        
        # Scrape trending movies
        trending_movies = scraper.get_trending_movies()
        
        processed = 0
        total = len(trending_movies)
        
        for movie_data in trending_movies:
            try:
                # Check if movie already exists
                existing_movie = db.query(Movie).filter(
                    Movie.tmdb_id == movie_data['tmdb_id']
                ).first()
                
                if not existing_movie:
                    # Get detailed information
                    detailed_data = scraper.get_movie_details(str(movie_data['tmdb_id']))
                    if detailed_data:
                        movie_service.create_movie(detailed_data)
                
                processed += 1
                
                # Update progress
                current_task.update_state(
                    state='PROGRESS',
                    meta={
                        'status': f'Processed {processed}/{total} movies',
                        'progress': int((processed / total) * 100)
                    }
                )
                
            except Exception as e:
                print(f"Failed to process movie: {e}")
                continue
        
        db.close()
        
        return {
            'status': 'completed',
            'processed': processed,
            'total': total,
            'message': f'Successfully processed {processed} movies'
        }
        
    except Exception as e:
        current_task.update_state(
            state='FAILURE',
            meta={'status': f'Task failed: {str(e)}'}
        )
        raise

@celery_app.task
def update_movie_details(movie_id: int):
    """Background task to update movie details"""
    try:
        db = SessionLocal()
        scraper = TMDBScraper()
        
        movie = db.query(Movie).filter(Movie.id == movie_id).first()
        if not movie or not movie.tmdb_id:
            return {'status': 'error', 'message': 'Movie not found or missing TMDB ID'}
        
        # Get updated details from TMDB
        updated_data = scraper.get_movie_details(str(movie.tmdb_id))
        if not updated_data:
            return {'status': 'error', 'message': 'Failed to fetch movie details'}
        
        # Update movie in database
        for key, value in updated_data.items():
            if hasattr(movie, key) and value is not None:
                setattr(movie, key, value)
        
        db.commit()
        db.close()
        
        return {'status': 'success', 'message': f'Updated movie: {movie.title}'}
        
    except Exception as e:
        return {'status': 'error', 'message': str(e)}