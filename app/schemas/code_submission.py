from datetime import datetime

from pydantic import BaseModel
from app.schemas.finding import Finding
from app.schemas.ai_review import AIReview
class CodeSubmissionCreate(BaseModel):
    code: str
    language: str

class CodeSubmissionResponse(BaseModel):
    id: int
    user_id: int
    code: str
    language: str
    status: str
    created_at: datetime
    findings: list[Finding]
    ai_review: AIReview | None = None

    model_config = {
        "from_attributes": True
    }
class CodeSubmissionListItem(BaseModel):
    id: int
    language: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }