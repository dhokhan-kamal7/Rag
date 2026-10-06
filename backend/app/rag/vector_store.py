import os
from typing import Any

import chromadb

from app.core.config import settings
from app.rag.embeddings import generate_embeddings


_collection = None


def get_collection():
    global _collection

    if _collection is None:
        os.makedirs(
            settings.CHROMA_PERSIST_DIRECTORY,
            exist_ok=True
        )

        client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY
        )

        _collection = client.get_or_create_collection(
            name="knowledge_base",
            metadata={
                "hnsw:space": "cosine"
            }
        )

    return _collection


def add_documents(
    document_id: int,
    chunks: list[str]
) -> None:
    if not chunks:
        return

    collection = get_collection()

    embeddings = generate_embeddings(chunks)

    ids = [
        f"doc_{document_id}_chunk_{index}"
        for index in range(len(chunks))
    ]

    metadatas = [
        {
            "document_id": str(document_id),
            "chunk_index": index
        }
        for index in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )


def search_documents(
    query: str,
    top_k: int = 5
) -> dict[str, Any]:
    collection = get_collection()

    query_embedding = generate_embeddings([query])[0]

    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )


def delete_document_chunks(document_id: int) -> None:
    collection = get_collection()

    results = collection.get(
        where={
            "document_id": str(document_id)
        }
    )

    ids = results.get("ids", [])

    if ids:
        collection.delete(ids=ids)