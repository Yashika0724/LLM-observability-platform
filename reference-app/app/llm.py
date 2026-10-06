import os

from openai import OpenAI
from traceloop.sdk import Traceloop
from traceloop.sdk.decorators import workflow

from app.rag import retrieve

# The OpenAI client, pointed at OpenRouter (same API, different URL).
# The api_key is read from .env and stays on the server.
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning:free")


@workflow(name="rag_query")
def ask_llm(prompt: str, user_id: str) -> str:
    """
    One RAG query: retrieve relevant documents, then answer using them.
    The @workflow decorator groups the retrieval span and the LLM span
    into a single trace, so the dashboard waterfall shows both steps.
    """
    # Tag the trace with the user so it can be filtered later.
    Traceloop.set_association_properties({"user_id": user_id})

    # STEP 1 — retrieval: find the most relevant documents (its own span).
    context_docs = retrieve(prompt)
    context = "\n\n".join(context_docs)

    system_message = (
        "You are a helpful assistant. Answer the question based on the context "
        "below. Use the relevant information from it to give a short, clear "
        "answer. Only say you don't know if the context has nothing relevant.\n\n"
        "Context:\n" + context
    )

    # STEP 2 — the LLM call (automatically traced by OpenLLMetry).
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content
