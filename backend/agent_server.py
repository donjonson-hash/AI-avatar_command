from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from agents.orchestrator import execute

app = FastAPI(title="Syndi AI Agent Team", version="0.1.0")

class TaskRequest(BaseModel):
    task: str
    agent: Optional[str] = None

@app.post("/run")
def run_task(req: TaskRequest):
    return execute(req.task, req.agent)

@app.get("/agents")
def list_agents():
    return {"agents": ["architect", "backend_dev", "frontend_dev", "qa", "devops"]}

@app.get("/health")
def health():
    return {"status": "ok", "service": "agent_server"}
