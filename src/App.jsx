import { useEffect, useRef, useState } from 'react'
import { generate } from './lib/api'
import { ensureSeed } from './lib/cache'
import Practice from './components/Practice'
import { SUBJECT, TOPIC, STRATEGIES, STRATEGY_ORDER, T } from './strings'

export default function App() {
  const [language, setLanguage] = useState('en')
  const [strategy, setStrategy] = useState('text_voice')
  const [view, setView] = useState('lesson') // 'lesson' | 'practice'

  const [lesson, setLesson] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [offline, setOffline] = useState(false)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const t = T[language]

  // Load the offline seed cache before the first fetch.
  useEffect(() => {
    ensureSeed().finally(() => setReady(true))
  }, [])

  // (Re)load the lesson whenever strategy or language changes.
  useEffect(() => {
    if (!ready) return
    let cancelled = false
    async function run() {
      stopSpeaking()
      setLoading(true)
      setError(null)
      setLesson(null)
      try {
        const { data, fromCache } = await generate({
          subject: SUBJECT,
          topic: TOPIC,
          strategy,
          language,
          kind: 'lesson',
        })
        if (cancelled) return
        setLesson(data.text)
        setOffline(fromCache)
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy, language, ready])

  async function loadPractice() {
    stopSpeaking()
    setView('practice')
    setLoading(true)
    setError(null)
    setQuestions(null)
    try {
      const { data, fromCache } = await generate({
        subject: SUBJECT,
        topic: TOPIC,
        language,
        kind: 'practice',
        difficulty: 'on-level',
      })
      setQuestions(data.questions)
      setOffline(fromCache)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function explainDifferently() {
    const i = STRATEGY_ORDER.indexOf(strategy)
    setStrategy(STRATEGY_ORDER[(i + 1) % STRATEGY_ORDER.length])
  }

  function teachSimpler() {
    setView('lesson')
    setStrategy('eli5')
  }

  // Browser text-to-speech for the "text + voice" experience.
  const utterRef = useRef(null)
  function stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }
  function toggleSpeak() {
    if (!window.speechSynthesis || !lesson) return
    if (speaking) return stopSpeaking()
    const u = new SpeechSynthesisUtterance(lesson)
    u.lang = language === 'tl' ? 'fil-PH' : 'en-US'
    u.rate = 0.95
    u.onend = () => setSpeaking(false)
    utterRef.current = u
    setSpeaking(true)
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">GETS</span>
          <span className="tagline">{t.tagline}</span>
        </div>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            className={language === 'en' ? 'on' : ''}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            className={language === 'tl' ? 'on' : ''}
            onClick={() => setLanguage('tl')}
          >
            TL
          </button>
        </div>
      </header>

      <div className="topic-chip">
        {SUBJECT} · {TOPIC}
      </div>

      {offline && <div className="offline-badge">📡 {t.offline}</div>}

      <main>
        {view === 'lesson' && (
          <>
            <div className="strategies">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  className={`pill ${strategy === s.id ? 'on' : ''}`}
                  onClick={() => setStrategy(s.id)}
                >
                  <span className="emoji">{s.emoji}</span>
                  {s.label[language]}
                </button>
              ))}
            </div>

            <div className="card lesson">
              {loading && <p className="muted">{t.loading}</p>}
              {error && <p className="error">{error}</p>}
              {!loading && !error && lesson && (
                <>
                  <p className="lesson-text">{lesson}</p>
                  <button className="btn ghost small" onClick={toggleSpeak}>
                    {speaking ? t.stop : t.listen}
                  </button>
                </>
              )}
            </div>

            {!loading && lesson && (
              <div className="actions">
                <button className="btn ghost" onClick={explainDifferently}>
                  🔁 {t.again}
                </button>
                <button className="btn ghost" onClick={teachSimpler}>
                  {t.stuck}
                </button>
                <button className="btn primary" onClick={loadPractice}>
                  {t.practice}
                </button>
              </div>
            )}
          </>
        )}

        {view === 'practice' && (
          <>
            <button className="btn ghost small back" onClick={() => setView('lesson')}>
              {t.back}
            </button>
            {loading && <p className="muted">{t.loading}</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && questions && (
              <Practice
                questions={questions}
                language={language}
                onSimpler={teachSimpler}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
