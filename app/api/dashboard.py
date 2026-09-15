from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.dashboard import DashboardStats
from app.models.code_submission import CodeSubmission
from app.models.analysis_finding import AnalysisFinding
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)
@router.get(
    "/stats",
    response_model=DashboardStats,
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    total_submissions = (
        db.query(CodeSubmission)
        .filter(CodeSubmission.user_id == current_user_id)
        .count()
    )
    completed_reviews = (
        db.query(CodeSubmission)
        .filter(
            CodeSubmission.user_id == current_user_id,
            CodeSubmission.status == "completed",
        )
        .count()
    )

    processing_reviews = (
        db.query(CodeSubmission)
        .filter(
            CodeSubmission.user_id == current_user_id,
            CodeSubmission.status == "processing",
        )
        .count()
    )

    failed_reviews = (
        db.query(CodeSubmission)
        .filter(
            CodeSubmission.user_id == current_user_id,
            CodeSubmission.status == "failed",
        )
        .count()
    )

    total_findings = (
        db.query(AnalysisFinding)
        .join(CodeSubmission)
        .filter(CodeSubmission.user_id == current_user_id)
        .count()
    )

    return DashboardStats(
        total_submissions=total_submissions,
        completed_reviews=completed_reviews,
        processing_reviews=processing_reviews,
        failed_reviews=failed_reviews,
        total_findings=total_findings,
    )