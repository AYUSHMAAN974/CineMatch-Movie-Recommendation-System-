import requests
import time
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

class BaseScraper(ABC):
    def __init__(self, api_key: Optional[str] = None, delay: float = 1.0):
        self.api_key = api_key
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'CineMatch/1.0.0 (Movie Recommendation Platform)'
        })
    
    def _make_request(self, url: str, params: Dict = None) -> Optional[Dict[Any, Any]]:
        try:
            time.sleep(self.delay)  # Rate limiting
            response = self.session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    @abstractmethod
    def get_movie_details(self, movie_id: str) -> Optional[Dict]:
        pass
    
    @abstractmethod
    def search_movies(self, query: str) -> list:
        pass