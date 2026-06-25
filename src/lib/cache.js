// Local-storage cache so reopened lessons work offline. On first run we load
// public/seed-cache.json (produced by `npm run seed`) so the demo has content
// even with no connection.

const NS = 'gets-cache-v1'
let mem = null

function load() {
  if (mem) return mem
  try {
    mem = JSON.parse(localStorage.getItem(NS)) || {}
  } catch {
    mem = {}
  }
  return mem
}

function persist() {
  try {
    localStorage.setItem(NS, JSON.stringify(mem))
  } catch {
    // storage full / unavailable — keep working from memory this session
  }
}

// Must stay in sync with key() in scripts/preseed.mjs.
export function cacheKey({ subject, topic, strategy, language, kind, difficulty }) {
  return [subject, topic, strategy || '', language, kind, difficulty || ''].join('::')
}

export function getCached(key) {
  return load()[key]
}

export function setCached(key, value) {
  load()[key] = value
  persist()
}

// Populate from the pre-seeded file once, if the cache is empty.
export async function ensureSeed() {
  const m = load()
  if (Object.keys(m).length) return
  try {
    const res = await fetch('/seed-cache.json', { cache: 'no-store' })
    if (!res.ok) return
    Object.assign(m, await res.json())
    persist()
  } catch {
    // no seed file — that's fine, we'll generate live
  }
}
