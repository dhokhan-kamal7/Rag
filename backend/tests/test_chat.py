from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_user_token():
    email = "test_chat_user@example.com"
    password = "testpassword123"

    client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    return response.json()["access_token"]


def test_get_sessions_requires_authentication():
    response = client.get("/chat/sessions")

    assert response.status_code == 401


def test_chat_session_creation():
    token = get_user_token()

    response = client.post(
        "/chat/message",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "message": "What is the capital of France?"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "response" in data
    assert "session_id" in data
    assert isinstance(data["session_id"], int)


def test_get_user_sessions():
    token = get_user_token()

    response = client.get(
        "/chat/sessions",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


print("Chat tests configured successfully.")