from pydantic import BaseModel


class Finding(BaseModel):
    type: str
    severity: str
    message: str
    line: int | None = None
    column: int | None = None