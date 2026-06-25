// UI copy + topic/strategy config. Subject and topic are isolated here so
// adding subjects/topics later is a config change, not a code change.

export const SUBJECT = 'Mathematics'
export const TOPIC = 'Polygons'

export const STRATEGIES = [
  { id: 'text_voice', label: { en: 'Read & listen', tl: 'Basahin' }, emoji: '📖' },
  { id: 'worked_example', label: { en: 'Worked example', tl: 'Halimbawa' }, emoji: '✏️' },
  { id: 'socratic', label: { en: 'Guiding questions', tl: 'Mga tanong' }, emoji: '❓' },
  { id: 'gamified', label: { en: 'Quest mode', tl: 'Quest' }, emoji: '🎮' },
  { id: 'eli5', label: { en: 'Super simple', tl: 'Pinakasimple' }, emoji: '🌱' },
]
export const STRATEGY_ORDER = STRATEGIES.map((s) => s.id)

export const T = {
  en: {
    tagline: 'Your study buddy',
    listen: '🔊 Listen',
    stop: '⏹ Stop',
    again: 'Explain a different way',
    stuck: "I don't get it 😕",
    practice: 'Practice →',
    back: '← Back to lesson',
    correct: 'Correct! 🎉',
    tryAgain: 'Not quite — give it another look',
    teachAgain: 'Teach me this again',
    score: 'Score',
    done: "You finished — great effort! 🌟",
    offline: 'Offline — showing saved lesson',
    loading: 'Thinking…',
  },
  tl: {
    tagline: 'Iyong study buddy',
    listen: '🔊 Pakinggan',
    stop: '⏹ Itigil',
    again: 'Ibang paraan',
    stuck: 'Hindi ko maintindihan 😕',
    practice: 'Pagsasanay →',
    back: '← Balik sa aralin',
    correct: 'Tama! 🎉',
    tryAgain: 'Halos na — tingnan ulit',
    teachAgain: 'Ituro ulit ito',
    score: 'Iskor',
    done: 'Tapos ka na — galing! 🌟',
    offline: 'Offline — ipinapakita ang naka-save',
    loading: 'Nag-iisip…',
  },
}
