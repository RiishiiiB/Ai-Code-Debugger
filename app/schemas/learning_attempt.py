from datetime import datetime

from pydantic import BaseModel

from app.schemas.finding import Finding


class LearningFeedbackResponse(BaseModel):
    understanding: str
    missed_concept: str
    better_thinking: str
    reinforcement: str


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
    feedback: LearningFeedbackResponse | None = None

    model_config = {"from_attributes": True}