from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.database.database import get_db
from app.database.models import User
from app.rag.document_loader import load_document
from app.rag.text_splitter import split_text
from app.rag.vector_store import add_documents, delete_document_chunks
from app.schemas.knowledge import (
    DocumentResponse,
    DocumentUploadResponse,
)
from app.services.knowledge_service import (
    delete_document,
    get_document,
    get_documents,
    save_document,
)


router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge Base"]
)


def require_admin(current_user: User) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required."
        )

    return current_user


@router.post(
    "/upload",
    response_model=DocumentUploadResponse
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)

    try:
        document = save_document(
            db=db,
            file=file
        )

        text = load_document(document.file_path)

        chunks = split_text(text)

        if not chunks:
            document.status = "failed"
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="No readable text found in the document."
            )

        add_documents(
            document_id=document.id,
            chunks=chunks
        )

        document.status = "processed"
        db.commit()
        db.refresh(document)

        return DocumentUploadResponse(
            message="Document uploaded and processed successfully.",
            document=document
        )

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(error)}"
        )


@router.get(
    "/documents",
    response_model=list[DocumentResponse]
)
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)

    return get_documents(db)


@router.delete(
    "/documents/{document_id}"
)
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)

    document = get_document(
        db=db,
        document_id=document_id
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    delete_document_chunks(document_id)

    deleted = delete_document(
        db=db,
        document_id=document_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "message": "Document deleted successfully."
    }