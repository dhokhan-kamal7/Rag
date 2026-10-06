from app.core.config import settings
from app.rag.vector_store import search_documents


def retrieve_relevant_documents(
    query: str,
    top_k: int | None = None
) -> list[dict]:
    if not query.strip():
        return []

    if top_k is None:
        top_k = settings.RAG_TOP_K

    results = search_documents(
        query=query,
        top_k=top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    relevant_documents = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):
        similarity = 1 - distance

        if similarity >= settings.RAG_SIMILARITY_THRESHOLD:
            relevant_documents.append({
                "content": document,
                "metadata": metadata,
                "similarity": similarity
            })

    return relevant_documents