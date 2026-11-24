import json
import re

from openai import OpenAI

from app.config import JUDGE_MODEL, OPENROUTER_API_KEY

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENROUTER_API_KEY)

PROMPT = """You are grading an AI assistant's answer.

Question: {question}
Answer: {answer}

How relevant and helpful is the answer to the question?
Give a score from 1 (useless) to 5 (excellent).
Reply only with JSON: {{"score": <1-5>, "rationale": "<one short sentence>"}}"""


# LLM-as-judge: another LLM call grades the answer
def evaluate(question, answer):
    response = client.chat.completions.create(
        model=JUDGE_MODEL,
        messages=[{"role": "user", "content": PROMPT.format(question=question, answer=answer)}],
    )
    text = response.choices[0].message.content
    result = json.loads(re.search(r"\{.*\}", text, re.DOTALL).group())  # model may add text around the JSON
    return result["score"], result["rationale"]
