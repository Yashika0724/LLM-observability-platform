import json
from pathlib import Path

import chromadb
from traceloop.sdk.decorators import task

# The knowledge base file (the "dataset" the agent searches).
_KB_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"

_collection = None


def init_kb():
    """
    Build the vector database once at server startup:
    load the documents, store them, and index them for meaning-based search.
    """
    global _collection

    client = chromadb.Client()  # in-memory vector database

    # Start fresh each run so re-starts don't duplicate documents.
    try:
        client.delete_collection("knowledge_base")
    except Exception:
        pass

    _collection = client.create_collection("knowledge_base")

    docs = json.loads(_KB_PATH.read_text())
    _collection.add(
        documents=[d["text"] for d in docs],
        ids=[d["id"] for d in docs],
    )


@task(name="retrieve_documents")
def retrieve(query: str, k: int = 3):
    """
    Search the vector database for the k documents most relevant to the query.
    This runs BEFORE the LLM call, and shows up as its own span in the trace.
    """
    results = _collection.query(query_texts=[query], n_results=k)
    return results["documents"][0]  # a list of the matching document texts
