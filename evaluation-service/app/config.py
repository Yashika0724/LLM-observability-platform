import os

from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
REDIS_URL = os.getenv("REDIS_URL")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
JUDGE_MODEL = os.getenv("JUDGE_MODEL")
