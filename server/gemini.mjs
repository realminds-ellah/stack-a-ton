// Server-side Gemini Flash call. Runs ONLY on the server (Vite dev middleware or a
// serverless function) so the API key never reaches the browser/APK.
// Shared by vite.config.ts (local dev) and api/generate.js (deploy).

import { GoogleGenAI } from "@google/genai";

const LANG_NAME = {
  tl: "Tagalog",
  en: "English",
  ceb: "Cebuano (Bisaya)",
  hil: "Hiligaynon",
};

export async function generateWithGemini({
  prompt,
  lang = "tl",
  system,
  strategy,
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_MODEL || "gemini-2.5-flash",
}) {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set on the server");
  if (!prompt) throw new Error("prompt is required");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = [
    system ||
      "You are GETS, a patient AI learning companion for Filipino Grade 7 learners under the DepEd MATATAG curriculum.",
    `Always respond in ${LANG_NAME[lang] || "Tagalog"}.`,
    "Be concise, warm, and encouraging. When a learner is wrong, re-explain the concept a different way instead of just saying it's wrong. If you are unsure, point them to their teacher or textbook rather than inventing facts.",
    strategy ? `Preferred teaching strategy: ${strategy}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Retry transient 503 (high demand) / 429 (rate) with short backoff.
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction, temperature: 0.7, maxOutputTokens: 800 },
      });
      return res.text ?? "";
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message || err);
      // Retry only true transient overloads. A daily-quota 429 won't recover in
      // seconds, so don't waste attempts on it — surface it immediately.
      const transient = /503|UNAVAILABLE|overloaded|high demand/i.test(msg);
      if (!transient || attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr;
}
