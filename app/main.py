import os

from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.users import router as users_router
from app.api.submissions import router as submissions_router
load_dotenv()

app = FastAPI()
app.include_router(users_router)
app.include_router(submissions_router)
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("APP_ENV"),
    }