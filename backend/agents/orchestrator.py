from ontology.project import ontology
from agents.architect    import ArchitectAgent
from agents.backend_dev  import BackendDevAgent
from agents.frontend_dev import FrontendDevAgent
from agents.qa           import QAAgent
from agents.devops       import DevOpsAgent
from agents.base         import BaseAgent
import json, httpx, os
from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env.local", override=True)

AGENTS: dict[str, BaseAgent] = {}

def _get_agents() -> dict[str, BaseAgent]:
    if not AGENTS:
        ctx = ontology.context()
        AGENTS.update({
            "architect":    ArchitectAgent(ctx),
            "backend_dev":  BackendDevAgent(ctx),
            "frontend_dev": FrontendDevAgent(ctx),
            "qa":           QAAgent(ctx),
            "devops":       DevOpsAgent(ctx),
        })
    return AGENTS

ROUTER_SYSTEM = """Ты — роутер задач команды Syndi AI.
По тексту задачи определи ОДНОГО подходящего агента.
Агенты: architect, backend_dev, frontend_dev, qa, devops.
Ответь ТОЛЬКО JSON: {"agent": "имя_агента", "reason": "одна строка почему"}"""

def _route(task: str) -> str:
    key  = os.getenv("VITE_MIMO_API_KEY", "")
    with httpx.Client(timeout=30) as c:
        r = c.post(
            "https://api.xiaomimimo.com/anthropic/v1/messages",
            headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                     "content-type": "application/json"},
            content=json.dumps({
                "model": "mimo-v2.5-pro", "max_tokens": 100,
                "system": ROUTER_SYSTEM,
                "messages": [{"role": "user", "content": task}],
                "temperature": 0,
            }).encode(),
        )
    text = r.json()["content"][0]["text"].strip()
    print(f"[router raw]: {text!r}")
    # определяем агента по ключевым словам если JSON не пришёл
    start = text.find("{")
    end   = text.rfind("}") + 1
    if start != -1 and end > start:
        try:
            data = json.loads(text[start:end])
            return data.get("agent", "backend_dev")
        except json.JSONDecodeError:
            pass
    # fallback: поищем имя агента в тексте
    for name in ["architect", "frontend_dev", "backend_dev", "devops", "qa"]:
        if name in text.lower():
            return name
    return "backend_dev"

def execute(task: str, agent_name: str | None = None) -> dict:
    agents = _get_agents()
    if not agent_name:
        agent_name = _route(task)
    agent = agents.get(agent_name, agents["backend_dev"])
    print(f"→ [{agent.role}] получил задачу...")
    result = agent.run(task)
    ontology.add_decision(agent_name, task, result)
    return {
        "agent": agent_name,
        "role":  agent.role,
        "task":  task,
        "result": result,
    }
