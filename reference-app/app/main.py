from dotenv import load_dotenv

# Load .env FIRST, so the API key and settings exist before anything
# else tries to read them.
load_dotenv()

# Start OpenLLMetry BEFORE the first LLM call, so every call is traced.
from app.telemetry import init_telemetry

init_telemetry()

# Build the knowledge base (vector database) once at startup.
from app.rag import init_kb

init_kb()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.llm import ask_llm
from app.history import add_entry, get_history

app = FastAPI(title="Reference LLM App")

# Allow the browser to call this API during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    prompt: str
    user_id: str = "user_1"


@app.post("/ask")
def ask(req: AskRequest):
    # The LLM call + tracing all happen inside ask_llm().
    answer = ask_llm(req.prompt, req.user_id)
    # Save this question + answer to the user's server-side history.
    add_entry(req.user_id, req.prompt, answer)
    return {"answer": answer}


@app.get("/history/{user_id}")
def history(user_id: str):
    # Return the saved history for one user (newest first).
    return {"history": get_history(user_id)}


# Serve the chat page (index.html). Mounted LAST so it does not
# shadow the /ask route above.
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
