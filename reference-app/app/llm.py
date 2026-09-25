import os

from openai import OpenAI
from traceloop.sdk import Traceloop

# The OpenAI client, but pointed at OpenRouter instead of OpenAI.
# OpenRouter speaks the same API "language", so we reuse this client
# and just change the base_url. The api_key is read from .env and
# stays on the server -- the browser never sees it.
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")


def ask_llm(prompt: str, user_id: str) -> str:
    # Tag this request's trace with the user_id so the dashboard can
    # filter traces by user later.
    Traceloop.set_association_properties({"user_id": user_id})

    # This single call is what OpenLLMetry silently traces for us.
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content
