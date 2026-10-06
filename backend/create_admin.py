from getpass import getpass

from app.core.security import hash_password
from app.database.database import SessionLocal
from app.database.models import User


def create_admin():
    email = input("Enter admin email: ").strip()
    password = getpass("Enter admin password: ")

    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            existing_user.is_admin = 1
            existing_user.password_hash = hash_password(password)
            db.commit()

            print("Existing user promoted to admin successfully.")
            return

        admin = User(
            email=email,
            password_hash=hash_password(password),
            is_admin=1
        )

        db.add(admin)
        db.commit()

        print("Admin user created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()