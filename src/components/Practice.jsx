import { useState } from 'react'
import { T } from '../strings'

// Renders the generated multiple-choice set. Tracks attempts; a wrong answer
// surfaces "teach me this again" which re-teaches the concept a simpler way.
export default function Practice({ questions, language, onSimpler }) {
  const t = T[language]
  const [picked, setPicked] = useState({}) // index -> chosen choice index
  const [done, setDone] = useState({}) // index -> true once correct

  const correctCount = Object.keys(done).length
  const allDone = questions.length > 0 && correctCount === questions.length

  function choose(qi, ci) {
    if (done[qi]) return
    setPicked((p) => ({ ...p, [qi]: ci }))
    if (ci === questions[qi].answerIndex) {
      setDone((d) => ({ ...d, [qi]: true }))
    }
  }

  return (
    <div>
      <div className="score-row">
        <span className="score-pill">
          {t.score}: {correctCount}/{questions.length}
        </span>
      </div>

      {questions.map((q, qi) => {
        const chosen = picked[qi]
        const isWrong = chosen != null && chosen !== q.answerIndex && !done[qi]
        return (
          <div className="card question" key={qi}>
            <p className="q-text">
              {qi + 1}. {q.question}
            </p>
            <div className="choices">
              {q.choices.map((c, ci) => {
                const state =
                  done[qi] && ci === q.answerIndex
                    ? 'right'
                    : chosen === ci && ci !== q.answerIndex
                      ? 'wrong'
                      : ''
                return (
                  <button
                    key={ci}
                    className={`choice ${state}`}
                    onClick={() => choose(qi, ci)}
                    disabled={done[qi]}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            {done[qi] && (
              <p className="feedback ok">
                {t.correct} {q.explanation}
              </p>
            )}
            {isWrong && (
              <div className="feedback bad">
                <p>{t.tryAgain}</p>
                <button className="btn ghost small" onClick={onSimpler}>
                  {t.teachAgain}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {allDone && <p className="done-banner">{t.done}</p>}
    </div>
  )
}
