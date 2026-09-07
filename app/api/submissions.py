from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.code_submission import (
    CodeSubmissionCreate,
    CodeSubmissionResponse,
)
from app.models.code_submission import CodeSubmission



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
    db.commit()
    db.refresh(new_submission)

    return new_submission