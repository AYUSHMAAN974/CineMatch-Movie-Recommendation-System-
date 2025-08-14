from typing import List, Dict, Any
import re
from datetime import datetime

def clean_text(text: str) -> str:
    """Clean and normalize text data"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\-\.,!?]', '', text)
    
    return text

def format_runtime(minutes: int) -> str:
    """Convert runtime minutes to human readable format"""
    if not minutes:
        return "Unknown"
    
    hours = minutes // 60
    mins = minutes % 60
    
    if hours > 0:
        return f"{hours}h {mins}m"
    else:
        return f"{mins}m"

def calculate_age_rating(genres: List[str], keywords: List[str]) -> str:
    """Estimate age rating based on genres and keywords"""
    adult_keywords = ['violence', 'blood', 'murder', 'war', 'crime']
    family_genres = ['Animation', 'Family', 'Adventure']
    
    if any(keyword.lower() in adult_keywords for keyword in keywords):
        return "R"
    elif any(genre in family_genres for genre in genres):
        return "G"
    else:
        return "PG-13"

def extract_year_from_date(date_str: str) -> int:
    """Extract year from date string"""
    if not date_str:
        return None
    
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").year
    except:
        # Try to extract year with regex
        match = re.search(r'(\d{4})', date_str)
        return int(match.group(1)) if match else None

def paginate_results(results: List[Any], page: int = 1, per_page: int = 20) -> Dict:
    """Paginate a list of results"""
    total = len(results)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "items": results[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }