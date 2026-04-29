# Syndi AI — Руководство по работе с командой AI-агентов
## Практический гайд для тимлида / продакт-менеджера

---

## Содержание
1. [Ежедневный распорядок](#ежедневный-распорядок)
2. [Как ставить задачи агентам](#как-ставить-задачи-агентам)
3. [Workflow разработки](#workflow-разработки)
4. [Code Review процесс](#code-review-процесс)
5. [Коммуникация между агентами](#коммуникация-между-агентами)
6. [Эскалация и решение конфликтов](#эскалация-и-решение-конфликтов)
7. [Чек-листы по ролям](#чек-листы-по-ролям)
8. [Полезные команды](#полезные-команды)

---

## Ежедневный распорядок

### 9:00 — Утренний стендап ( async, через GitHub Issues )

Каждый агент "пишет" в dedicated GitHub Issue ежедневный отчёт. Шаблон:

```markdown
## Standup: 2026-04-27

**Агент:** Eidolon (Avatar Engine)

**Вчера:**
- [x] Завершил voice clone pipeline (ElevenLabs integration)
- [x] Написал 3 unit-теста для avatar generation

**Сегодня:**
- [ ] Реализовать real-time lip sync (LivePortrait)
- [ ] Интегрировать emotion detection (EmoLLM)

**Блокеры:**
- Нужен approve от Vesper на STUN/TURN server config (#42)
- Ожидаю доступ к GPU инстансу на AWS

**Эмоциональное состояние:** оптимистичный
```

Команда для быстрого создания:
```bash
gh issue create --repo donjonson-hash/AI-avatar_command \
  --title "Standup: 2026-04-27 — Eidolon" \
  --label "standup,avatar-engine" \
  --template standup.md
```

### 10:00 — Приоритизация задач ( Human-in-the-loop )

Вы как тимлид:
1. Просматриваете все standup-отчёты (5-10 мин)
2. Обновляете приоритеты в GitHub Projects
3. Разрешаете блокеры (reassign, escalate)

### 13:00 — Mid-day checkpoint

Быстрая проверка:
- Какие PR открыты?
- Есть ли failing CI?
- Нужен ли human review?

```bash
# Статус всех PR
gh pr list --repo donjonson-hash/AI-avatar_command --state open

# Статус CI
gh run list --repo donjonson-hash/AI-avatar_command --limit 10
```

### 18:00 — End-of-day summary

Краткий отчёт от каждого агента:
- Что выполнено
- Что переносится на завтра
- Новые блокеры

---

## Как ставить задачи агентам

### Метод: OpenSpec → PRD → Implementation

Каждая задача проходит 3 этапа:

#### Этап 1: OpenSpec (Agent Sprocket + Augur)

```markdown
## Task: [TASK-ID] Реализовать avatar-to-avatar video call

**Agent:** Eidolon (primary), Artisan (UI), Vesper (infra)
**Priority:** P1 (MVP S4)
**Deadline:** 2026-05-15

### Functional Requirements
1. Пользователь A инициирует видеозвонок с пользователем B
2. Оба аватара отображаются в picture-in-picture режиме
3. Emotion indicators (real-time) под каждым аватаром
4. Максимум 2 участника, максимум 60 минут

### Technical Spec
- WebRTC (P2P, STUN/TURN через Twilio)
- Socket.io для signaling
- React компонент: `VideoCall.tsx`
- Backend endpoint: `POST /api/calls/initiate`

### Acceptance Criteria
- [ ] Видео работает в Chrome, Firefox, Safari
- [ ] Latency < 200ms (p99)
- [ ] Emotion detection обновляется каждые 2 сек
- [ ] Unit test coverage > 80%

### Estimated Effort
- Eidolon: 16h (WebRTC + emotion)
- Artisan: 12h (UI компонент)
- Vesper: 4h (TURN серверы)
```

#### Этап 2: PRD Approval (Human — вы)

Проверяете и approve/disapprove:
```bash
gh pr review [PR-NUMBER] --approve --body "LGTM, начинайте implementation"
# или
gh pr review [PR-NUMBER] --request-changes --body "Нужно добавить retry logic для TURN серверов"
```

#### Этап 3: Implementation (Agent executes)

Агент создаёт branch, пишет код, открывает PR:
```bash
git checkout -b feature/avatar-video-call
git push origin feature/avatar-video-call
gh pr create --title "feat: avatar-to-avatar video call" --body "Closes #[TASK-ID]"
```

### Формат задачи по типам

| Тип задачи | Кто создаёт | Формат | Review |
|-----------|-------------|--------|--------|
| **Feature** | Augur | OpenSpec PRD + Figma link | Human |
| **Bug** | Любой агент | GitHub Issue template | Human если P0-1 |
| **Refactor** | Vesper | ADR (Architecture Decision Record) | Vesper approves |
| **Hotfix** | Custos | Emergency PR | Custos can bypass |
| **Tech Debt** | Любой агент | GitHub Issue + label `tech-debt` | Augur prioritizes |

---

## Workflow разработки

### Git branching strategy: GitHub Flow

```
main (protected)
  ↑
feature/avatar-video-call    ← Eidolon
feature/video-call-ui        ← Artisan
hotfix/webRTC-memory-leak    ← Custos
```

### CI/CD Pipeline (Agent Sprocket управляет)

```
Push to branch
    ↓
GitHub Actions triggered
    ↓
├─ Lint (ruff, eslint, mypy)     ← 30s
├─ Unit tests (pytest, vitest)    ← 2min
├─ Integration tests               ← 5min
├─ Security scan (Snyk, trivy)    ← 1min ← Custos gate
└─ Build check                     ← 1min
    ↓
All green? → PR ready for review
    ↓
Human approval (1 required for MVP)
    ↓
Merge to main → Auto-deploy to staging
    ↓
Smoke tests pass? → Promote to production
```

### Команды для daily workflow

```bash
# 1. Статус репозитория
gh repo view donjonson-hash/AI-avatar_command

# 2. Создать задачу для агента
gh issue create \
  --title "[SYNTHIA] Optimize matching algorithm latency" \
  --body "Current p99 is 350ms, target is <100ms. See metrics dashboard." \
  --label "matching-engine,performance"

# 3. Назначить агента
gh issue edit [ISSUE-NUM] --add-assignee "synthia-agent"

# 4. Создать feature branch
git checkout -b feature/[agent]-[short-desc]

# 5. После коммита — открыть PR
gh pr create \
  --title "feat: [agent] description" \
  --body "## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass

## Checklist
- [ ] Code follows style guide
- [ ] No secrets in code
- [ ] ADR updated if needed" \
  --reviewer "human-tl"

# 6. Review PR
gh pr view [PR-NUM]
gh pr diff [PR-NUM]
gh pr review [PR-NUM] --approve

# 7. Merge (только после approve)
gh pr merge [PR-NUM] --squash

# 8. Деплой
gh workflow run deploy-staging.yml
# После smoke tests:
gh workflow run deploy-production.yml
```

---

## Code Review процесс

### Кто review-ит кого:

| Агент | Кто review-ит | Область проверки |
|-------|--------------|------------------|
| **Vesper** | Human CTO | Архитектура, безопасность инфраструктуры |
| **Synthia** | Augur + Human | Корректность ML, метрики качества |
| **Eidolon** | Artisan + Human | API интеграция, UI/UX аватара |
| **Artisan** | Human + Augur | Code quality, accessibility, performance |
| **Custos** | Human (mandatory) | Security, compliance — **absolute veto** |
| **Augur** | Human PM | Бизнес-логика, метрики |
| **Sprocket** | Vesper | Infra changes, CI/CD |

### Чек-лист для Code Review (копируйте в каждый PR):

```markdown
## Code Review Checklist

### Functionality
- [ ] Feature работает как описано в PRD
- [ ] Edge cases обработаны
- [ ] Error handling реализован

### Code Quality
- [ ] Type hints / TypeScript strict mode
- [ ] No `any` types
- [ ] Functions < 50 lines
- [ ] DRY principle соблюдён

### Security (Custos gate)
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] SQL injection проверка
- [ ] XSS prevention

### Testing
- [ ] Unit tests > 80% coverage
- [ ] Integration tests для API endpoints
- [ ] E2E tests для critical paths

### Performance
- [ ] No N+1 queries
- [ ] Images optimized
- [ ] Bundle size проверен

### Documentation
- [ ] README обновлён
- [ ] API docs (OpenAPI) обновлены
- [ ] ADR создан если архитектурное изменение
```

### Как делать review через CLI:

```bash
# Посмотреть PR
gh pr view 15

# Посмотреть diff
gh pr diff 15

# Оставить комментарий
gh pr review 15 --comment --body "Отличная работа! Но добавь, пожалуйста, retry logic для ElevenLabs API calls."

# Approve
gh pr review 15 --approve --body "LGTM 🚀"

# Request changes
gh pr review 15 --request-changes --body "Нужно исправить:
1. Убрать console.log
2. Добавить обработку timeout
3. Обновить unit test"
```

---

## Коммуникация между агентами

### Протокол: GitHub Issues + Mention system

Агенты общаются через GitHub Issues с @mentions:

```markdown
## [EIDOLON → VESPER] Нужен TURN сервер для WebRTC

@vesper-agent 

Для avatar-to-avatar video calls нужен TURN сервер.
Требования:
- Global coverage (EU, US, Asia)
- < 50ms latency
- OAuth 2.0 auth

Сможешь подготовить к пятнице?
Priority: P1
```

Vesper отвечает в том же Issue:
```markdown
@eidolon-agent 

Готово! TURN серверы настроены:
- `turn:eu.syndi.ai:3478`
- `turn:us.syndi.ai:3478`
- `turn:asia.syndi.ai:3478`

Credentials в Vault: `secret/webrtc/turn`
Latency test: https://grafana.syndi.ai/d/webrtc-latency
```

### Decision Escalation Matrix

| Тип решения | Кто решает | Как эскалировать | SLA |
|------------|-----------|-----------------|-----|
| Архитектура | Vesper → Human CTO | Discussion в ADR issue | 24h async |
| ML model deploy | Synthia → Augur | Если accuracy delta > 2% | 12h |
| UI changes | Artisan → Human | Если conversion impact unknown | 24h |
| **Security exception** | **Custos → NO OVERRIDE** | **Absolute veto** | **Instant** |
| Feature priority | Augur → Human PM | Quarter goal conflict | 24h |
| Deploy/rollback | Sprocket → Vesper | Если > 1% error budget | 30min |

---

## Эскалация и решение конфликтов

### Сценарии:

#### 1. Два агента конфликтуют по архитектуре

```
Synthia: "Нужен Graph DB (Neo4j) для matching"
Vesper: "Это overkill, PostgreSQL + pggraph достаточно"

Решение:
1. Оба агента пишут ADR (Architecture Decision Record)
2. Human CTO review оба ADR
3. Решение принимается по данным (benchmark)
4. Проигравший агент accept решение
```

#### 2. Custos блокирует релиз

```
Custos: "Найдена утечка PII в логах. Релиз блокируется."

Решение:
1. Custos создаёт P0 issue
2. Ответственный агент фиксит в течение 2 часов
3. Custos verify fix
4. Только тогда релиз

Нет override. Никогда.
```

#### 3. Agent stuck (не может решить задачу)

```
Eidolon: "Не могу интегрировать LivePortrait с нашим pipeline"

Решение:
1. Eidolon создаёт help-wanted issue
2. Sprocket reassign на другого агента или human
3. Если 4+ часов stuck → mandatory human intervention
```

### Emergency contacts ( escalation path ):

```
Level 1: Agent-to-Agent (GitHub Issues)
  ↓ 2h no response
Level 2: Agent-to-Human (Slack / Telegram / Email)
  ↓ 4h no response  
Level 3: Human CTO decision
  ↓ 24h critical
Level 4: Emergency call (all hands)
```

---

## Чек-листы по ролям

### Чек-лист для Vesper (Architect)

- [ ] Terraform plan прошёл `terraform plan` без errors
- [ ] Новый сервис имеет health check endpoint
- [ ] Добавлен мониторинг (Datadog dashboard)
- [ ] Runbook создан для нового сервиса
- [ ] Cost estimate предоставлен

### Чек-лист для Synthia (Matching Engine)

- [ ] Модель прошла A/B test (p-value < 0.05)
- [ ] Latency < 100ms (p99)
- [ ] Fairness metrics проверены
- [ ] Model card обновлён
- [ ] Fallback model готов

### Чек-лист для Eidolon (Avatar Engine)

- [ ] Avatar generation < 5s
- [ ] Voice clone MOS score > 3.5
- [ ] Lip sync sync error < 40ms
- [ ] No uncanny valley reports (user survey)
- [ ] Consent flow работает

### Чек-лист для Artisan (Fullstack)

- [ ] Lighthouse score > 90 (все категории)
- [ ] Mobile responsive проверен
- [ ] Accessibility audit (axe-core) пройден
- [ ] Bundle size < 500KB (initial)
- [ ] E2E tests проходят (Playwright)

### Чек-лист для Custos (Security)

- [ ] Security scan пройден (0 critical, 0 high)
- [ ] PII scan пройден (no leaks)
- [ ] Secrets scan пройден (no hardcoded keys)
- [ ] GDPR compliance checklist пройден
- [ ] Pen test report (if applicable)

### Чек-лист для Augur (Product)

- [ ] North Star metric не упал
- [ ] Feature flagged (can be disabled)
- [ ] Analytics events добавлены
- [ ] A/B test готов
- [ ] Monetization impact assessed

### Чек-лист для Sprocket (DevOps)

- [ ] CI проходит < 10 min
- [ ] Rollback plan documented
- [ ] Monitoring dashboards ready
- [ ] Alert rules configured
- [ ] Cost impact assessed

---

## Полезные команды

### GitHub CLI (gh) — основной инструмент

```bash
# === AUTH ===
gh auth login                    # Логин в GitHub CLI
gh auth status                   # Проверить статус

# === REPO ===
gh repo view                     # Информация о репозитории
gh repo clone donjonson-hash/AI-avatar_command  # Клонировать

# === ISSUES ===
gh issue list                    # Список issues
gh issue list --label "avatar-engine"           # По лейблу
gh issue list --assignee @me                   # Мои задачи
gh issue create --title "..." --body "..."    # Создать
gh issue view [NUM]              # Просмотр
gh issue close [NUM]             # Закрыть
gh issue reopen [NUM]            # Переоткрыть

# === PULL REQUESTS ===
gh pr list                       # Список PR
gh pr list --state merged        # Замёрженные
gh pr view [NUM]                 # Просмотр
gh pr checkout [NUM]             # Checkout PR локально
gh pr create                     # Создать PR
gh pr merge [NUM]                # Merge
gh pr close [NUM]                # Закрыть

# === REVIEW ===
gh pr review [NUM] --approve     # Approve
gh pr review [NUM] --request-changes  # Request changes
gh pr review [NUM] --comment     # Комментарий

# === CI/CD ===
gh run list                      # Список workflow runs
gh run view [RUN-ID]             # Детали
gh run watch [RUN-ID]            # Смотреть live
gh workflow list                 # Список workflows
gh workflow run [NAME]           # Запустить workflow

# === RELEASES ===
gh release create v1.0.0        # Создать релиз
gh release list                  # Список релизов
```

### Git команды

```bash
# === DAILY ===
git status                       # Статус
git pull origin main             # Обновить main
git checkout -b feature/name     # Новая ветка
git add . && git commit -m ""    # Коммит
git push origin feature/name     # Push

# === REVIEW ===
git log --oneline --graph        # История
git diff main...feature/name     # Diff с main
git show [COMMIT]                # Детали коммита

# === EMERGENCY ===
git stash                        # Сохранить изменения
git checkout main                # Переключиться на main
git reset --hard HEAD~1          # Откатить последний коммит
git revert [COMMIT]              # Отменить коммит
```

### Мониторинг (когда настроено)

```bash
# === METRICS ===
curl https://datadog.syndi.ai/api/v1/metrics  # Dashboard
gh run list --status failure                  # Failing CI

# === LOGS ===
aws logs tail /syndi-ai/production --follow   # AWS CloudWatch
kubectl logs -f deployment/api                # Kubernetes

# === ALERTS ===
curl https://pagerduty.syndi.ai/alerts       # PagerDuty
```

---

## Шаблоны

### Шаблон: Новая feature задача

```markdown
## [AUGUR → AGENT] Feature Request

**ID:** FEAT-###
**Agent:** [имя агента]
**Priority:** P0/P1/P2
**Sprint:** [номер]

### Problem Statement
[Что решаем]

### Success Criteria
- [ ] Критерий 1
- [ ] Критерий 2

### Technical Notes
[Контекст для агента]

### Mockups
[Figma link или описание]
```

### Шаблон: Bug report

```markdown
## [AGENT] Bug Report

**ID:** BUG-###
**Severity:** Critical/High/Medium/Low
**Component:** [frontend/backend/ml]

### Description
[Что сломалось]

### Steps to Reproduce
1. Шаг 1
2. Шаг 2
3. Шаг 3

### Expected vs Actual
- Expected: [правильное поведение]
- Actual: [что происходит]

### Environment
- Browser: [Chrome 120 / etc]
- OS: [Ubuntu 22.04 / etc]
- Commit: [hash]

### Logs
```
[paste logs]
```
```

### Шаблон: ADR (Architecture Decision Record)

```markdown
## ADR-###: [Название решения]

**Status:** Proposed / Accepted / Rejected / Deprecated
**Date:** 2026-04-27
**Deciders:** Vesper, [другие агенты], Human CTO

### Context
[Проблема, которую решаем]

### Options Considered
| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

### Decision
[Что выбрали и почему]

### Consequences
- Positive: [плюсы]
- Negative: [минусы]
- Risks: [риски]

### References
[Ссылки на benchmarks, статьи]
```

---

## Tips & Tricks

1. **Async communication优先.** Все агенты работают через GitHub Issues, не в чате.
2. **Over-communicate.** Если агент stuck — сразу пиши help-wanted issue.
3. **Document everything.** Каждое архитектурное решение — ADR. Каждый баг — issue с reproduction steps.
4. **Trust but verify.** Агенты могут ошибаться. Human review required для production changes.
5. **Custos is absolute.** Никогда не override security decisions.
6. **Metrics first.** Каждая feature должна иметь метрики успеха ДО implementation.
7. **Small PRs.** Ideal PR < 400 lines. Легче review, быстрее merge.
8. **Feature flags.** Всё новое за feature flag. Можно отключить за 1 минуту.

---

*Версия: 1.0*
*Последнее обновление: 2026-04-27*
*Владелец: Human Team Lead*
