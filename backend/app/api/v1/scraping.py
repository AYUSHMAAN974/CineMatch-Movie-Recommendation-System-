from fastapi import APIRouter, BackgroundTasks
from celery.result import AsyncResult

from ...tasks.scraping_tasks import scrape_trending_movies, update_movie_details
from ...tasks.celery_app import celery_app

router = APIRouter()

@router.post("/trending")
def start_trending_scrape():
    task = scrape_trending_movies.delay()
    return {
        "message": "Trending movies scraping started",
        "task_id": task.id,
        "status": "started"
    }

@router.get("/task/{task_id}")
def get_task_status(task_id: str):
    task = AsyncResult(task_id, app=celery_app)
    
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Task is waiting to be processed'
        }
    elif task.state == 'PROGRESS':
        response = {
            'state': task.state,
            'status': task.info.get('status', ''),
            'progress': task.info.get('progress', 0)
        }
    elif task.state == 'SUCCESS':
        response = {
            'state': task.state,
            'result': task.result
        }
    else:
        response = {
            'state': task.state,
            'status': task.info.get('status', 'Unknown error')
        }
    
    return response

@router.post("/update-movie/{movie_id}")
def update_movie(movie_id: int):
    task = update_movie_details.delay(movie_id)
    return {
        "message": f"Movie {movie_id} update started",
        "task_id": task.id
    }