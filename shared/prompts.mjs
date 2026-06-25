// Prompt construction for GETS. Shared by the live proxy (server/) and the
// offline pre-seed script (scripts/). The five "ways to learn" are really five
// prompting strategies; the subject/topic/language are parameters so this
// generalises to any MATATAG topic without code changes.

const LANG = { en: 'English', tl: 'Filipino (Tagalog)' }

const STRATEGY_INSTRUCTIONS = {
  text_voice:
    'Explain the concept clearly in plain prose, as if speaking aloud to the student. Use short paragraphs.',
  worked_example:
    'Teach by example: fully solve ONE representative problem step by step. Then give a SECOND, similar problem and lay out the steps for the student to finish themselves — leave the final answer for them to complete.',
  socratic:
    'Teach by asking a short sequence of guiding questions that lead the student to discover the idea. Pose a question, write "(think about it...)", then reveal the insight, and continue to the next question.',
  gamified:
    'Frame the lesson as a short quest or challenge with a fun theme. Use a few "levels" or "missions" that each teach one piece of the concept. Keep it playful but accurate.',
  eli5:
    'Explain in the very simplest terms, as if to a younger child. Use everyday comparisons and the shortest possible sentences. Avoid all jargon.',
}

export const STRATEGY_IDS = Object.keys(STRATEGY_INSTRUCTIONS)

export function buildSystem(language) {
  const lang = LANG[language] || LANG.en
  return [
    `You are GETS, a warm, encouraging study companion for a Grade 7 student in the Philippines.`,
    `You follow the DepEd MATATAG curriculum. You are supportive and patient — a friendly companion, never a strict teacher.`,
    `Write your ENTIRE response in ${lang}.`,
    `Keep responses concise and mobile-friendly — short sentences, short paragraphs — because the student may be on a slow connection.`,
    `Use plain text only: simple line breaks, no markdown headers, no tables, no asterisks for bold.`,
  ].join(' ')
}

export function buildLessonPrompt({ subject, topic, strategy, mood, shorter }) {
  const parts = [
    `Teach this Grade 7 ${subject} topic: "${topic}".`,
    STRATEGY_INSTRUCTIONS[strategy] || STRATEGY_INSTRUCTIONS.text_voice,
  ]
  if (shorter)
    parts.push('Keep it especially short, broken into small, easy chunks.')
  if (mood && mood !== 'ok' && mood !== 'excited')
    parts.push(
      `The student is feeling ${mood} today, so be extra gentle, brief, and encouraging.`,
    )
  parts.push(
    'Aim for about 120–200 words. End with one warm sentence of encouragement.',
  )
  return parts.join('\n\n')
}

// Multiple-choice so answers can be auto-checked (drives the "got it wrong"
// re-teach flow). Structured outputs can't express array length limits, so we
// state the counts in the prompt instead.
export const PRACTICE_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          choices: { type: 'array', items: { type: 'string' } },
          answerIndex: { type: 'integer' },
          explanation: { type: 'string' },
        },
        required: ['question', 'choices', 'answerIndex', 'explanation'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
}

const DIFFICULTY_NOTE = {
  easier: 'Make the questions gentle and confidence-building.',
  'on-level': 'Pitch the questions at a typical Grade 7 level.',
  harder: 'Make the questions a bit more challenging to stretch the student.',
}

export function buildPracticePrompt({ subject, topic, difficulty = 'on-level' }) {
  return [
    `Write exactly 4 multiple-choice practice questions for the Grade 7 ${subject} topic "${topic}".`,
    DIFFICULTY_NOTE[difficulty] || DIFFICULTY_NOTE['on-level'],
    'Each question must have exactly 4 answer choices, the index (0-based) of the correct choice, and a one-sentence, encouraging explanation of why it is correct.',
    'Keep every question and choice short and clear.',
  ].join('\n\n')
}
