from celery import Celery

celery_app = Celery(
    "ai_code_debugger",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["app.services.ai_tasks"],
)