#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Syndi AI — интеграция backend в репозиторий AI-avatar_command
# Запуск: bash setup.sh
# ═══════════════════════════════════════════════════════════════

set -e  # остановить при любой ошибке

echo "🔁 Клонируем репозиторий..."
git clone https://github.com/donjonson-hash/AI-avatar_command.git
cd AI-avatar_command

echo "📁 Создаём структуру backend/..."
mkdir -p backend/src/{ontology,actions,middleware,agents,routes,db,types}

echo "📦 Копируем файлы backend..."
# Предполагается, что папка syndi-backend/ лежит рядом со скриптом
cp -r ../syndi-backend/src/*            backend/src/
cp    ../syndi-backend/package.json     backend/package.json
cp    ../syndi-backend/tsconfig.json    backend/tsconfig.json
cp    ../syndi-backend/.env.example     backend/.env.example
cp    ../syndi-backend/README.md        backend/README.md

echo "⚙️  Настраиваем .env для backend..."
cp backend/.env.example backend/.env
echo ""
echo "‼️  Открой backend/.env и заполни:"
echo "    DATABASE_URL=postgresql://postgres:password@localhost:5432/syndiai"
echo "    AGENT_KEY_OCEAN=sk-ocean-$(openssl rand -hex 16)"
echo "    AGENT_KEY_AVATAR=sk-avatar-$(openssl rand -hex 16)"
echo "    AGENT_KEY_MATCH=sk-match-$(openssl rand -hex 16)"
echo "    AGENT_KEY_ORCHESTRATOR=sk-orch-$(openssl rand -hex 16)"
echo ""

echo "📦 Устанавливаем зависимости backend..."
cd backend && npm install && cd ..

echo "🔧 Обновляем корневой package.json (добавляем скрипты)..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'backend:dev':     'cd backend && npm run dev',
  'backend:build':   'cd backend && npm run build',
  'backend:migrate': 'cd backend && npm run db:migrate',
  'dev:full':        'concurrently \"npm run dev\" \"npm run backend:dev\"'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ package.json updated');
"

echo "📦 Добавляем concurrently для запуска frontend+backend вместе..."
npm install --save-dev concurrently

echo "🔗 Настраиваем Vite proxy для API..."
node -e "
const fs = require('fs');
let vite = fs.readFileSync('vite.config.ts', 'utf8');
if (!vite.includes('proxy')) {
  vite = vite.replace(
    'plugins: [react()]',
    \`plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, '')
      }
    }
  }\`
  );
  fs.writeFileSync('vite.config.ts', vite);
  console.log('✅ Vite proxy configured (/api → localhost:3001)');
} else {
  console.log('ℹ️  Vite proxy already configured');
}
"

echo "📝 Создаём src/lib/api.ts (API-клиент для фронта)..."
mkdir -p src/lib
cat > src/lib/api.ts << 'EOF'
// ─────────────────────────────────────────────────────────────
// Syndi AI — API Client
// Все запросы к backend идут через этот модуль
// ─────────────────────────────────────────────────────────────

const BASE = '/api';

// ── Types ────────────────────────────────────────────────────

export interface ActionResult {
  success: boolean;
  action: string;
  target_id: string;
  result?: Record<string, unknown>;
  error?: string;
  requires_human_confirmation?: boolean;
  pending_id?: string;
}

export interface PendingConfirmation {
  id: string;
  action: string;
  target_id: string;
  agent_id: string;
  payload: Record<string, unknown>;
  created_at: string;
  expires_at: string;
}

// ── Action Service ────────────────────────────────────────────

export async function executeAction(
  action: string,
  targetId: string,
  payload?: Record<string, unknown>
): Promise<ActionResult> {
  const res = await fetch(`${BASE}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, target_id: targetId, payload }),
  });
  return res.json();
}

// ── Human-in-Loop ─────────────────────────────────────────────

export async function getPendingConfirmations(userId: string): Promise<PendingConfirmation[]> {
  const res = await fetch(`${BASE}/human/pending?user_id=${userId}`);
  const data = await res.json();
  return data.pending ?? [];
}

export async function confirmAction(
  pendingId: string,
  userId: string,
  approved: boolean
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE}/human/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pending_id: pendingId, user_id: userId, approved }),
  });
  return res.json();
}

// ── Users ─────────────────────────────────────────────────────

export async function createUser(data: {
  name: string;
  email: string;
  role: 'Founder' | 'Developer' | 'Designer' | 'Investor';
  ocean_scores?: { O: number; C: number; E: number; A: number; N: number };
}) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUser(id: string) {
  const res = await fetch(`${BASE}/users/${id}`);
  return res.json();
}

// ── Context (для агентов) ─────────────────────────────────────

export async function getAgentContext(params: {
  agentKey: string;
  userId?: string;
  chatId?: string;
}) {
  const url = new URL(`${BASE}/context`, window.location.origin);
  if (params.userId) url.searchParams.set('user_id', params.userId);
  if (params.chatId) url.searchParams.set('chat_id', params.chatId);

  const res = await fetch(url.toString(), {
    headers: { 'X-Agent-Key': params.agentKey },
  });
  return res.json();
}
EOF

echo "📝 Создаём src/hooks/useHumanLoop.ts..."
cat > src/hooks/useHumanLoop.ts << 'EOF'
// ─────────────────────────────────────────────────────────────
// useHumanLoop — хук для Human-in-Loop подтверждений
// Используется в UI для показа pending действий агентов
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { getPendingConfirmations, confirmAction, PendingConfirmation } from '../lib/api';

export function useHumanLoop(userId: string | null) {
  const [pending, setPending] = useState<PendingConfirmation[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getPendingConfirmations(userId);
      setPending(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
    // Опрос каждые 10 секунд
    const interval = setInterval(refresh, 10_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const approve = useCallback(async (pendingId: string) => {
    if (!userId) return;
    await confirmAction(pendingId, userId, true);
    await refresh();
  }, [userId, refresh]);

  const reject = useCallback(async (pendingId: string) => {
    if (!userId) return;
    await confirmAction(pendingId, userId, false);
    await refresh();
  }, [userId, refresh]);

  return { pending, loading, approve, reject, refresh };
}
EOF

echo "📝 Создаём src/components/AgentConfirmDialog.tsx..."
mkdir -p src/components
cat > src/components/AgentConfirmDialog.tsx << 'EOF'
// ─────────────────────────────────────────────────────────────
// AgentConfirmDialog — диалог подтверждения действий агента
// Human-in-Loop UI компонент
// ─────────────────────────────────────────────────────────────
import { useHumanLoop } from '../hooks/useHumanLoop';

interface Props {
  userId: string | null;
}

const ACTION_LABELS: Record<string, string> = {
  ai_suggest_reply: '🤖 Аватар хочет отправить сообщение',
  delete_account:   '⚠️  Запрос на удаление аккаунта',
};

export function AgentConfirmDialog({ userId }: Props) {
  const { pending, approve, reject } = useHumanLoop(userId);

  if (pending.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {pending.map((item) => (
        <div
          key={item.id}
          className="bg-[#1f2937] border border-[#00d4aa] rounded-xl p-4 shadow-lg"
        >
          <p className="text-[#f9fafb] text-sm font-medium mb-1">
            {ACTION_LABELS[item.action] ?? `Агент: ${item.action}`}
          </p>

          {item.payload?.content && (
            <p className="text-[#9ca3af] text-sm mb-3 italic">
              «{String(item.payload.content)}»
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => approve(item.id)}
              className="flex-1 bg-[#00d4aa] text-[#0a0e17] text-sm font-semibold
                         py-1.5 rounded-lg hover:brightness-110 transition"
            >
              Подтвердить
            </button>
            <button
              onClick={() => reject(item.id)}
              className="flex-1 border border-[#374151] text-[#9ca3af] text-sm
                         py-1.5 rounded-lg hover:border-[#e63946] hover:text-[#e63946] transition"
            >
              Отклонить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
EOF

echo ""
echo "✅ Интеграция завершена!"
echo ""
echo "═══════════════════════════════════════════════════"
echo "  СЛЕДУЮЩИЕ ШАГИ:"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  1. Заполни backend/.env (DATABASE_URL + API Keys)"
echo "  2. npm run backend:migrate   (создать таблицы в PG)"
echo "  3. npm run dev:full          (запуск frontend + backend)"
echo ""
echo "  Фронт:   http://localhost:5173"
echo "  Backend: http://localhost:3001/health"
echo ""
echo "  В App.tsx добавь AgentConfirmDialog:"
echo "  import { AgentConfirmDialog } from './components/AgentConfirmDialog'"
echo "  <AgentConfirmDialog userId={currentUser?.id ?? null} />"
echo ""
echo "  Commit:"
echo "  git add ."
echo '  git commit -m "feat: add Palantir-style backend (Action Service + Ontology)"'
echo "  git push origin main"
echo ""
