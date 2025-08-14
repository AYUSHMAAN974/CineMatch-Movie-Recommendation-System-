import requests
from bs4 import BeautifulSoup
from typing import Dict, Optional
from .base_scraper import BaseScraper

class IMDBScraper(BaseScraper):
    def __init__(self):
        super().__init__(delay=2.0)  # Longer delay for web scraping
        self.base_url = "https://www.imdb.com"
    
    def get_movie_details(self, imdb_id: str) -> Optional[Dict]:
        if not imdb_id.startswith('tt'):
            imdb_id = f"tt{imdb_id}"
        
        url = f"{self.base_url}/title/{imdb_id}/"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title_elem = soup.find('h1', {'data-testid': 'hero-title-block__title'})
            title = title_elem.text.strip() if title_elem else None
            
            # Extract rating
            rating_elem = soup.find('span', {'class': 'sc-bde20123-1'})
            rating = float(rating_elem.text.strip()) if rating_elem else None
            
            # Extract genres
            genres = []
            genre_elements = soup.find_all('span', {'class': 'ipc-chip__text'})
            for elem in genre_elements[:5]:  # Take first 5 genre chips
                genres.append(elem.text.strip())
            
            # Extract plot
            plot_elem = soup.find('span', {'data-testid': 'plot-xl'})
            plot = plot_elem.text.strip() if plot_elem else None
            
            return {
                'title': title,
                'overview': plot,
                'genres': genres,
                'rating': rating,
                'imdb_id': imdb_id
            }
            
        except Exception as e:
            print(f"IMDB scraping failed for {imdb_id}: {e}")
            return None
    
    def search_movies(self, query: str) -> list:
        # IMDB search is more complex, implementing basic version
        url = f"{self.base_url}/find/"
        params = {'q': query, 's': 'tt', 'ttype': 'ft'}
        
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            results = []
            result_elements = soup.find_all('tr', class_='findResult')[:10]
            
            for elem in result_elements:
                title_elem = elem.find('td', class_='result_text')
                if title_elem:
                    link = title_elem.find('a')
                    if link:
                        title = link.text.strip()
                        imdb_id = link['href'].split('/')[2]
                        results.append({
                            'title': title,
                            'imdb_id': imdb_id
                        })
            
            return results
            
        except Exception as e:
            print(f"IMDB search failed: {e}")
            return []