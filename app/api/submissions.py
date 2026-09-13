from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user

from app.models.ai_review import AIReview
from app.models.code_submission import CodeSubmission
from app.models.analysis_finding import AnalysisFinding

from app.services.ai_tasks import process_ai_review
from app.services.analysis_service import analyze_code

from app.schemas.code_submission import (
    CodeSubmissionCreate,
    CodeSubmissionResponse,
    CodeSubmissionListItem,
)


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
        status="processing",
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

    process_ai_review.delay(new_submission.id)

    return {
        "id": new_submission.id,
        "user_id": new_submission.user_id,
        "code": new_submission.code,
        "language": new_submission.language,
        "status": new_submission.status,
        "created_at": new_submission.created_at,
        "findings": findings,
        "ai_review": None,
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

    findings = (
        db.execute(
            select(AnalysisFinding).where(
                AnalysisFinding.submission_id == submission_id
            )
        )
        .scalars()
        .all()
    )

    ai_review = (
        db.execute(
            select(AIReview).where(
                AIReview.submission_id == submission_id
            )
        )
        .scalar_one_or_none()
    )

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
@router.get(
    "/",
    response_model=list[CodeSubmissionListItem],
)
def list_submissions(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    result = db.execute(
        select(CodeSubmission)
        .where(CodeSubmission.user_id == current_user_id)
        .order_by(CodeSubmission.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    return result.scalars().all()