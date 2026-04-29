/**
 * apiClient.ts — Syndi-AI
 * Universal AI provider client with Russia-compatible routing.
 *
 * Provider priority (auto-selected via VITE_AI_PROVIDER):
 *   deepseek  → DeepSeek V3 / DeepSeek Coder  (direct, works from RU)
 *   genapi    → GenAPI.ru proxy → GPT-4o / Claude Sonnet (rubles, no VPN)
 *   yandex    → YandexGPT 5 Pro / SpeechKit    (Yandex Cloud, rubles)
 *   openai    → OpenAI direct (needs VPN from RU)
 *
 * Agent routing:
 *   Vesper    → deepseek-coder  (code generation)
 *   Synthia   → deepseek-chat   (embeddings / Q&A)
 *   Eidolon   → deepseek-chat + yandex-speechkit + kandinsky
 *   Artisan   → deepseek-coder  (UI generation)
 *   Custos    → deepseek-chat   (security analysis)
 *   Augur     → deepseek-chat   (analytics / growth)
 *   Sprocket  → deepseek-chat   (devops orchestration)
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type AIProvider = 'deepseek' | 'genapi' | 'yandex' | 'openai';

export type AgentName =
  | 'vesper'
  | 'synthia'
  | 'eidolon'
  | 'artisan'
  | 'custos'
  | 'augur'
  | 'sprocket'
  | 'kristina'; // Lead PM — uses deepseek-chat

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  agent?: AgentName;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TTSRequest {
  text: string;
  voice?: string;    // yandex: 'alena' | 'ermil' | 'jane' | 'omazh'
  lang?: string;     // 'ru-RU' | 'en-US'
  speed?: number;    // 0.1 – 3.0
}

export interface ImageGenRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  style?: 'DEFAULT' | 'KANDINSKY' | 'UHD' | 'ANIME';
}

// ─── Provider Config ─────────────────────────────────────────────────────────

const PROVIDER_CONFIGS: Record<AIProvider, { baseUrl: string; authHeader: () => string }> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    authHeader: () => `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY ?? ''}`,
  },
  genapi: {
    // GenAPI.ru — Russian proxy to GPT-4o, Claude, Gemini. Pay in rubles.
    // Register: https://genapi.ru
    baseUrl: import.meta.env.VITE_GENAPI_BASE_URL ?? 'https://api.gen-api.ru/api/v1/networks',
    authHeader: () => `Bearer ${import.meta.env.VITE_GENAPI_API_KEY ?? ''}`,
  },
  yandex: {
    // YandexGPT — https://cloud.yandex.ru/services/yandexgpt
    baseUrl: 'https://llm.api.cloud.yandex.net/foundationModels/v1',
    authHeader: () => `Api-Key ${import.meta.env.VITE_YANDEX_API_KEY ?? ''}`,
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    authHeader: () => `Bearer ${import.meta.env.VITE_OPENAI_API_KEY ?? ''}`,
  },
};

// ─── Agent → Model Mapping ───────────────────────────────────────────────────

const AGENT_MODELS: Record<AgentName, { provider: AIProvider; model: string; systemPrompt: string }> = {
  vesper: {
    provider: 'deepseek',
    model: 'deepseek-coder',
    systemPrompt:
      'You are Vesper, an expert software engineer. You write clean, typed, production-ready code. ' +
      'Prefer TypeScript, React, FastAPI, Python. Always include error handling.',
  },
  synthia: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Synthia, a semantic search and knowledge retrieval specialist. ' +
      'You analyze user profiles, extract skills and intentions, and find the best matches. ' +
      'Respond in JSON when asked for structured data.',
  },
  eidolon: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Eidolon, an AI avatar personality engine. ' +
      'You generate natural, human-like dialogue based on OCEAN personality profiles. ' +
      'Match tone, vocabulary, and energy to the personality scores provided.',
  },
  artisan: {
    provider: 'deepseek',
    model: 'deepseek-coder',
    systemPrompt:
      'You are Artisan, a UI/UX code generator. You create React + TypeScript + Tailwind components. ' +
      'Output only code. No explanations unless asked. Follow shadcn/ui patterns.',
  },
  custos: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Custos, a security analysis agent. ' +
      'You detect anomalies, review code for vulnerabilities, and report threats concisely. ' +
      'Rate severity: LOW | MEDIUM | HIGH | CRITICAL.',
  },
  augur: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Augur, a growth and analytics agent. ' +
      'You interpret user metrics, suggest A/B tests, and generate actionable growth recommendations. ' +
      'Be data-driven. Use percentages and numbers.',
  },
  sprocket: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Sprocket, a DevOps orchestration agent. ' +
      'You manage GitHub workflows, Terraform plans, and deployment pipelines. ' +
      'Output CLI commands and YAML configs when relevant.',
  },
  kristina: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemPrompt:
      'You are Kristina, Lead Project Manager of Syndi-AI. ' +
      'You coordinate the agent team (Vesper, Synthia, Eidolon, Artisan, Custos, Augur, Sprocket). ' +
      'You prioritize tasks, manage the backlog, track sprint goals, and report project status. ' +
      'Be concise, structured, and decisive. Use bullet points and markdown.',
  },
};

// ─── Active provider (override via VITE_AI_PROVIDER) ─────────────────────────

function getActiveProvider(agentName?: AgentName): AIProvider {
  const envOverride = import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined;
  if (envOverride && PROVIDER_CONFIGS[envOverride]) return envOverride;
  if (agentName) return AGENT_MODELS[agentName].provider;
  return 'deepseek'; // default
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  provider: AIProvider,
  path: string,
  body: unknown,
  options: { method?: string } = {},
): Promise<T> {
  const config = PROVIDER_CONFIGS[provider];
  const url = `${config.baseUrl}${path}`;

  const res = await fetch(url, {
    method: options.method ?? 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.authHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`[${provider}] ${res.status}: ${errText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Chat Completion ─────────────────────────────────────────────────────────

export async function chatCompletion(request: ChatRequest): Promise<ChatResponse> {
  const agentName = request.agent;
  const provider = getActiveProvider(agentName);
  const agentConfig = agentName ? AGENT_MODELS[agentName] : null;
  const model = agentConfig?.model ?? 'deepseek-chat';

  const messages: ChatMessage[] = agentConfig?.systemPrompt
    ? [{ role: 'system', content: agentConfig.systemPrompt }, ...request.messages]
    : request.messages;

  if (provider === 'yandex') {
    return chatCompletionYandex(messages, request);
  }

  // OpenAI-compatible format (DeepSeek, GenAPI, OpenAI)
  interface OAIResponse {
    choices: Array<{ message: { content: string } }>;
    model: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }

  const data = await apiFetch<OAIResponse>(provider, '/chat/completions', {
    model,
    messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens ?? 2048,
  });

  return {
    content: data.choices[0]?.message?.content ?? '',
    model: data.model,
    provider,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined,
  };
}

// YandexGPT uses a different API shape
async function chatCompletionYandex(messages: ChatMessage[], request: ChatRequest): Promise<ChatResponse> {
  const folderId = import.meta.env.VITE_YANDEX_FOLDER_ID ?? '';
  const modelUri = `gpt://${folderId}/yandexgpt/latest`;

  interface YandexResponse {
    result: {
      alternatives: Array<{ message: { text: string } }>;
      usage: { inputTextTokens: string; completionTokens: string; totalTokens: string };
    };
  }

  const data = await apiFetch<YandexResponse>('yandex', '/completion', {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: request.temperature ?? 0.6,
      maxTokens: String(request.maxTokens ?? 2000),
    },
    messages: messages.map((m) => ({ role: m.role, text: m.content })),
  });

  return {
    content: data.result.alternatives[0]?.message?.text ?? '',
    model: 'yandexgpt/latest',
    provider: 'yandex',
    usage: {
      promptTokens: Number(data.result.usage.inputTextTokens),
      completionTokens: Number(data.result.usage.completionTokens),
      totalTokens: Number(data.result.usage.totalTokens),
    },
  };
}

// ─── Text-to-Speech (Yandex SpeechKit) ───────────────────────────────────────

export async function textToSpeech(request: TTSRequest): Promise<Blob> {
  // Primary: Yandex SpeechKit (works from RU, rubles)
  // Fallback: silero-tts (local, see /backend/tts/silero_server.py)
  const iamToken = import.meta.env.VITE_YANDEX_API_KEY ?? '';
  const folderId = import.meta.env.VITE_YANDEX_FOLDER_ID ?? '';

  const params = new URLSearchParams({
    text: request.text,
    lang: request.lang ?? 'ru-RU',
    voice: request.voice ?? 'alena',
    speed: String(request.speed ?? 1.0),
    folderId,
    format: 'oggopus',
  });

  const res = await fetch(
    `https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize?${params.toString()}`,
    {
      method: 'POST',
      headers: { Authorization: `Api-Key ${iamToken}` },
    },
  );

  if (!res.ok) throw new Error(`[SpeechKit] ${res.status}: ${await res.text()}`);
  return res.blob();
}

// ─── Image Generation (Kandinsky 3.1 — Sber, works from RU) ──────────────────

export async function generateImage(request: ImageGenRequest): Promise<string> {
  // Kandinsky 3.1 API (fusionbrain.ai) — free tier, works from RU without VPN
  const apiKey = import.meta.env.VITE_KANDINSKY_API_KEY ?? '';
  const secretKey = import.meta.env.VITE_KANDINSKY_SECRET_KEY ?? '';
  const baseUrl = 'https://api-key.fusionbrain.ai/key/api/v1';

  // Step 1: get model ID
  const modelsRes = await fetch(`${baseUrl}/models`, {
    headers: { 'X-Key': `Key ${apiKey}`, 'X-Secret': `Secret ${secretKey}` },
  });
  const models = (await modelsRes.json()) as Array<{ id: number; name: string }>;
  const modelId = models[0]?.id ?? 4;

  // Step 2: submit generation
  const form = new FormData();
  form.append(
    'params',
    new Blob(
      [
        JSON.stringify({
          type: 'GENERATE',
          numImages: 1,
          width: request.width ?? 512,
          height: request.height ?? 512,
          generateParams: { query: request.prompt },
          negativePromptUnclip: request.negativePrompt ?? 'ugly, blurry, watermark',
          style: request.style ?? 'DEFAULT',
        }),
      ],
      { type: 'application/json' },
    ),
  );
  form.append('model_id', String(modelId));

  const genRes = await fetch(`${baseUrl}/text2image/run`, {
    method: 'POST',
    headers: { 'X-Key': `Key ${apiKey}`, 'X-Secret': `Secret ${secretKey}` },
    body: form,
  });
  const { uuid } = (await genRes.json()) as { uuid: string };

  // Step 3: poll for result
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const checkRes = await fetch(`${baseUrl}/text2image/status/${uuid}`, {
      headers: { 'X-Key': `Key ${apiKey}`, 'X-Secret': `Secret ${secretKey}` },
    });
    const status = (await checkRes.json()) as { status: string; images?: string[] };
    if (status.status === 'DONE' && status.images?.[0]) {
      return `data:image/jpeg;base64,${status.images[0]}`;
    }
    if (status.status === 'FAIL') throw new Error('[Kandinsky] Generation failed');
  }
  throw new Error('[Kandinsky] Timeout waiting for image');
}

// ─── Embeddings (DeepSeek / local sentence-transformers) ─────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  // DeepSeek does not expose embeddings endpoint — use local backend
  // Run: cd backend && python -m uvicorn embed_server:app --port 8001
  // Or swap for OpenAI-compatible endpoint via GenAPI
  const backendUrl = import.meta.env.VITE_EMBED_SERVER_URL ?? 'http://localhost:8001';

  const res = await fetch(`${backendUrl}/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`[Embed] ${res.status}`);
  const data = (await res.json()) as { embedding: number[] };
  return data.embedding;
}

// ─── Convenience wrappers per agent ──────────────────────────────────────────

export const Vesper = {
  generate: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'vesper', ...opts }),
};

export const Synthia = {
  analyze: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'synthia', ...opts }),
};

export const Eidolon = {
  speak: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'eidolon', ...opts }),
  tts: (text: string, voice?: string) => textToSpeech({ text, voice }),
  image: (prompt: string) => generateImage({ prompt }),
};

export const Artisan = {
  generate: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'artisan', ...opts }),
};

export const Custos = {
  audit: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'custos', ...opts }),
};

export const Augur = {
  analyze: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'augur', ...opts }),
};

export const Sprocket = {
  run: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'sprocket', ...opts }),
};

export const Kristina = {
  coordinate: (prompt: string, opts?: Partial<ChatRequest>) =>
    chatCompletion({ messages: [{ role: 'user', content: prompt }], agent: 'kristina', ...opts }),
};

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkProviderHealth(): Promise<Record<AIProvider, boolean>> {
  const results = {} as Record<AIProvider, boolean>;
  const providers: AIProvider[] = ['deepseek', 'genapi', 'yandex', 'openai'];

  await Promise.allSettled(
    providers.map(async (p) => {
      try {
        await chatCompletion({
          messages: [{ role: 'user', content: 'ping' }],
          maxTokens: 5,
        });
        results[p] = true;
      } catch {
        results[p] = false;
      }
    }),
  );

  return results;
}
