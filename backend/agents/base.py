import os, json, httpx
from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env.local", override=True)

MIMO_KEY = os.getenv("VITE_MIMO_API_KEY", "")
MIMO_URL = "https://api.xiaomimimo.com/anthropic/v1/messages"
MODEL    = "mimo-v2.5-pro"

class BaseAgent:
    name: str = "base"
    role: str = ""
    system: str = ""

    def __init__(self, ontology_ctx: str = ""):
        self.ontology_ctx = ontology_ctx

    def _build_system(self) -> str:
        return (
            f"{self.system}\n\n"
            f"## Контекст проекта (Ontology)\n{self.ontology_ctx}\n\n"
            f"Отвечай на русском. Если пишешь код — оборачивай в ```язык блоки."
        )

    def run(self, task: str, history: list[dict] | None = None) -> str:
        messages = (history or []) + [{"role": "user", "content": task}]
        with httpx.Client(timeout=60) as client:
            r = client.post(
                MIMO_URL,
                headers={
                    "x-api-key": MIMO_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                content=json.dumps({
                    "model": MODEL,
                    "max_tokens": 2048,
                    "system": self._build_system(),
                    "messages": messages,
                    "temperature": 0.3,
                }).encode(),
            )
        r.raise_for_status()
        return r.json()["content"][0]["text"]
