import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { pathToFileURL } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Dev-only proxy: serves POST /api/generate by calling Gemini Flash server-side,
// so the local `npm run dev` build has a working online AI without exposing the key.
// In production, the equivalent lives in api/generate.js (serverless).
function aiProxy(env: Record<string, string>) {
  return {
    name: 'gets-ai-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/generate', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next()
        const json = (code: number, body: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { prompt, lang, system, strategy } = JSON.parse(raw || '{}')
          const mod = await import(pathToFileURL(path.resolve(__dirname, 'server/gemini.mjs')).href)
          const text = await mod.generateWithGemini({
            prompt, lang, system, strategy,
            apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL,
          })
          json(200, { text })
        } catch (err: any) {
          json(500, { error: String(err?.message || err) })
        }
      })
      server.middlewares.use('/api/tts', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next()
        const json = (code: number, body: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { text } = JSON.parse(raw || '{}')
          const mod = await import(pathToFileURL(path.resolve(__dirname, 'server/gemini-tts.mjs')).href)
          const out = await mod.ttsWithGemini({
            text, apiKey: env.GEMINI_API_KEY,
            model: env.GEMINI_TTS_MODEL, voiceName: env.GEMINI_TTS_VOICE,
          })
          json(200, out)
        } catch (err: any) {
          json(500, { error: String(err?.message || err) })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' loads ALL env vars (incl. unprefixed GEMINI_API_KEY) from .env / .env.local
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      figmaAssetResolver(),
      aiProxy(env),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
