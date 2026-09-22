from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class LearningFeedback(Base):
    __tablename__ = "learning_feedback"

    id: Mapped[int] = mapped_column(primary_key=True)

    attempt_id: Mapped[int] = mapped_column(
        ForeignKey("learning_attempts.id"),
        nullable=False,
        unique=True,
    )

    understanding: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    missed_concept: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    better_thinking: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    reinforcement: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )