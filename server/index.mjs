// Tiny local proxy that holds the Anthropic API key and does live generation.
// The React app calls POST /api/generate; Vite forwards it here in dev.
import 'dotenv/config'
import express from 'express'
import {
  generateLesson,
  generatePractice,
  activeProvider,
  requiredKeyName,
  keyPresent,
} from '../shared/generate.mjs'

const app = express()
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  const { kind, ...params } = req.body || {}

  if (!keyPresent()) {
    return res.status(500).json({
      error: `${requiredKeyName()} is not set (provider: ${activeProvider()}). Add it to .env.`,
    })
  }

  try {
    const data =
      kind === 'practice'
        ? await generatePractice(params)
        : await generateLesson(params)
    res.json(data)
  } catch (err) {
    console.error('[generate]', err)
    res.status(500).json({ error: err?.message || 'Generation failed.' })
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`GETS generation proxy → http://localhost:${PORT}  (provider: ${activeProvider()})`)
  if (!keyPresent()) {
    console.warn(`⚠  ${requiredKeyName()} not set — add it to .env before generating.`)
  }
})
