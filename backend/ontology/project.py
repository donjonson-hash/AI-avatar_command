"""
Онтология проекта — граф объектов Syndi AI.
Аналог Palantir Ontology: хранит состояние, решения, артефакты.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import json, os

ONTOLOGY_PATH = os.path.join(os.path.dirname(__file__), "../.ontology.json")

@dataclass
class Decision:
    agent: str
    task: str
    result: str
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

@dataclass
class ProjectOntology:
    name: str = "Syndi AI"
    stack: dict = field(default_factory=lambda: {
        "backend": ["FastAPI", "Qdrant", "sentence-transformers", "Mimo API"],
        "frontend": ["React", "TypeScript", "Vite", "shadcn/ui"],
        "infra": ["Docker", "Qdrant self-hosted"],
        "ports": {"embed_server": 8002, "auth_server": 8003, "agent_server": 8004},
    })
    decisions: list = field(default_factory=list)
    files: dict = field(default_factory=lambda: {
        "backend": ["embed_server.py", "auth_server.py", "requirements.txt"],
        "frontend": ["src/lib/apiClient.ts", "src/data/mockData.ts"],
        "config": [".env.local", ".gitignore"],
    })

    def add_decision(self, agent: str, task: str, result: str):
        d = Decision(agent=agent, task=task, result=result[:300])
        self.decisions.append(d.__dict__)
        self._save()

    def context(self) -> str:
        recent = self.decisions[-5:] if self.decisions else []
        return (
            f"Проект: {self.name}\n"
            f"Стек: {json.dumps(self.stack, ensure_ascii=False)}\n"
            f"Файлы: {json.dumps(self.files, ensure_ascii=False)}\n"
            f"Последние решения: {json.dumps(recent, ensure_ascii=False)}"
        )

    def _save(self):
        with open(ONTOLOGY_PATH, "w") as f:
            json.dump(self.__dict__, f, ensure_ascii=False, indent=2)

    @classmethod
    def load(cls) -> "ProjectOntology":
        if os.path.exists(ONTOLOGY_PATH):
            with open(ONTOLOGY_PATH) as f:
                data = json.load(f)
                o = cls()
                o.__dict__.update(data)
                return o
        return cls()

ontology = ProjectOntology.load()
