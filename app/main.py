import os

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("APP_ENV"),
    }