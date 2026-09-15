from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_submissions: int
    completed_reviews: int
    processing_reviews: int
    failed_reviews: int
    total_findings: int