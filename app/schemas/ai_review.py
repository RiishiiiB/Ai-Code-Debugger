from pydantic import BaseModel


class AIReview(BaseModel):
    explanation: str
    concept: str
    why_it_matters: str
    hint: str

    model_config = {
        "from_attributes": True
    }