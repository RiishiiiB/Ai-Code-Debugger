from app.services.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.user import User
from app.models.code_submission import CodeSubmission
from app.models.analysis_finding import AnalysisFinding
from app.models.ai_review import AIReview
from app.services.gemini_service import generate_review


@celery_app.task(
    bind=True,
    max_retries=3,
)
def process_ai_review(self, submission_id: int):
    db = SessionLocal()

    try:
        submission = db.get(
            CodeSubmission,
            submission_id,
        )

        if submission is None:
            return "Submission not found"

        # Prevent duplicate AI reviews if a retry happens
        # after a previous attempt already committed.
        existing_review = (
            db.query(AIReview)
            .filter(
                AIReview.submission_id == submission_id
            )
            .first()
        )

        if existing_review is not None:
            submission.status = "completed"
            db.commit()
            return "AI review already exists"

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

    except Exception as exc:
        db.rollback()

        submission = db.get(
            CodeSubmission,
            submission_id,
        )

        if submission is None:
            raise

        if self.request.retries < self.max_retries:
            submission.status = "processing"
            db.commit()

            # IMPORTANT:
            # self.retry() raises Celery's Retry exception.
            # It is intentionally outside another try/except block
            # so we don't accidentally catch it.
            raise self.retry(
                exc=exc,
                countdown=2 ** self.request.retries,
            )

        # All retries exhausted.
        submission.status = "failed"
        db.commit()

        raise

    finally:
        db.close()