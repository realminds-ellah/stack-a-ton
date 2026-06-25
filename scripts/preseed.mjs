// Pre-seed the offline cache. Run this ONCE while you have internet (before the
// demo). It generates every lesson strategy × language plus a practice set for
// the demo topic and writes them to public/seed-cache.json. The app loads that
// file into local storage on first run, so the whole demo then works offline.
//
// The cache keys here MUST match cacheKey() in src/lib/cache.js:
//   [subject, topic, strategy, language, kind, difficulty].join('::')
import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import { generateLesson, generatePractice } from '../shared/generate.mjs'
import { STRATEGY_IDS } from '../shared/prompts.mjs'

const SUBJECT = 'Mathematics'
const TOPIC = 'Polygons'
const LANGUAGES = ['en', 'tl']

const key = (parts) => parts.join('::')

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.')
  process.exit(1)
}

const out = {}

for (const language of LANGUAGES) {
  for (const strategy of STRATEGY_IDS) {
    process.stdout.write(`lesson  ${language} / ${strategy} … `)
    const data = await generateLesson({ subject: SUBJECT, topic: TOPIC, strategy, language })
    out[key([SUBJECT, TOPIC, strategy, language, 'lesson', ''])] = data
    console.log('ok')
  }
  process.stdout.write(`practice ${language} / on-level … `)
  const practice = await generatePractice({
    subject: SUBJECT,
    topic: TOPIC,
    language,
    difficulty: 'on-level',
  })
  out[key([SUBJECT, TOPIC, '', language, 'practice', 'on-level'])] = practice
  console.log('ok')
}

mkdirSync('public', { recursive: true })
writeFileSync('public/seed-cache.json', JSON.stringify(out, null, 2))
console.log(`\nWrote public/seed-cache.json — ${Object.keys(out).length} entries. The demo can now run offline.`)
