import requests

from app.core.config import settings
from app.rag.prompt import build_prompt
from app.rag.retriever import retrieve_relevant_documents


def generate_rag_response(
    query: str,
    conversation_history: str = ""
) -> str:
    relevant_documents = retrieve_relevant_documents(query)

    if not relevant_documents:
        return (
            "I'm sorry, but I couldn't find relevant information "
            "in the knowledge base to answer your question."
        )

    context = "\n\n".join(
        document["content"]
        for document in relevant_documents
    )

    prompt = build_prompt(
        query=query,
        context=context,
        conversation_history=conversation_history
    )

    if settings.LLM_PROVIDER.lower() != "ollama":
        raise ValueError(
            f"Unsupported LLM provider: {settings.LLM_PROVIDER}"
        )

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": settings.LLM_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    response.raise_for_status()

    result = response.json()

    return result["response"].strip()