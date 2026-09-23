from dotenv import load_dotenv

# Load .env FIRST, so the API key and settings exist before anything
# else tries to read them.
load_dotenv()

# Start OpenLLMetry BEFORE the first LLM call, so every call is traced.
from app.telemetry import init_telemetry

init_telemetry()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.llm import ask_llm

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
    return {"answer": answer}


# Serve the chat page (index.html). Mounted LAST so it does not
# shadow the /ask route above.
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
