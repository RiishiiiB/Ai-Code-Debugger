from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user

from app.models.code_submission import CodeSubmission
from app.models.analysis_finding import AnalysisFinding
from app.models.ai_review import AIReview

from app.schemas.code_submission import (
    CodeSubmissionCreate,
    CodeSubmissionResponse,
)

from app.services.analysis_service import analyze_code
from app.services.gemini_service import generate_review


router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"],
)


@router.post(
    "/",
    response_model=CodeSubmissionResponse,
    status_code=201,
)
def create_submission(
    submission: CodeSubmissionCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    new_submission = CodeSubmission(
        user_id=current_user_id,
        code=submission.code,
        language=submission.language,
    )

    db.add(new_submission)
    db.flush()

    findings = analyze_code(
        submission.code,
        submission.language,
    )

    for finding in findings:
        db.add(
            AnalysisFinding(
                submission_id=new_submission.id,
                type=finding.type,
                severity=finding.severity,
                message=finding.message,
                line=finding.line,
                column=finding.column,
            )
        )

    db.commit()
    db.refresh(new_submission)

    ai_review = generate_review(
        submission.code,
        findings,
    )

    db_ai_review = AIReview(
        submission_id=new_submission.id,
        explanation=ai_review.explanation,
        concept=ai_review.concept,
        why_it_matters=ai_review.why_it_matters,
        hint=ai_review.hint,
    )

    db.add(db_ai_review)

    new_submission.status = "completed"

    db.commit()
    db.refresh(new_submission)
    db.refresh(db_ai_review)

    return {
        "id": new_submission.id,
        "user_id": new_submission.user_id,
        "code": new_submission.code,
        "language": new_submission.language,
        "status": new_submission.status,
        "created_at": new_submission.created_at,
        "findings": findings,
        "ai_review": db_ai_review,
    }


@router.get(
    "/{submission_id}",
    response_model=CodeSubmissionResponse,
)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    result = db.execute(
        select(CodeSubmission).where(
            CodeSubmission.id == submission_id,
            CodeSubmission.user_id == current_user_id,
        )
    )

    submission = result.scalar_one_or_none()

    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    findings = db.execute(
        select(AnalysisFinding).where(
            AnalysisFinding.submission_id == submission_id
        )
    ).scalars().all()

    ai_review = db.execute(
        select(AIReview).where(
            AIReview.submission_id == submission_id
        )
    ).scalar_one_or_none()

    return {
        "id": submission.id,
        "user_id": submission.user_id,
        "code": submission.code,
        "language": submission.language,
        "status": submission.status,
        "created_at": submission.created_at,
        "findings": findings,
        "ai_review": ai_review,
    }