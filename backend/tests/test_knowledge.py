from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_admin_token():
    email = "test_knowledge_admin@example.com"
    password = "testpassword123"

    client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    from app.database.database import SessionLocal
    from app.database.models import User

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == email
        ).first()

        user.is_admin = 1
        db.commit()
    finally:
        db.close()

    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    return response.json()["access_token"]


def test_list_documents_requires_admin():
    token = get_admin_token()

    response = client.get(
        "/knowledge/documents",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200


def test_upload_text_document():
    token = get_admin_token()

    response = client.post(
        "/knowledge/upload",
        headers={
            "Authorization": f"Bearer {token}"
        },
        files={
            "file": (
                "test_knowledge.txt",
                "Our company was founded in 2020.",
                "text/plain"
            )
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "document" in data
    assert data["document"]["filename"] == "test_knowledge.txt"
    assert data["document"]["status"] == "processed"


print("Knowledge base tests configured successfully.")