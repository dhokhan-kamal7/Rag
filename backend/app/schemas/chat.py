from datetime import datetime

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    session_id: int | None = None


class ChatResponse(BaseModel):
    response: str
    session_id: int


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class SessionResponse(BaseModel):
    id: int
    title: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }