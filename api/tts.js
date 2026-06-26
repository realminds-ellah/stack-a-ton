// Serverless TTS endpoint (Vercel-style: POST /api/tts → { audio, mime }).
import { ttsWithGemini } from "../server/gemini-tts.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }
  try {
    const { text } = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const out = await ttsWithGemini({ text });
    res.status(200).json(out);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
