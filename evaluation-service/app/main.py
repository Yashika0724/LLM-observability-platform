import threading
from contextlib import asynccontextmanager

import redis
from fastapi import FastAPI
from pymongo import MongoClient

from app.config import MONGODB_URI, REDIS_URL
from app.judge import evaluate

queue = redis.from_url(REDIS_URL, decode_responses=True)
traces = MongoClient(MONGODB_URI).get_default_database()["traces"]


def worker():
    while True:
        job = queue.brpop("eval_jobs", timeout=1)  # wait up to 1s for a job
        if not job:
            continue

        _, trace_id = job
        trace = traces.find_one({"traceId": trace_id})
        if not trace or not trace.get("output"):
            continue

        try:
            score, rationale = evaluate(trace["input"], trace["output"])
        except Exception as error:
            print(f"[eval] trace {trace_id[:8]} failed: {error}")
            continue

        traces.update_one(
            {"traceId": trace_id},
            {"$set": {"evaluation.score": score, "evaluation.rationale": rationale}},
        )
        print(f"[eval] trace {trace_id[:8]} scored {score}/5: {rationale}")


# Start the worker when the server starts
@asynccontextmanager
async def lifespan(app):
    threading.Thread(target=worker, daemon=True).start()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok", "pending_jobs": queue.llen("eval_jobs")}
