from typing import Dict, Any, Optional, List
from ..core.config import settings
from .base_scraper import BaseScraper

class TMDBScraper(BaseScraper):
    def __init__(self):
        super().__init__(api_key=settings.TMDB_API_KEY, delay=0.25)
        self.base_url = "https://api.themoviedb.org/3"
    
    def get_movie_details(self, movie_id: str) -> Optional[Dict]:
        url = f"{self.base_url}/movie/{movie_id}"
        params = {
            'api_key': self.api_key,
            'append_to_response': 'credits,keywords'
        }
        
        data = self._make_request(url, params)
        if not data:
            return None
        
        # Extract cast (top 10)
        cast = []
        if 'credits' in data and 'cast' in data['credits']:
            cast = [actor['name'] for actor in data['credits']['cast'][:10]]
        
        # Extract director
        director = None
        if 'credits' in data and 'crew' in data['credits']:
            for person in data['credits']['crew']:
                if person['job'] == 'Director':
                    director = person['name']
                    break
        
        # Extract keywords
        keywords = []
        if 'keywords' in data and 'keywords' in data['keywords']:
            keywords = [kw['name'] for kw in data['keywords']['keywords'][:20]]
        
        # Format movie data
        return {
            'title': data.get('title'),
            'overview': data.get('overview'),
            'release_date': data.get('release_date'),
            'runtime': data.get('runtime'),
            'genres': [g['name'] for g in data.get('genres', [])],
            'rating': data.get('vote_average'),
            'vote_count': data.get('vote_count'),
            'poster_path': data.get('poster_path'),
            'backdrop_path': data.get('backdrop_path'),
            'tmdb_id': data.get('id'),
            'imdb_id': data.get('imdb_id'),
            'director': director,
            'cast': cast,
            'keywords': keywords
        }
    
    def search_movies(self, query: str) -> List[Dict]:
        url = f"{self.base_url}/search/movie"
        params = {
            'api_key': self.api_key,
            'query': query
        }
        
        data = self._make_request(url, params)
        if not data or 'results' not in data:
            return []
        
        movies = []
        for movie in data['results'][:20]:  # Top 20 results
            movies.append({
                'title': movie.get('title'),
                'overview': movie.get('overview'),
                'release_date': movie.get('release_date'),
                'rating': movie.get('vote_average'),
                'vote_count': movie.get('vote_count'),
                'poster_path': movie.get('poster_path'),
                'tmdb_id': movie.get('id'),
            })
        
        return movies
    
    def get_trending_movies(self, time_window: str = "week") -> List[Dict]:
        url = f"{self.base_url}/trending/movie/{time_window}"
        params = {'api_key': self.api_key}
        
        data = self._make_request(url, params)
        if not data or 'results' not in data:
            return []
        
        return [self._format_movie_basic(movie) for movie in data['results']]
    
    def get_popular_movies(self, page: int = 1) -> List[Dict]:
        url = f"{self.base_url}/movie/popular"
        params = {
            'api_key': self.api_key,
            'page': page
        }
        
        data = self._make_request(url, params)
        if not data or 'results' not in data:
            return []
        
        return [self._format_movie_basic(movie) for movie in data['results']]
    
    def _format_movie_basic(self, movie: Dict) -> Dict:
        return {
            'title': movie.get('title'),
            'overview': movie.get('overview'),
            'release_date': movie.get('release_date'),
            'rating': movie.get('vote_average'),
            'vote_count': movie.get('vote_count'),
            'poster_path': movie.get('poster_path'),
            'backdrop_path': movie.get('backdrop_path'),
            'tmdb_id': movie.get('id'),
        }