from app.rag.prompt import build_prompt
from app.rag.text_splitter import split_text


def test_text_splitter():
    text = (
        "Our company was founded in 2020. "
        "Our main service is artificial intelligence. "
        "We provide AI solutions to businesses."
    )

    chunks = split_text(
        text,
        chunk_size=50,
        chunk_overlap=10
    )

    assert len(chunks) > 1
    assert all(chunk.strip() for chunk in chunks)


def test_prompt_contains_knowledge_context():
    context = "Our company was founded in 2020."
    query = "When was the company founded?"

    prompt = build_prompt(
        query=query,
        context=context
    )

    assert context in prompt
    assert query in prompt
    assert "ONLY the information provided" in prompt


print("RAG tests configured successfully.")