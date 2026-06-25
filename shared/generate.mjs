// Live AI generation via the Anthropic SDK. Used by the proxy and the pre-seed
// script. The API key comes from ANTHROPIC_API_KEY in the environment — never
// hardcoded, never sent to the browser.
import Anthropic from '@anthropic-ai/sdk'
import {
  buildSystem,
  buildLessonPrompt,
  buildPracticePrompt,
  PRACTICE_SCHEMA,
} from './prompts.mjs'

// Haiku 4.5: fast + cheap, ideal for short bilingual lessons over low bandwidth.
const MODEL = process.env.GETS_MODEL || 'claude-haiku-4-5'

let _client
function client() {
  if (!_client) _client = new Anthropic() // reads ANTHROPIC_API_KEY
  return _client
}

function textOf(message) {
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
}

export async function generateLesson({
  subject,
  topic,
  strategy,
  language,
  mood,
  shorter,
}) {
  const message = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystem(language),
    messages: [
      {
        role: 'user',
        content: buildLessonPrompt({ subject, topic, strategy, mood, shorter }),
      },
    ],
  })
  return { text: textOf(message).trim() }
}

export async function generatePractice({
  subject,
  topic,
  language,
  difficulty = 'on-level',
}) {
  const message = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystem(language),
    messages: [
      { role: 'user', content: buildPracticePrompt({ subject, topic, difficulty }) },
    ],
    // Structured output guarantees parseable, schema-valid questions.
    output_config: { format: { type: 'json_schema', schema: PRACTICE_SCHEMA } },
  })
  return JSON.parse(textOf(message))
}
