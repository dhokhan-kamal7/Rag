from pathlib import Path

from pypdf import PdfReader


def load_document(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Document not found: {file_path}")

    extension = path.suffix.lower()

    if extension == ".pdf":
        return _load_pdf(path)

    if extension == ".txt":
        return _load_text(path)

    if extension in {".html", ".htm"}:
        return _load_html(path)

    raise ValueError(f"Unsupported document type: {extension}")


def _load_pdf(path: Path) -> str:
    reader = PdfReader(str(path))

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n\n".join(pages).strip()


def _load_text(path: Path) -> str:
    return path.read_text(
        encoding="utf-8",
        errors="ignore"
    ).strip()


def _load_html(path: Path) -> str:
    from bs4 import BeautifulSoup

    html = path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    soup = BeautifulSoup(html, "html.parser")

    return soup.get_text(
        separator="\n",
        strip=True
    )