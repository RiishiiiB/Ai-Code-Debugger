from celery import Celery

from app.services.celery_app import celery_app
from app.core.database import SessionLocal

from app.models.code_submission import CodeSubmission
from app.models.analysis_finding import AnalysisFinding
from app.models.ai_review import AIReview
from app.models.user import User
from app.services.gemini_service import generate_review


@celery_app.task
def process_ai_review(submission_id: int):
    db = SessionLocal()

    try:
        submission = db.get(CodeSubmission, submission_id)

        if submission is None:
            return "Submission not found"

        findings = (
            db.query(AnalysisFinding)
            .filter(
                AnalysisFinding.submission_id == submission_id
            )
            .all()
        )

        ai_review = generate_review(
            submission.code,
            findings,
        )

        db_ai_review = AIReview(
            submission_id=submission.id,
            explanation=ai_review.explanation,
            concept=ai_review.concept,
            why_it_matters=ai_review.why_it_matters,
            hint=ai_review.hint,
        )

        db.add(db_ai_review)

        submission.status = "completed"

        db.commit()

        return "AI review completed"

    except Exception:
        db.rollback()

        submission = db.get(CodeSubmission, submission_id)

        if submission:
            submission.status = "failed"
            db.commit()

        raise

    finally:
        db.close()