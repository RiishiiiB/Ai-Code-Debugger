from datetime import datetime

from pydantic import BaseModel


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

    model_config = {
        "from_attributes": True
    }