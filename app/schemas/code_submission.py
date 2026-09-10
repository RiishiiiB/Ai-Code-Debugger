from datetime import datetime

from pydantic import BaseModel
from app.schemas.finding import Finding

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

    model_config = {
        "from_attributes": True
    }