// Serverless function for deployment (Vercel-style: POST /api/generate).
// Reads the key from the server environment; the browser never sees it.
// For other hosts (Netlify, Cloudflare Workers) adapt the handler signature,
// but reuse generateWithGemini from ../server/gemini.mjs.

import { generateWithGemini } from "../server/gemini.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  try {
    const { prompt, lang, system, strategy } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const text = await generateWithGemini({ prompt, lang, system, strategy });
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
