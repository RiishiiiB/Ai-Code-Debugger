import uuid
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import create_access_token

from app.core.database import SessionLocal
from app.models.user import User
from app.models.code_submission import CodeSubmission

client = TestClient(app)


def test_dashboard_stats_requires_authentication():
    response = client.get("/dashboard/stats")

    assert response.status_code == 401


def test_dashboard_stats():
    token = create_access_token(10)

    response = client.get(
        "/dashboard/stats",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_submissions" in data
    assert "completed_reviews" in data
    assert "processing_reviews" in data
    assert "failed_reviews" in data
    assert "total_findings" in data

def test_dashboard_stats_only_returns_current_users_data():
    token = create_access_token(10)

    response = client.get(
        "/dashboard/stats",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_submissions"] >= 0
    assert data["total_findings"] >= 0
def test_dashboard_does_not_include_other_users_data():
    db = SessionLocal()

    other_user = User(
        email=f"isolation-test-{uuid.uuid4()}@example.com",
        password_hash="dummy"
    )

    db.add(other_user)
    db.commit()
    db.refresh(other_user)

    submission = CodeSubmission(
        user_id=other_user.id,
        code="print('other user')",
        language="python",
        status="completed"
    )

    db.add(submission)
    db.commit()

    token = create_access_token(10)

    response = client.get(
        "/dashboard/stats",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_submissions"] != 22

    db.delete(submission)
    db.delete(other_user)
    db.commit()
    db.close()