// Tiny local proxy that holds the Anthropic API key and does live generation.
// The React app calls POST /api/generate; Vite forwards it here in dev.
import 'dotenv/config'
import express from 'express'
import { generateLesson, generatePractice } from '../shared/generate.mjs'

const app = express()
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  const { kind, ...params } = req.body || {}

  if (!process.env.ANTHROPIC_API_KEY) {
    return res
      .status(500)
      .json({ error: 'ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.' })
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
  console.log(`GETS generation proxy → http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠  ANTHROPIC_API_KEY not set — add it to .env before generating.')
  }
})
