from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class AIReview(Base):
    __tablename__ = "ai_reviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    submission_id: Mapped[int] = mapped_column(
        ForeignKey("code_submissions.id"),
        nullable=False,
        unique=True,
    )

    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    concept: Mapped[str] = mapped_column(Text, nullable=False)
    why_it_matters: Mapped[str] = mapped_column(Text, nullable=False)
    hint: Mapped[str] = mapped_column(Text, nullable=False)