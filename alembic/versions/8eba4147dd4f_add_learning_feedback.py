"""add learning feedback

Revision ID: 8eba4147dd4f
Revises: c813c3c601e2
Create Date: 2026-09-22
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8eba4147dd4f"
down_revision: Union[str, Sequence[str], None] = "c813c3c601e2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "learning_feedback",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("attempt_id", sa.Integer(), nullable=False),
        sa.Column("understanding", sa.Text(), nullable=False),
        sa.Column("missed_concept", sa.Text(), nullable=False),
        sa.Column("better_thinking", sa.Text(), nullable=False),
        sa.Column("reinforcement", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["attempt_id"],
            ["learning_attempts.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("attempt_id"),
    )


def downgrade() -> None:
    op.drop_table("learning_feedback")