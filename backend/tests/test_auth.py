from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_register_user():
    email = "test_auth_user@example.com"
    password = "testpassword123"

    response = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    assert response.status_code in [201, 400]


def test_login_user():
    email = "test_auth_user@example.com"
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

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_protected_endpoint_without_token():
    response = client.get("/chat/sessions")

    assert response.status_code == 401


print("Authentication tests configured successfully.")