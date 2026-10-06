import os

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models import Document
from app.utils.validators import validate_file_extension, validate_file_size


def save_document(
    db: Session,
    file: UploadFile
) -> Document:
    filename = file.filename or "unknown"

    if not validate_file_extension(filename):
        raise ValueError("Unsupported file type.")

    file_content = file.file.read()

    if not validate_file_size(len(file_content)):
        raise ValueError(
            f"File size exceeds {settings.MAX_UPLOAD_SIZE_MB} MB."
        )

    documents_dir = "data/documents"
    os.makedirs(documents_dir, exist_ok=True)

    file_path = os.path.join(documents_dir, filename)

    with open(file_path, "wb") as output_file:
        output_file.write(file_content)

    extension = os.path.splitext(filename)[1].lower()

    document = Document(
        filename=filename,
        file_path=file_path,
        file_type=extension,
        status="uploaded"
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_documents(db: Session) -> list[Document]:
    return db.query(Document).order_by(
        Document.created_at.desc()
    ).all()


def get_document(
    db: Session,
    document_id: int
) -> Document | None:
    return db.query(Document).filter(
        Document.id == document_id
    ).first()


def delete_document(
    db: Session,
    document_id: int
) -> bool:
    document = get_document(db, document_id)

    if not document:
        return False

    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return True