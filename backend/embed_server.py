"""
embed_server.py — Synthia Embedding Backend
Syndi-AI | FastAPI + sentence-transformers + Qdrant

Endpoints:
  POST /embed          — encode single text → float[] vector
  POST /embed/batch    — encode list of texts → float[][] vectors
  POST /upsert         — upsert vector(s) into Qdrant collection
  POST /search         — semantic nearest-neighbour search in Qdrant
  GET  /health         — server + model status

Run:
  cd backend
  pip install -r requirements.txt
  uvicorn embed_server:app --host 0.0.0.0 --port 8001 --reload

Model priority (auto-selected based on task):
  ru:  intfloat/multilingual-e5-large   (Russian + English, 1024-dim)
  en:  sentence-transformers/all-MiniLM-L6-v2 (English only, 384-dim, fast)
  code: flax-sentence-embeddings/st-codesearch-distilroberta-base
"""

from __future__ import annotations

import os
import time
import logging
from contextlib import asynccontextmanager
from typing import Any

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
    Filter,
    FieldCondition,
    MatchValue,
)

load_dotenv(dotenv_path="../.env.local", override=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("embed_server")

# ─── Config ──────────────────────────────────────────────────────────────────

MODEL_RU   = os.getenv("EMBED_MODEL_RU",   "intfloat/multilingual-e5-large")
MODEL_EN   = os.getenv("EMBED_MODEL_EN",   "sentence-transformers/all-MiniLM-L6-v2")
MODEL_CODE = os.getenv("EMBED_MODEL_CODE", "flax-sentence-embeddings/st-codesearch-distilroberta-base")
DEFAULT_LANG = os.getenv("EMBED_DEFAULT_LANG", "ru")  # ru | en | code

QDRANT_URL        = os.getenv("QDRANT_URL",        "http://localhost:6333")
QDRANT_API_KEY    = os.getenv("QDRANT_API_KEY",    None)
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "syndi_profiles")

# ─── Model registry ──────────────────────────────────────────────────────────

_models: dict[str, SentenceTransformer] = {}
_qdrant: QdrantClient | None = None


def _load_model(lang: str) -> SentenceTransformer:
    if lang not in _models:
        name = {"ru": MODEL_RU, "en": MODEL_EN, "code": MODEL_CODE}.get(lang, MODEL_RU)
        log.info("Loading model: %s (lang=%s)", name, lang)
        _models[lang] = SentenceTransformer(name)
        log.info("Model loaded. Embedding dim: %d", _models[lang].get_sentence_embedding_dimension())
    return _models[lang]


def _get_qdrant() -> QdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        log.info("Qdrant connected: %s", QDRANT_URL)
    return _qdrant


def _ensure_collection(dim: int) -> None:
    client = _get_qdrant()
    existing = [c.name for c in client.get_collections().collections]
    if QDRANT_COLLECTION not in existing:
        client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
        )
        log.info("Created Qdrant collection '%s' (dim=%d)", QDRANT_COLLECTION, dim)


# ─── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting embed_server — preloading default model...")
    model = _load_model(DEFAULT_LANG)
    _ensure_collection(model.get_sentence_embedding_dimension())
    log.info("embed_server ready.")
    yield
    log.info("embed_server shutting down.")


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Syndi-AI Embed Server (Synthia)",
    version="1.0.0",
    description="sentence-transformers + Qdrant backend for semantic search",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Schemas ─────────────────────────────────────────────────────────────────

class EmbedRequest(BaseModel):
    text: str
    lang: str = Field(DEFAULT_LANG, description="ru | en | code")
    prefix: str = Field("", description="Optional instruction prefix, e.g. 'query: ' for e5 models")


class EmbedBatchRequest(BaseModel):
    texts: list[str]
    lang: str = Field(DEFAULT_LANG)
    prefix: str = Field("")


class EmbedResponse(BaseModel):
    embedding: list[float]
    dim: int
    model: str
    elapsed_ms: float


class EmbedBatchResponse(BaseModel):
    embeddings: list[list[float]]
    dim: int
    model: str
    elapsed_ms: float


class UpsertItem(BaseModel):
    id: str | int
    text: str
    payload: dict[str, Any] = Field(default_factory=dict)
    lang: str = Field(DEFAULT_LANG)
    prefix: str = Field("passage: ")


class UpsertRequest(BaseModel):
    items: list[UpsertItem]
    collection: str | None = None


class SearchRequest(BaseModel):
    query: str
    top_k: int = Field(5, ge=1, le=50)
    lang: str = Field(DEFAULT_LANG)
    prefix: str = Field("query: ", description="Prefix for e5 query: 'query: '")
    collection: str | None = None
    filter_payload: dict[str, Any] | None = Field(
        None, description="Key-value filter on Qdrant payload, e.g. {\"agent\": \"synthia\"}"
    )
    score_threshold: float = Field(0.0, ge=0.0, le=1.0)


class SearchHit(BaseModel):
    id: str | int
    score: float
    payload: dict[str, Any]


class SearchResponse(BaseModel):
    hits: list[SearchHit]
    query_dim: int
    elapsed_ms: float


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    loaded = list(_models.keys())
    qdrant_ok = False
    try:
        _get_qdrant().get_collections()
        qdrant_ok = True
    except Exception:
        pass
    return {
        "status": "ok",
        "loaded_models": loaded,
        "qdrant": qdrant_ok,
        "collection": QDRANT_COLLECTION,
    }


@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest):
    t0 = time.perf_counter()
    model = _load_model(req.lang)
    text = f"{req.prefix}{req.text}" if req.prefix else req.text
    vec: list[float] = model.encode(text, normalize_embeddings=True).tolist()
    elapsed = (time.perf_counter() - t0) * 1000
    return EmbedResponse(
        embedding=vec,
        dim=len(vec),
        model=model.get_model_card_data().model_name or req.lang,
        elapsed_ms=round(elapsed, 2),
    )


@app.post("/embed/batch", response_model=EmbedBatchResponse)
def embed_batch(req: EmbedBatchRequest):
    t0 = time.perf_counter()
    model = _load_model(req.lang)
    texts = [f"{req.prefix}{t}" if req.prefix else t for t in req.texts]
    vecs: list[list[float]] = model.encode(texts, normalize_embeddings=True, batch_size=32).tolist()
    elapsed = (time.perf_counter() - t0) * 1000
    return EmbedBatchResponse(
        embeddings=vecs,
        dim=len(vecs[0]) if vecs else 0,
        model=model.get_model_card_data().model_name or req.lang,
        elapsed_ms=round(elapsed, 2),
    )


@app.post("/upsert")
def upsert(req: UpsertRequest):
    client = _get_qdrant()
    collection = req.collection or QDRANT_COLLECTION

    points: list[PointStruct] = []
    for item in req.items:
        model = _load_model(item.lang)
        text = f"{item.prefix}{item.text}" if item.prefix else item.text
        vec = model.encode(text, normalize_embeddings=True).tolist()
        _ensure_collection(len(vec))
        points.append(
            PointStruct(
                id=item.id if isinstance(item.id, int) else abs(hash(item.id)) % (2**63),
                vector=vec,
                payload={**item.payload, "_text": item.text, "_id_str": str(item.id)},
            )
        )

    client.upsert(collection_name=collection, points=points)
    return {"upserted": len(points), "collection": collection}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    t0 = time.perf_counter()
    client = _get_qdrant()
    collection = req.collection or QDRANT_COLLECTION

    model = _load_model(req.lang)
    query_text = f"{req.prefix}{req.query}" if req.prefix else req.query
    query_vec = model.encode(query_text, normalize_embeddings=True).tolist()

    qdrant_filter = None
    if req.filter_payload:
        conditions = [
            FieldCondition(key=k, match=MatchValue(value=v))
            for k, v in req.filter_payload.items()
        ]
        qdrant_filter = Filter(must=conditions)

    results = client.search(
        collection_name=collection,
        query_vector=query_vec,
        limit=req.top_k,
        query_filter=qdrant_filter,
        score_threshold=req.score_threshold if req.score_threshold > 0 else None,
    )

    hits = [
        SearchHit(
            id=r.payload.get("_id_str", str(r.id)),
            score=round(r.score, 4),
            payload={k: v for k, v in r.payload.items() if not k.startswith("_")},
        )
        for r in results
    ]

    elapsed = (time.perf_counter() - t0) * 1000
    return SearchResponse(hits=hits, query_dim=len(query_vec), elapsed_ms=round(elapsed, 2))
