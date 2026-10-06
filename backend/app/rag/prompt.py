SYSTEM_PROMPT = """
You are an AI knowledge-base assistant.

Your job is to answer questions using ONLY the information provided
in the knowledge base context.

Rules:
1. Do not use outside knowledge.
2. Do not invent or assume information.
3. If the answer is not present in the context, clearly say that
   the information was not found in the knowledge base.
4. Keep answers clear, accurate, and relevant.
5. When the context contains conflicting information, mention the
   conflict instead of choosing an answer yourself.
"""


def build_prompt(
    query: str,
    context: str,
    conversation_history: str = ""
) -> str:
    return f"""
{SYSTEM_PROMPT}

Knowledge Base Context:
{context}

Previous Conversation:
{conversation_history}

User Question:
{query}

Answer:
""".strip()