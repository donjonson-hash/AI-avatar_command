#!/usr/bin/env python3
"""
Точка входа для терминала и OpenClaw.
Использование:
  python3 run_agent.py "задача"
  python3 run_agent.py "задача" --agent backend_dev
"""
import sys, os, argparse
sys.path.insert(0, os.path.dirname(__file__))

from agents.orchestrator import execute

parser = argparse.ArgumentParser(description="Syndi AI Agent Team")
parser.add_argument("task", help="Задача для команды агентов")
parser.add_argument("--agent", help="Конкретный агент (architect/backend_dev/frontend_dev/qa/devops)")
args = parser.parse_args()

result = execute(args.task, args.agent)
print(f"\n{'='*50}")
print(f"🤖 Агент: {result['role']}")
print(f"{'='*50}")
print(result["result"])
