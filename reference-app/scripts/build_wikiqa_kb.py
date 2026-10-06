"""
Build the knowledge base from the real Microsoft WikiQA dataset.

Run once (no heavy libraries needed):
    python scripts/build_wikiqa_kb.py

It fetches WikiQA rows over HTTP from the Hugging Face datasets-server,
takes the unique Wikipedia answer sentences, and writes them to
data/knowledge_base.json — the file the app loads into the vector database.
"""
import json
import time
from pathlib import Path

import requests

OUT = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"
BASE = (
    "https://datasets-server.huggingface.co/rows"
    "?dataset=microsoft/wiki_qa&config=default&split=train"
)
MAX_DOCS = 500  # enough variety for the demo, keeps startup fast

seen = set()
docs = []
offset = 0

while len(docs) < MAX_DOCS and offset < 6000:
    url = f"{BASE}&offset={offset}&length=100"
    data = requests.get(url, timeout=30).json()

    rows = data.get("rows", [])
    if not rows:
        break

    for item in rows:
        sentence = (item["row"].get("answer") or "").strip()
        if sentence and len(sentence) > 20 and sentence not in seen:
            seen.add(sentence)
            docs.append({"id": f"wikiqa_{len(docs)}", "text": sentence})
            if len(docs) >= MAX_DOCS:
                break

    offset += 100
    time.sleep(0.2)

OUT.write_text(json.dumps(docs, indent=2))
print(f"Wrote {len(docs)} WikiQA documents to {OUT}")
