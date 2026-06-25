// Live AI generation. Provider-pluggable via GETS_PROVIDER:
//   gemini    — Google Gemini 2.5 Flash (free tier, strong Tagalog)  [default]
//   groq      — Llama 3.3 70B (free, fastest)
//   anthropic — Claude Haiku 4.5 (best quality, needs paid credit)
// If GETS_PROVIDER is unset we auto-pick by whichever key is present.
// Keys come from the environment — never hardcoded, never sent to the browser.
import Anthropic from '@anthropic-ai/sdk'
import {
  buildSystem,
  buildLessonPrompt,
  buildPracticePrompt,
  PRACTICE_SCHEMA,
} from './prompts.mjs'

// OpenAI-compatible providers (Gemini + Groq) share one code path.
const OPENAI_COMPAT = {
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keyName: 'GEMINI_API_KEY',
    model: () => process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyName: 'GROQ_API_KEY',
    model: () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
}

export function activeProvider() {
  if (process.env.GETS_PROVIDER) return process.env.GETS_PROVIDER
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.GROQ_API_KEY) return 'groq'
  return 'anthropic'
}

export function requiredKeyName() {
  const p = activeProvider()
  if (OPENAI_COMPAT[p]) return OPENAI_COMPAT[p].keyName
  return 'ANTHROPIC_API_KEY'
}
export function keyPresent() {
  return Boolean(process.env[requiredKeyName()])
}

// ---- OpenAI-compatible (Gemini, Groq) --------------------------------------
async function openaiCompatChat({ provider, system, user, json }) {
  const cfg = OPENAI_COMPAT[provider]
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env[cfg.keyName]}`,
    },
    body: JSON.stringify({
      model: cfg.model(),
      max_tokens: 1024,
      temperature: 0.6,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${provider} ${res.status}: ${body.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function compatLesson(provider, { subject, topic, strategy, language, mood, shorter }) {
  const text = await openaiCompatChat({
    provider,
    system: buildSystem(language),
    user: buildLessonPrompt({ subject, topic, strategy, mood, shorter }),
  })
  return { text: text.trim() }
}

async function compatPractice(provider, { subject, topic, language, difficulty = 'on-level' }) {
  const user =
    buildPracticePrompt({ subject, topic, difficulty }) +
    '\n\nRespond with ONLY a JSON object of this exact shape: ' +
    '{"questions":[{"question":string,"choices":[string,string,string,string],' +
    '"answerIndex":number,"explanation":string}]}.'
  const raw = await openaiCompatChat({ provider, system: buildSystem(language), user, json: true })
  return JSON.parse(raw)
}

// ---- Anthropic (Claude) ----------------------------------------------------
const ANTHROPIC_MODEL = process.env.GETS_MODEL || 'claude-haiku-4-5'
let _anthropic
function anthropic() {
  if (!_anthropic) _anthropic = new Anthropic() // reads ANTHROPIC_API_KEY
  return _anthropic
}
function anthropicText(message) {
  return message.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
}

async function anthropicLesson({ subject, topic, strategy, language, mood, shorter }) {
  const message = await anthropic().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: buildSystem(language),
    messages: [
      { role: 'user', content: buildLessonPrompt({ subject, topic, strategy, mood, shorter }) },
    ],
  })
  return { text: anthropicText(message).trim() }
}

async function anthropicPractice({ subject, topic, language, difficulty = 'on-level' }) {
  const message = await anthropic().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: buildSystem(language),
    messages: [{ role: 'user', content: buildPracticePrompt({ subject, topic, difficulty }) }],
    output_config: { format: { type: 'json_schema', schema: PRACTICE_SCHEMA } },
  })
  return JSON.parse(anthropicText(message))
}

// ---- Dispatch --------------------------------------------------------------
export async function generateLesson(params) {
  const p = activeProvider()
  return OPENAI_COMPAT[p] ? compatLesson(p, params) : anthropicLesson(params)
}
export async function generatePractice(params) {
  const p = activeProvider()
  return OPENAI_COMPAT[p] ? compatPractice(p, params) : anthropicPractice(params)
}
