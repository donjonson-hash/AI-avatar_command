# Syndi-AI — Embed Server (Synthia Backend)

FastAPI сервер для семантического поиска. Обслуживает агента **Synthia**.

## Стек

| Компонент | Библиотека | Назначение |
|---|---|---|
| **HTTP API** | FastAPI + Uvicorn | REST endpoints |
| **Эмбеддинги** | sentence-transformers | Перевод текста → вектор |
| **Русская модель** | `intfloat/multilingual-e5-large` | RU + EN, 1024-dim |
| **Быстрая EN** | `all-MiniLM-L6-v2` | EN only, 384-dim |
| **Код** | `st-codesearch-distilroberta-base` | Поиск по коду |
| **Vector DB** | Qdrant | Хранение и поиск |

## Быстрый старт

```bash
cd backend

# Создать venv
python3 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Запустить Qdrant (Docker)
docker run -d -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_data:/qdrant/storage \
  qdrant/qdrant

# Запустить сервер
uvicorn embed_server:app --host 0.0.0.0 --port 8001 --reload
```

Сервер запустится на `http://localhost:8001`.
Документация API: `http://localhost:8001/docs`

## Endpoints

### `POST /embed` — один текст
```json
{
  "text": "Привет, я разработчик Python",
  "lang": "ru",
  "prefix": "query: "
}
```
Ответ: `{ "embedding": [...1024 float...], "dim": 1024, "elapsed_ms": 45.2 }`

### `POST /embed/batch` — пакет текстов
```json
{ "texts": ["текст 1", "текст 2"], "lang": "ru" }
```

### `POST /upsert` — добавить профиль в Qdrant
```json
{
  "items": [{
    "id": "user_42",
    "text": "Senior Python developer, FastAPI, PostgreSQL",
    "payload": { "name": "Кристина", "role": "PM", "agent": "kristina" },
    "lang": "ru",
    "prefix": "passage: "
  }]
}
```

### `POST /search` — семантический поиск
```json
{
  "query": "Нужен PM с опытом в Agile",
  "top_k": 5,
  "lang": "ru",
  "prefix": "query: ",
  "filter_payload": { "agent": "kristina" },
  "score_threshold": 0.6
}
```

### `GET /health` — статус
```json
{ "status": "ok", "loaded_models": ["ru"], "qdrant": true }
```

## Переменные окружения (`.env.local`)

```bash
EMBED_MODEL_RU=intfloat/multilingual-e5-large
EMBED_MODEL_EN=sentence-transformers/all-MiniLM-L6-v2
EMBED_DEFAULT_LANG=ru

QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=              # оставь пустым для self-hosted
QDRANT_COLLECTION=syndi_profiles

VITE_EMBED_SERVER_URL=http://localhost:8001
```

## Использование из фронта (apiClient.ts)

```typescript
import { getEmbedding } from '@/lib/apiClient';

const vec = await getEmbedding('Ищу Python разработчика');
// vec — float[] длиной 1024
```

## Примечание по моделям

- `multilingual-e5-large` — ~1.1 GB, скачивается при первом запуске
- Для CPU-only сервера достаточно, работает без GPU
- Для ускорения: `pip install torch --index-url https://download.pytorch.org/whl/cu121`
