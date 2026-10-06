from sentence_transformers import SentenceTransformer

from app.core.config import settings


_model = None


def get_embedding_model() -> SentenceTransformer:
    global _model

    if _model is None:
        _model = SentenceTransformer(
            settings.EMBEDDING_MODEL
        )

    return _model


def generate_embeddings(
    texts: list[str]
) -> list[list[float]]:
    if not texts:
        return []

    model = get_embedding_model()

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embeddings.tolist()


def generate_query_embedding(
    query: str
) -> list[float]:
    if not query.strip():
        raise ValueError("Query cannot be empty.")

    return generate_embeddings([query])[0]