from fastapi import APIRouter
from .auth import router as auth_router
from .movies import router as movies_router
from .ratings import router as ratings_router
from .recommendations import router as recommendations_router
from .scraping import router as scraping_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(ratings_router, prefix="/ratings", tags=["ratings"])
api_router.include_router(recommendations_router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(scraping_router, prefix="/scraping", tags=["scraping"])