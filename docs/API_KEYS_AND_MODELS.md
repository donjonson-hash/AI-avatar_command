# Syndi AI — API Keys & AI Models Configuration
## Реестр API-ключей и моделей для команды AI-агентов

---

## ⚡ Быстрый доступ

| Поставщик | API Key переменная окружения | Получить ключ |
|-----------|------------------------------|---------------|
| **OpenAI** | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| **Anthropic** | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | https://elevenlabs.io/app/settings/api-keys |
| **Pinecone/Qdrant** | `PINECONE_API_KEY` / `QDRANT_API_KEY` | https://app.pinecone.io / https://cloud.qdrant.io |
| **AWS** | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` | https://console.aws.amazon.com/iam |
| **Auth0/Clerk** | `AUTH0_SECRET` / `CLERK_SECRET_KEY` | https://manage.auth0.com / https://dashboard.clerk.dev |
| **Stripe** | `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| **GitHub** | `GITHUB_TOKEN` | https://github.com/settings/tokens |
| **PostHog** | `POSTHOG_API_KEY` | https://app.posthog.com/project/settings |

---

## 🤖 Агент 01: VESPER (System Architect)

### Обязанности
- Инфраструктура (AWS, Docker, Kubernetes)
- База данных (PostgreSQL, Redis, Qdrant)
- CI/CD (GitHub Actions → ArgoCD)
- Безопасность и мониторинг

### Используемые модели и API

```yaml
AI Models:
  Claude Code (Anthropic):
    model: "claude-sonnet-4-20250514"
    purpose: "Генерация Terraform-конфигов, code review архитектуры"
    api_key_var: "ANTHROPIC_API_KEY"
    endpoint: "https://api.anthropic.com/v1/messages"
    cost_estimate: "$0.80 / 1000 вызовов"

  Codex (GitHub):
    model: "gpt-4o-codex"
    purpose: "Генерация Dockerfiles, Kubernetes манифестов, CI/CD пайплайнов"
    api_key_var: "GITHUB_TOKEN"
    endpoint: "Встроен в GitHub Copilot / GitHub Agent HQ"
    cost_estimate: "$0.00 (входит в GitHub Pro)"

Infrastructure APIs:
  AWS:
    services: [EC2, EKS, S3, RDS, ElastiCache, SageMaker, Inferentia]
    credentials: "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY"
    region: "eu-central-1 (primary), us-east-1 (backup)"

  Terraform Cloud:
    token_var: "TF_API_TOKEN"
    purpose: "State management, plan/apply automation"
    workspace: "syndi-ai-infrastructure"

  Datadog:
    api_key_var: "DATADOG_API_KEY"
    app_key_var: "DATADOG_APP_KEY"
    purpose: "Мониторинг, APM, логи, алерты"

  Sentry:
    dsn_var: "SENTRY_DSN"
    purpose: "Error tracking, performance monitoring"
```

### Пример .env
```bash
# === VESPER: Architect ===
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY_HERE
AWS_ACCESS_KEY_ID=YOUR_AWS_KEY_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_HERE
AWS_REGION=eu-central-1
TF_API_TOKEN=YOUR_TF_TOKEN_HERE
DATADOG_API_KEY=YOUR_DATADOG_KEY_HERE
DATADOG_APP_KEY=YOUR_DATADOG_APP_KEY_HERE
SENTRY_DSN=YOUR_SENTRY_DSN_HERE
```

---

## 🤖 Агент 02: SYNTHIA (Matching Engine)

### Обязанности
- OCEAN-инференс из текста
- Алгоритм complementarity matching
- Векторные эмбеддинги
- A/B тестирование ranking-алгоритмов

### Используемые модели и API

```yaml
NLP / Embedding Models:
  sentence-transformers:
    model_name: "all-MiniLM-L6-v2"        # Phase 1 (MVP)
    upgrade_to: "sentence-transformers/all-mpnet-base-v2"  # Phase 2
    purpose: "Генерация эмбеддингов навыков и описаний"
    hosting: "Hugging Face Inference API"
    api_key_var: "HF_API_TOKEN"
    endpoint: "https://api-inference.huggingface.co"
    cost_estimate: "Бесплатно (до 30K req/month), $0.012/1M tokens далее"

  Fine-tuned Domain Model:
    base_model: "microsoft/mpnet-base"
    fine_tuning: "LoRA на датасете 10K стартап-профилей"
    purpose: "Специализированные эмбеддинги для co-founder matching"
    hosting: "SageMaker endpoint"
    cost_estimate: "$0.05/час (g4dn.xlarge)"

LLM для OCEAN-инференс:
  GPT-4o (OpenAI):
    model: "gpt-4o-mini"                  # MVP (дешевле)
    upgrade_to: "gpt-4o"                   # Production
    purpose: "Извлечение OCEAN-трейтов из текста LinkedIn/GitHub"
    api_key_var: "OPENAI_API_KEY"
    endpoint: "https://api.openai.com/v1/chat/completions"
    cost_estimate: "$0.15 / 1K профилей (gpt-4o-mini)"

  Claude 3.5 Sonnet (Anthropic) — fallback:
    model: "claude-sonnet-4-20250514"
    purpose: "OCEAN-инференс если OpenAI недоступен"
    api_key_var: "ANTHROPIC_API_KEY"
    cost_estimate: "$0.80 / 1K профилей"

Vector Database:
  Qdrant (рекомендуется):
    cloud_url_var: "QDRANT_URL"
    api_key_var: "QDRANT_API_KEY"
    collection: "syndi_profiles"
    vector_size: 384                        # для MiniLM
    purpose: "Хранение и поиск эмбеддингов"
    cost_estimate: "$0.10/час (1GB RAM)"

  Pinecone (альтернатива):
    api_key_var: "PINECONE_API_KEY"
    environment: "us-east-1-aws"
    index_name: "syndi-matching"
    cost_estimate: "$0.096/час"

ML Pipeline:
  SageMaker:
    purpose: "Тренировка моделей, managed Jupyter notebooks"
    instance: "ml.g4dn.xlarge"             # обучение
    inference: "ml.inf1.xlarge"            # Inferentia для inference

  Weights & Biases:
    api_key_var: "WANDB_API_KEY"
    purpose: "Experiment tracking, model registry"
    project: "syndi-ai-matching"

  MLflow:
    tracking_uri_var: "MLFLOW_TRACKING_URI"
    purpose: "Локальный experiment tracking"
```

### Пример .env
```bash
# === SYNTHIA: Matching Engine ===
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY_HERE
HF_API_TOKEN=YOUR_HF_TOKEN_HERE
QDRANT_URL=YOUR_QDRANT_URL_HERE
QDRANT_API_KEY=YOUR_QDRANT_KEY_HERE
PINECONE_API_KEY=YOUR_PINECONE_KEY_HERE
WANDB_API_KEY=YOUR_WANDB_KEY_HERE
MLFLOW_TRACKING_URI=http://localhost:5000
```

---

## 🤖 Агент 03: EIDOLON (Avatar Engine)

### Обязанности
- Генерация аватара из фото
- Голосовой клон
- Кондиционированные ответы по личности
- Эмоциональная память
- Avatar-to-avatar переговоры

### Используемые модели и API

```yaml
Visual Pipeline — Avatar Generation:
  Stable Diffusion XL (Fine-tuned):
    base_model: "stabilityai/stable-diffusion-xl-base-1.0"
    fine_tuning: "LoRA на 5-10 фото пользователя"
    purpose: "Генерация портрета аватара"
    hosting_options:
      - Replicate API:
          api_key_var: "REPLICATE_API_TOKEN"
          endpoint: "https://api.replicate.com/v1"
          cost_estimate: "$0.008 / генерация"
      - Stability AI API:
          api_key_var: "STABILITY_API_KEY"
          endpoint: "https://api.stability.ai/v1/generation"
          cost_estimate: "$0.02 / генерация"
      - Self-hosted (RunPod):
          api_key_var: "RUNPOD_API_KEY"
          endpoint: "https://api.runpod.ai/v2/{pod-id}/run"
          cost_estimate: "$0.20/час (A100 GPU)"

  FLUX.1 (альтернатива, лучшее качество):
    model: "black-forest-labs/flux-1-dev"
    purpose: "Генерация с референсным фото (IP-Adapter)"
    hosting: "Replicate или self-hosted"
    cost_estimate: "$0.03 / генерация"

  LivePortrait (анимация):
    model: "kwai/LivePortrait"
    purpose: "Анимация лица аватара (lip sync, expressions)"
    hosting: "Self-hosted GPU или Replicate"
    cost_estimate: "$0.005 / кадр"

Voice Pipeline:
  ElevenLabs Voice API (основной):
    api_key_var: "ELEVENLABS_API_KEY"
    endpoints:
      voice_clone: "POST /v1/voices/add"
      text_to_speech: "POST /v1/text-to-speech/{voice_id}"
    purpose: "Клонирование голоса (30s sample), TTS с просодией"
    cost_estimate: "$5/month (Starter), $0.18 / 1000 символов"

  XTTS v2 (fallback, open source):
    model: "coqui/XTTS-v2"
    purpose: "Локальное клонирование голоса"
    hosting: "Self-hosted (GPU required)"
    cost_estimate: "$0.20/час GPU"

  StyleTTS 2 (просодия, эмоции):
    model: "yl4579/StyleTTS2-LibriTTS"
    purpose: "Эмоциональная окраска голоса"
    hosting: "Self-hosted"

Conversational Brain — Personality LLM:
  GPT-4o (OpenAI):
    model: "gpt-4o"
    purpose: "Оркестратор разговора, генерация ответов с учётом OCEAN-профиля"
    api_key_var: "OPENAI_API_KEY"
    cost_estimate: "$5 / 1000 диалогов"

  Claude 3.5 Sonnet (Anthropic) — fallback:
    model: "claude-sonnet-4-20250514"
    purpose: "Оркестратор при недоступности OpenAI"
    api_key_var: "ANTHROPIC_API_KEY"

  Personality LoRA:
    base_model: "mistralai/Mistral-7B-Instruct-v0.3"
    fine_tuning: "QLoRA на корпусе текста пользователя"
    purpose: "Модель, тонко настроенная под стиль речи пользователя"
    hosting: "SageMaker / RunPod"

Emotion Detection:
  EmoLLM:
    model: "MilaNLProc/EmoLLM"
    purpose: "Real-time определение эмоций из текста"
    hosting: "Self-hosted или Hugging Face"

  Multimodal Emotion (опционально):
    model: "google/gemini-1.5-flash"
    purpose: "Определение эмоций с видео/аудио"
    api_key_var: "GOOGLE_API_KEY"

Memory System:
  Redis:
    host_var: "REDIS_HOST"
    purpose: "Short-term context (текущий диалог)"

  PostgreSQL:
    connection_string_var: "DATABASE_URL"
    purpose: "Long-term episodic memory (история взаимодействий)"
```

### Пример .env
```bash
# === EIDOLON: Avatar Engine ===
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY_HERE
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_KEY_HERE
REPLICATE_API_TOKEN=YOUR_REPLICATE_TOKEN_HERE
STABILITY_API_KEY=YOUR_STABILITY_KEY_HERE
RUNPOD_API_KEY=YOUR_RUNPOD_KEY_HERE
GOOGLE_API_KEY=YOUR_GOOGLE_KEY_HERE
REDIS_HOST=localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/syndi
```

---

## 🤖 Агент 04: ARTISAN (Fullstack Craftsman)

### Обязанности
- Frontend (Next.js, Tailwind)
- Android (Kotlin + Jetpack Compose)
- UI/UX реализация
- WebRTC для видеозвонков

### Используемые модели и API

```yaml
AI Coding Assistants:
  Codex (GitHub):
    model: "gpt-4o-codex"
    purpose: "Генерация React-компонентов, Kotlin-экранов"
    api_key_var: "GITHUB_TOKEN"
    cost_estimate: "$0 (GitHub Copilot Pro)"

  Claude Code (Anthropic):
    model: "claude-sonnet-4-20250514"
    purpose: "Сложная frontend-архитектура, анимации"
    api_key_var: "ANTHROPIC_API_KEY"
    cost_estimate: "$0.80 / сессия"

  V0 (Vercel):
    purpose: "Генерация UI-компонентов по описанию"
    api_key_var: "VERCEL_TOKEN"
    cost_estimate: "Бесплатно (preview)"

Real-time Communication:
  WebRTC:
    purpose: "P2P видеозвонки между аватарами"
    STUN: "stun:stun.l.google.com:19302"
    TURN: "turn:twilio.com" (см. Twilio API)

  Twilio (TURN/STUN серверы):
    account_sid_var: "TWILIO_ACCOUNT_SID"
    auth_token_var: "TWILIO_AUTH_TOKEN"
    purpose: "Релейные серверы для NAT traversal"
    cost_estimate: "$0.004/GB relayed"

  Socket.io:
    purpose: "Real-time messaging, signaling"
    hosting: "Self-hosted (Node.js)"

  Firebase Cloud Messaging:
    server_key_var: "FCM_SERVER_KEY"
    purpose: "Push-уведомления на Android"
    cost_estimate: "Бесплатно"

Analytics:
  PostHog:
    api_key_var: "POSTHOG_API_KEY"
    host: "https://app.posthog.com"
    purpose: "Product analytics, funnels, retention"

  Mixpanel:
    token_var: "MIXPANEL_TOKEN"
    purpose: "Marketing analytics"
```

### Пример .env
```bash
# === ARTISAN: Fullstack ===
GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY_HERE
TWILIO_ACCOUNT_SID=YOUR_TWILIO_SID_HERE
TWILIO_AUTH_TOKEN=YOUR_TWILIO_TOKEN_HERE
FCM_SERVER_KEY=YOUR_FCM_KEY_HERE
POSTHOG_API_KEY=YOUR_POSTHOG_KEY_HERE
MIXPANEL_TOKEN=YOUR_MIXPANEL_TOKEN_HERE
```

---

## 🤖 Агент 05: CUSTOS (Data Guardian)

### Обязанности
- Защита PII
- GDPR compliance
- Fraud detection
- Аудит безопасности

### Используемые модели и API

```yaml
Security & Compliance APIs:
  HashiCorp Vault:
    address_var: "VAULT_ADDR"
    token_var: "VAULT_TOKEN"
    purpose: "Хранение секретов, API keys, шифрование"
    cost_estimate: "Self-hosted (free) / HCP Vault $0.03/hour"

  AWS Macie:
    purpose: "Автоматическое обнаружение PII в данных"
    credentials: "AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY"
    cost_estimate: "$1.00 / 1GB обработанных данных"

  Snyk:
    api_key_var: "SNYK_TOKEN"
    purpose: "Сканирование зависимостей на уязвимости"
    cost_estimate: "$52/месяц (Team)"

  SonarQube:
    purpose: "Статический анализ кода на security issues"
    hosting: "Self-hosted"

Fraud Detection ML:
  Custom Isolation Forest:
    framework: "scikit-learn"
    purpose: "Обнаружение аномалий (fake profiles)"
    hosting: "SageMaker endpoint"

  Graph Neural Network:
    framework: "PyTorch Geometric"
    purpose: "Обнаружение бот-сетей (связанных фейковых аккаунтов)"
    hosting: "SageMaker"

Audit & Compliance:
  AWS QLDB:
    purpose: "Immutable audit logs"
    cost_estimate: "$0.40 / 1M I/O"

  OneTrust (GDPR):
    api_key_var: "ONETRUST_API_KEY"
    purpose: "Управление согласиями, GDPR reporting"
```

### Пример .env
```bash
# === CUSTOS: Security ===
VAULT_ADDR=https://vault.syndi.ai:8200
VAULT_TOKEN=YOUR_VAULT_TOKEN_HERE
AWS_ACCESS_KEY_ID=YOUR_AWS_KEY_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_HERE
SNYK_TOKEN=YOUR_SNYK_TOKEN_HERE
ONETRUST_API_KEY=YOUR_ONETRUST_KEY_HERE
```

---

## 🤖 Агент 06: AUGUR (Product Oracle)

### Обязанности
- Product analytics
- A/B тестирование
- Монетизация
- Growth loops

### Используемые модели и API

```yaml
Analytics & Growth APIs:
  PostHog:
    api_key_var: "POSTHOG_API_KEY"
    host_var: "POSTHOG_HOST"
    purpose: "Event tracking, funnels, retention, A/B testing"
    cost_estimate: "Бесплатно (до 1M events/month)"

  GrowthBook:
    api_key_var: "GROWTHBOOK_API_KEY"
    purpose: "Feature flags + experiment analysis"
    cost_estimate: "Бесплатно (self-hosted)"

  HubSpot:
    api_key_var: "HUBSPOT_API_KEY"
    purpose: "CRM для founder nurture"
    cost_estimate: "$45/месяц (Starter)"

  Customer.io:
    site_id_var: "CUSTOMERIO_SITE_ID"
    api_key_var: "CUSTOMERIO_API_KEY"
    purpose: "Behavioral email campaigns"
    cost_estimate: "$100/месяц"

Monetization:
  Stripe:
    secret_key_var: "STRIPE_SECRET_KEY"
    publishable_key_var: "STRIPE_PUBLISHABLE_KEY"
    webhook_secret_var: "STRIPE_WEBHOOK_SECRET"
    purpose: "Подписки, платежи"
    cost_estimate: "$0.30 + 2.9% за транзакцию"

  Paddle (альтернатива для EU):
    api_key_var: "PADDLE_API_KEY"
    vendor_id_var: "PADDLE_VENDOR_ID"
    purpose: "Подписки с автоматическим налогом"

AI для Growth:
  GPT-4o (OpenAI):
    model: "gpt-4o-mini"
    purpose: "Генерация email-кампаний, copywriting для landing"
    api_key_var: "OPENAI_API_KEY"
    cost_estimate: "$0.50 / 1000 emails"

  Claude 3.5 (Anthropic):
    purpose: "Анализ метрик, рекомендации по продукту"
    api_key_var: "ANTHROPIC_API_KEY"
```

### Пример .env
```bash
# === AUGUR: Product ===
POSTHOG_API_KEY=YOUR_POSTHOG_KEY_HERE
POSTHOG_HOST=https://app.posthog.com
GROWTHBOOK_API_KEY=YOUR_GROWTHBOOK_KEY_HERE
HUBSPOT_API_KEY=YOUR_HUBSPOT_KEY_HERE
CUSTOMERIO_SITE_ID=YOUR_CUSTOMERIO_SITE_HERE
CUSTOMERIO_API_KEY=YOUR_CUSTOMERIO_KEY_HERE
STRIPE_SECRET_KEY=YOUR_STRIPE_KEY_HERE
STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PK_HERE
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_HERE
PADDLE_API_KEY=YOUR_PADDLE_KEY_HERE
PADDLE_VENDOR_ID=YOUR_PADDLE_VENDOR_HERE
```

---

## 🤖 Агент 07: SPROCKET (DevOps Maestro)

### Обязанности
- GitHub Agent HQ / Mission Control
- CI/CD pipeline
- Agent orchestration
- Cost optimization

### Используемые модели и API

```yaml
Agent Orchestration:
  GitHub Agent HQ:
    api_key_var: "GITHUB_TOKEN"    # Права: repo, workflow, admin:org
    purpose: "Mission Control для всех агентов"
    cost_estimate: "$0 (входит в GitHub Enterprise)"

  OpenSpec / Spec Kit:
    purpose: "Spec-driven development, PRD generation"
    hosting: "Self-hosted (Python FastAPI)"

  MCP (Model Context Protocol):
    purpose: "Связь агентов с внешними инструментами"
    endpoints:
      - GitHub MCP Server
      - Custom Internal MCPs (deploy, monitor)

Infrastructure:
  Terraform:
    token_var: "TF_API_TOKEN"
    purpose: "Infrastructure as Code"

  ArgoCD:
    server_var: "ARGOCD_SERVER"
    auth_token_var: "ARGOCD_AUTH_TOKEN"
    purpose: "GitOps, continuous delivery"

  Datadog:
    api_key_var: "DATADOG_API_KEY"
    purpose: "Agent performance dashboard"

Cost Optimization:
  AWS Cost Explorer:
    purpose: "Анализ расходов, recommendations"

  Spot.io (NetApp):
    api_key_var: "SPOT_IO_API_KEY"
    purpose: "Spot instance orchestration"

Observability:
  Prometheus + Grafana:
    purpose: "Metrics, SLOs, error budgets"
    hosting: "Self-hosted (Kubernetes)"

  Jaeger:
    purpose: "Distributed tracing (OpenTelemetry)"

  Loki:
    purpose: "Log aggregation"
```

### Пример .env
```bash
# === SPROCKET: DevOps ===
GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
TF_API_TOKEN=YOUR_TF_TOKEN_HERE
ARGOCD_SERVER=argocd.syndi.ai
ARGOCD_AUTH_TOKEN=YOUR_ARGOCD_TOKEN_HERE
DATADOG_API_KEY=YOUR_DATADOG_KEY_HERE
SPOT_IO_API_KEY=YOUR_SPOTIO_KEY_HERE
```

---

## 📊 Summary — Все API Keys

### Обязательные для MVP (Phase 1)

| # | Переменная | Назначение | Примерная стоимость/месяц |
|---|-----------|-----------|---------------------------|
| 1 | `OPENAI_API_KEY` | LLM для OCEAN + Avatar | $20-50 |
| 2 | `ANTHROPIC_API_KEY` | Fallback LLM + Claude Code | $20-30 |
| 3 | `ELEVENLABS_API_KEY` | Голосовой клон аватара | $5-20 |
| 4 | `QDRANT_API_KEY` + `QDRANT_URL` | Векторная БД | $10-30 |
| 5 | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` | Инфраструктура | $50-200 |
| 6 | `DATABASE_URL` (PostgreSQL) | Основная БД | $15-50 |
| 7 | `REDIS_HOST` | Кэш / сессии | $10-30 |
| 8 | `GITHUB_TOKEN` | Agent HQ, CI/CD | $0 (Copilot Pro ~$20) |
| 9 | `STRIPE_SECRET_KEY` | Платежи | $0 (pay per use) |
| 10 | `POSTHOG_API_KEY` | Аналитика | $0 (до 1M events) |

**Итого MVP:** ~$150-500/месяц

### Опциональные (Phase 2+)

| Переменная | Назначение | Когда нужно |
|-----------|-----------|-------------|
| `REPLICATE_API_TOKEN` | SDXL / FLUX.1 API | Для генерации аватаров без self-hosting |
| `STABILITY_API_KEY` | Альтернатива Replicate | Backup image generation |
| `RUNPOD_API_KEY` | Self-hosted GPU | Для GPU-intensive задач |
| `GOOGLE_API_KEY` | Gemini для multimodal | Emotion detection с видео |
| `PINECONE_API_KEY` | Альтернатива Qdrant | Если Qdrant не подходит |
| `HF_API_TOKEN` | Hugging Face Inference | Hosted embedding models |
| `WANDB_API_KEY` | Experiment tracking | ML model development |
| `SNYK_TOKEN` | Security scanning | Security audit pipeline |
| `VAULT_TOKEN` | Secret management | Production secrets |
| `DATADOG_API_KEY` | Monitoring | Production observability |
| `SENTRY_DSN` | Error tracking | Production error monitoring |
| `TWILIO_*` | WebRTC TURN/STUN | Video calls |
| `FCM_SERVER_KEY` | Push notifications | Android app |
| `MIXPANEL_TOKEN` | Marketing analytics | Growth phase |
| `HUBSPOT_API_KEY` | CRM | Enterprise customers |
| `PADDLE_API_KEY` | EU payments | EU market expansion |
| `SPOT_IO_API_KEY` | Cost optimization | Scale phase |

---

## 🔒 Безопасность API Keys

### Правила хранения:
1. **НИКОГДА** не коммитьте API keys в git
2. Используйте **HashiCorp Vault** в production
3. Для development — **`.env.local`** (добавлен в `.gitignore`)
4. Для CI/CD — **GitHub Secrets** (Settings → Secrets and variables → Actions)

### GitHub Secrets для репозитория:

Настройте в https://github.com/donjonson-hash/AI-avatar_command/settings/secrets/actions:

```
ANTHROPIC_API_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
ELEVENLABS_API_KEY
OPENAI_API_KEY
POSTHOG_API_KEY
QDRANT_API_KEY
QDRANT_URL
REDIS_HOST
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### .gitignore (уже настроен):
```gitignore
.env
.env.local
.env.production
*.pem
*.key
```
