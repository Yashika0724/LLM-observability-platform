"""
Server-side chat history, stored per user in a JSON file so it persists
across server restarts and is the same no matter which browser is used.
"""
import json
import time
from pathlib import Path
from threading import Lock

# The file where history is saved (next to the knowledge base).
_HISTORY_PATH = Path(__file__).resolve().parent.parent / "data" / "history.json"

# Lock so two requests can't write the file at the same time.
_lock = Lock()

# Keep at most this many questions per user.
_MAX_PER_USER = 50


def _read():
    if _HISTORY_PATH.exists():
        try:
            return json.loads(_HISTORY_PATH.read_text())
        except Exception:
            return {}
    return {}


def _write(data):
    _HISTORY_PATH.write_text(json.dumps(data, indent=2))


def add_entry(user_id: str, prompt: str, answer: str):
    """Save one question + answer for a user (newest first)."""
    with _lock:
        data = _read()
        items = data.get(user_id, [])
        items.insert(0, {
            "prompt": prompt,
            "answer": answer,
            "time": int(time.time() * 1000),  # milliseconds
        })
        data[user_id] = items[:_MAX_PER_USER]
        _write(data)


def get_history(user_id: str):
    """Return a user's saved history (newest first)."""
    with _lock:
        return _read().get(user_id, [])
