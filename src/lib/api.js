// Generation client. Tries the live proxy; on failure or when offline, falls
// back to the local cache. Successful live results are cached for next time.
import { cacheKey, getCached, setCached } from './cache'

export async function generate(params) {
  const key = cacheKey(params)

  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('offline')
    }
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Request failed (${res.status})`)
    }
    const data = await res.json()
    setCached(key, data)
    return { data, fromCache: false }
  } catch (err) {
    const cached = getCached(key)
    if (cached) return { data: cached, fromCache: true }
    // No connection and nothing saved for this exact lesson.
    throw new Error(
      'Couldn’t reach the AI and there’s no saved version of this yet. ' +
        'Connect to the internet once to generate it.',
    )
  }
}
