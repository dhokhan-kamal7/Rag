import logging
import os

from app.core.config import settings


def setup_logging() -> None:
    os.makedirs("logs", exist_ok=True)

    log_format = (
        "%(asctime)s | %(levelname)s | "
        "%(name)s | %(message)s"
    )

    logging.basicConfig(
        level=logging.DEBUG if settings.DEBUG else logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler(
                "logs/backend.log",
                encoding="utf-8"
            ),
            logging.StreamHandler()
        ]
    )