from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.database.database import get_db
from app.database.models import User
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    MessageResponse,
    SessionResponse,
)
from app.services.chat_service import (
    add_message,
    create_chat_session,
    get_chat_session,
    get_session_messages,
    get_user_sessions,
)
from app.rag.rag_pipeline import generate_rag_response


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/message",
    response_model=ChatResponse
)
def send_message(
    chat_data: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if chat_data.session_id:
        session = get_chat_session(
            db=db,
            session_id=chat_data.session_id,
            user_id=current_user.id
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found."
            )
    else:
        session = create_chat_session(
            db=db,
            user_id=current_user.id,
            title=chat_data.message[:100]
        )

    add_message(
        db=db,
        session_id=session.id,
        role="user",
        content=chat_data.message
    )

    previous_messages = get_session_messages(
        db=db,
        session_id=session.id
    )

    conversation_history = "\n".join(
        f"{message.role}: {message.content}"
        for message in previous_messages[:-1]
    )

    try:
        response = generate_rag_response(
            query=chat_data.message,
            conversation_history=conversation_history
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(error)}"
        )

    add_message(
        db=db,
        session_id=session.id,
        role="assistant",
        content=response
    )

    return ChatResponse(
        response=response,
        session_id=session.id
    )


@router.get(
    "/sessions",
    response_model=list[SessionResponse]
)
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_sessions(
        db=db,
        user_id=current_user.id
    )


@router.get(
    "/sessions/{session_id}/messages",
    response_model=list[MessageResponse]
)
def get_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = get_chat_session(
        db=db,
        session_id=session_id,
        user_id=current_user.id
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found."
        )

    return get_session_messages(
        db=db,
        session_id=session_id
    )