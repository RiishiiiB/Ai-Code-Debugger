from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.code_submission import CodeSubmission
from app.models.learning_attempt import LearningAttempt
from app.schemas.learning_attempt import (
    LearningAttemptCreate,
    LearningAttemptResponse,
)
from app.services.learning_service import analyze_learning_attempt


router = APIRouter(
    prefix="/learning",
    tags=["Learning"],
)


@router.post(
    "/attempts",
    response_model=LearningAttemptResponse,
    status_code=201,
)
def create_learning_attempt(
    attempt: LearningAttemptCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    submission = db.get(
        CodeSubmission,
        attempt.submission_id,
    )

    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    if submission.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this submission",
        )

    # Analyze the learner's attempted code
    findings = analyze_learning_attempt(
        attempt.attempted_code,
        submission.language,
    )

    # The attempt is considered fixed when
    # the analyzer finds no remaining issues.
    fixed = len(findings) == 0

    new_attempt = LearningAttempt(
        submission_id=attempt.submission_id,
        thinking=attempt.thinking,
        attempted_code=attempt.attempted_code,
        fixed=fixed,
    )

    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return {
        "id": new_attempt.id,
        "submission_id": new_attempt.submission_id,
        "thinking": new_attempt.thinking,
        "attempted_code": new_attempt.attempted_code,
        "created_at": new_attempt.created_at,
        "fixed": fixed,
        "remaining_findings": findings,
    }