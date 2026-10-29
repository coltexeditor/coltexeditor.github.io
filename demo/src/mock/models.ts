// The demo server's AI providers and models: ColTex's own list (pi-ai's built-in providers,
// providers.json, made with demo/assets-src/dump-providers.mjs), of which DeepSeek and OpenRouter
// are connected, plus the lab's own GPU server as a self-hosted endpoint. What someone picks in the
// AI panel (model, thinking level, auto) is kept here like the server's ai_preferences.
import providers from './providers.json'

export type ModelInfo = { provider: string; id: string; name: string; contextWindow: number; reasoning: boolean; thinkingLevels: string[] }
export type Provider = { id: string; name: string; apiKey: string | null; oauth: { name: string; subscription: boolean } | null; modelCount: number; models: Omit<ModelInfo, 'provider'>[] }

export const PROVIDERS = providers as Provider[]
/** Connected with a stored API key. */
export const CONNECTED = ['deepseek', 'openrouter']

const withProvider = (p: Provider) => p.models.map(m => ({ ...m, provider: p.id }))
const DEEPSEEK = withProvider(PROVIDERS.find(p => p.id === 'deepseek')!)
const OPENROUTER = withProvider(PROVIDERS.find(p => p.id === 'openrouter')!)

/**
 * The lab's GPU server: Qwen3.8-27B served by vLLM (OpenAI-compatible) on the LAN, under its
 * Hugging Face id. As ColTex shows a self-hosted model: named by its id, no context window (the
 * server's own setting), and pi-ai's thinking levels for a model that reasons.
 */
export const LOCAL: ModelInfo = {
  provider: 'custom-lab-gpu',
  id: 'Qwen/Qwen3.8-27B',
  name: 'Qwen/Qwen3.8-27B',
  contextWindow: 0,
  reasoning: true,
  thinkingLevels: ['off', 'minimal', 'low', 'medium', 'high'],
}
export const CUSTOM_PROVIDERS = [
  {
    id: 'custom-lab-gpu',
    name: 'Lab GPU server (vLLM)',
    baseUrl: 'http://192.168.1.20:8000/v1',
    models: [{ id: LOCAL.id, contextWindow: 128_000, maxTokens: 16_384, reasoning: true }],
  },
]

/** DeepSeek V4.1 Flash: what people use most, and auto routing's strong model. */
export const STRONG = DEEPSEEK.find(m => m.id === 'deepseek-flash')!
export const MODELS: ModelInfo[] = [...DEEPSEEK, ...OPENROUTER, LOCAL]

export const findModel = (ref: { provider: string; id: string } | null | undefined) => (ref ? MODELS.find(m => m.provider === ref.provider && m.id === ref.id) : undefined)

/** A thinking level the model accepts: the one asked for, else the nearest weaker one, else its weakest. */
export function clampThinking(model: ModelInfo, level: string) {
  const order = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']
  if (model.thinkingLevels.includes(level)) return level
  const below = model.thinkingLevels.filter(l => order.indexOf(l) <= order.indexOf(level))
  return below.at(-1) ?? model.thinkingLevels[0] ?? 'off'
}

// The signed-in person's choice in the AI panel.
/**
 * The AI agent on the web: DeepSeek's search for the models without one of their own (Tavily
 * connected too). Every model then can search, so the agent's changes wait for review.
 */
export const web: { search: string | null; services: string[]; nativeOff: string[] } = { search: 'deepseek', services: ['deepseek', 'tavily'], nativeOff: [] }
export const webOn = () => web.search !== null

export const preference = { model: { provider: STRONG.provider, id: STRONG.id }, thinkingLevel: 'high', auto: false }

export function aiStatus() {
  const model = findModel(preference.model) ?? STRONG
  return {
    available: true,
    model,
    thinkingLevel: clampThinking(model, preference.thinkingLevel),
    models: MODELS,
    auto: { available: true, on: preference.auto, light: LOCAL, strong: STRONG },
    web: webOn(),
  }
}
