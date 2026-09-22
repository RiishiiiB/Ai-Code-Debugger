"""add fixed status to learning attempts

Revision ID: c813c3c601e2
Revises: f4262a5bbd28
Create Date: 2026-09-22
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c813c3c601e2"
down_revision: Union[str, Sequence[str], None] = "f4262a5bbd28"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "learning_attempts",
        sa.Column(
            "fixed",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.alter_column(
        "learning_attempts",
        "fixed",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column(
        "learning_attempts",
        "fixed",
    )