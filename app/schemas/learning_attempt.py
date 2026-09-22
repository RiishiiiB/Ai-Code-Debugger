from datetime import datetime

from pydantic import BaseModel

from app.schemas.finding import Finding


class LearningAttemptCreate(BaseModel):
    submission_id: int
    thinking: str
    attempted_code: str


class LearningAttemptResponse(BaseModel):
    id: int
    submission_id: int
    thinking: str
    attempted_code: str
    created_at: datetime
    fixed: bool
    remaining_findings: list[Finding]

    model_config = {"from_attributes": True}