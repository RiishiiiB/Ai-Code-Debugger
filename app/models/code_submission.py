from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.models.base import Base


class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
    ForeignKey("users.id"),
    nullable=False,
)

    code: Mapped[str] = mapped_column(Text, nullable=False)

    language: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="pending",
    )
    created_at: Mapped[datetime] = mapped_column(
    default=datetime.utcnow,
    nullable=False,
)