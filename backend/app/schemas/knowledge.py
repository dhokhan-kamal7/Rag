from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_path: str | None
    file_type: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentResponse