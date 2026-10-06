from pathlib import Path

from app.core.config import settings


ALLOWED_FILE_TYPES = {
    ".pdf",
    ".txt",
    ".html",
    ".htm"
}


def validate_file_extension(filename: str) -> bool:
    extension = Path(filename).suffix.lower()
    return extension in ALLOWED_FILE_TYPES


def validate_file_size(file_size: int) -> bool:
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    return file_size <= max_size


def validate_chat_message(message: str) -> str:
    message = message.strip()

    if not message:
        raise ValueError("Chat message cannot be empty.")

    if len(message) > 5000:
        raise ValueError("Chat message is too long.")

    return message