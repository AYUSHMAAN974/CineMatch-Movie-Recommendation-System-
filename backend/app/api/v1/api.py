from fastapi import APIRouter
from .auth import router as auth_router
from .movies import router as movies_router  
from .ratings import router as ratings_router

api_router = APIRouter()

# Include only the routes you need for TMDB API
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(ratings_router, prefix="/ratings", tags=["ratings"])