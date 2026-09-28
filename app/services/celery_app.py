import os

from celery import Celery
from dotenv import load_dotenv


load_dotenv()


CELERY_BROKER_URL = os.getenv(
    "CELERY_BROKER_URL",
)

CELERY_RESULT_BACKEND = os.getenv(
    "CELERY_RESULT_BACKEND",
)


if not CELERY_BROKER_URL:
    raise RuntimeError(
        "CELERY_BROKER_URL is not configured"
    )

if not CELERY_RESULT_BACKEND:
    raise RuntimeError(
        "CELERY_RESULT_BACKEND is not configured"
    )


celery_app = Celery(
    "ai_code_debugger",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["app.services.ai_tasks"],
)