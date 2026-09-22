from datetime import datetime, timezone

from sqlalchemy import Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class LearningAttempt(Base):
    __tablename__ = "learning_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)

    submission_id: Mapped[int] = mapped_column(
        ForeignKey("code_submissions.id"),
        nullable=False,
    )

    thinking: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    attempted_code: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    fixed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )