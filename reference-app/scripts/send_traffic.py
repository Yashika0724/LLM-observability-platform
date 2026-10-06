"""
Send a batch of questions to the running reference app, so the observability
dashboard fills up with traces for a demo.

First start the app (in another terminal):
    uvicorn app.main:app --port 9000

Then run this:
    python scripts/send_traffic.py          # sends 15 questions
    python scripts/send_traffic.py 40        # sends 40 questions

It pulls real WikiQA questions and sends each one with a random mock user,
so the traces have variety to filter by.
"""
import random
import sys
import time

import requests

APP_URL = "http://localhost:9000/ask"
USERS = ["user_1", "user_2", "user_3"]
HOW_MANY = int(sys.argv[1]) if len(sys.argv) > 1 else 15

# Grab real WikiQA questions to send.
rows = requests.get(
    "https://datasets-server.huggingface.co/rows"
    "?dataset=microsoft/wiki_qa&config=default&split=train&offset=0&length=100",
    timeout=30,
).json()["rows"]

questions = list({r["row"]["question"] for r in rows})
random.shuffle(questions)
questions = questions[:HOW_MANY]

print(f"Sending {len(questions)} questions to {APP_URL} ...\n")

ok = 0
for i, question in enumerate(questions, 1):
    user = random.choice(USERS)
    try:
        resp = requests.post(
            APP_URL, json={"prompt": question, "user_id": user}, timeout=90
        )
        answer = resp.json().get("answer", "")
        print(f"[{i}/{len(questions)}] {user} | {question[:45]:45} -> {answer[:55]}")
        ok += 1
    except Exception as exc:
        print(f"[{i}/{len(questions)}] {user} | {question[:45]:45} -> ERROR: {exc}")
    time.sleep(0.5)

print(f"\nDone. {ok}/{len(questions)} succeeded. Each one created a trace.")
