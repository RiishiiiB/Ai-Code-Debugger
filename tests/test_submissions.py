from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_submission_requires_authentication():
    response = client.post(
        "/submissions/",
        json={
            "code": "print('hello')",
            "language": "python",
        },
    )

    assert response.status_code == 401
from app.core.security import create_access_token


def test_create_submission():
    token = create_access_token(10)

    response = client.post(
        "/submissions/",
        json={
            "code": "x = 10\nprint(x)",
            "language": "python",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201

    data = response.json()

    assert data["user_id"] == 10
    assert data["code"] == "x = 10\nprint(x)"
    assert data["language"] == "python"
    assert data["status"] == "processing"