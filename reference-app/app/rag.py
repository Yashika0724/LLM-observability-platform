import hashlib
import json
import math
import re
from pathlib import Path

import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from traceloop.sdk.decorators import task

# The knowledge base file (the "dataset" the agent searches).
_KB_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"

# Size of each document vector.
_DIM = 1024
_token_re = re.compile(r"[a-z0-9]+")

_collection = None


def _embed_one(text: str):
    """Turn text into a fixed-size vector by hashing each word into a bucket.
    This is a lightweight embedding: no model to download and almost no memory,
    so it runs on small free hosting. Similar texts share words, so they land in
    the same buckets and end up close together."""
    vec = [0.0] * _DIM
    for tok in _token_re.findall(text.lower()):
        bucket = int(hashlib.md5(tok.encode()).hexdigest(), 16) % _DIM
        vec[bucket] += 1.0
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]  # normalize for cosine similarity


class HashingEmbeddingFunction(EmbeddingFunction):
    """A dependency-free embedding function for ChromaDB (word-hashing).
    Keeps the app a real vector database while staying tiny enough for free hosting."""

    def __call__(self, input: Documents) -> Embeddings:
        return [_embed_one(t) for t in input]

    @staticmethod
    def name() -> str:
        return "hashing"


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

    _collection = client.create_collection(
        "knowledge_base",
        embedding_function=HashingEmbeddingFunction(),
    )

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
