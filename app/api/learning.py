from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.analysis_finding import AnalysisFinding
from app.models.code_submission import CodeSubmission
from app.models.learning_attempt import LearningAttempt
from app.models.learning_feedback import LearningFeedback
from app.schemas.learning_attempt import (
    LearningAttemptCreate,
    LearningAttemptResponse,
)
from app.services.learning_service import analyze_learning_attempt
from app.services.learning_feedback_service import generate_learning_feedback


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
    # ---------------------------------------------------------
    # 1. Find the original submission
    # ---------------------------------------------------------

    submission = db.get(
        CodeSubmission,
        attempt.submission_id,
    )

    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    # ---------------------------------------------------------
    # 2. Verify ownership
    # ---------------------------------------------------------

    if submission.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this submission",
        )

    # ---------------------------------------------------------
    # 3. Analyze the learner's attempted code
    # ---------------------------------------------------------

    findings = analyze_learning_attempt(
        attempt.attempted_code,
        submission.language,
    )

    fixed = len(findings) == 0

    # ---------------------------------------------------------
    # 4. Save the learning attempt
    # ---------------------------------------------------------

    new_attempt = LearningAttempt(
        submission_id=attempt.submission_id,
        thinking=attempt.thinking,
        attempted_code=attempt.attempted_code,
        fixed=fixed,
    )

    db.add(new_attempt)

    # Flush so SQLAlchemy generates the attempt ID
    # before we create the feedback record.
    db.flush()

    # ---------------------------------------------------------
    # 5. Get the original static-analysis findings
    # ---------------------------------------------------------

    original_findings = (
        db.query(AnalysisFinding)
        .filter(
            AnalysisFinding.submission_id
            == attempt.submission_id
        )
        .all()
    )

    # ---------------------------------------------------------
    # 6. Generate AI learning feedback
    # ---------------------------------------------------------

    feedback_data = generate_learning_feedback(
        thinking=attempt.thinking,
        attempted_code=attempt.attempted_code,
        findings=original_findings,
    )

    # ---------------------------------------------------------
    # 7. Save AI feedback
    # ---------------------------------------------------------

    feedback = LearningFeedback(
        attempt_id=new_attempt.id,
        understanding=feedback_data["understanding"],
        missed_concept=feedback_data["missed_concept"],
        better_thinking=feedback_data["better_thinking"],
        reinforcement=feedback_data["reinforcement"],
    )

    db.add(feedback)

    db.commit()

    db.refresh(new_attempt)
    db.refresh(feedback)

    # ---------------------------------------------------------
    # 8. Return the complete learning result
    # ---------------------------------------------------------

    return {
        "id": new_attempt.id,
        "submission_id": new_attempt.submission_id,
        "thinking": new_attempt.thinking,
        "attempted_code": new_attempt.attempted_code,
        "created_at": new_attempt.created_at,
        "fixed": fixed,
        "remaining_findings": findings,
        "feedback": {
            "understanding": feedback.understanding,
            "missed_concept": feedback.missed_concept,
            "better_thinking": feedback.better_thinking,
            "reinforcement": feedback.reinforcement,
        },
    }