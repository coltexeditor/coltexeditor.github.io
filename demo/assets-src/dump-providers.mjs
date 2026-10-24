// Dumps pi-ai's built-in providers and models (what ColTex offers), for demo/src/mock/providers.json.
// Run with node from apps/server of a ColTex checkout; then keep DeepSeek's models and a few of OpenRouter's.
import { builtinProviders } from '@earendil-works/pi-ai/providers/all'
import { getSupportedThinkingLevels } from '@earendil-works/pi-ai'
const out = builtinProviders().map(p => ({
  id: p.id,
  name: p.name,
  apiKey: p.auth.apiKey?.login ? p.auth.apiKey.name : null,
  oauth: p.auth.oauth ? { name: p.auth.oauth.name, subscription: !!p.auth.oauth.isSubscription } : null,
  models: p.getModels().map(m => ({ id: m.id, name: m.name, contextWindow: m.contextWindow, reasoning: m.reasoning, thinkingLevels: getSupportedThinkingLevels(m), released: m.releaseDate ?? m.released ?? null })),
}))
console.log(JSON.stringify(out))
