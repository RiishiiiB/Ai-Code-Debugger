from fastapi import APIRouter
from fastapi import Depends
from app.models.analysis_finding import AnalysisFinding
from sqlalchemy.orm import Session
from app.services.analysis_service import analyze_code
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.code_submission import (
    CodeSubmissionCreate,
    CodeSubmissionResponse,
)
from app.models.code_submission import CodeSubmission
from sqlalchemy import select
from fastapi import HTTPException


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
    findings = []

    findings = analyze_code(
    submission.code,
    submission.language,
)

    db.add(new_submission)
    db.flush()

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

    return {
        **new_submission.__dict__,
        "findings": findings,
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

    return {
        **submission.__dict__,
        "findings": findings,
    }