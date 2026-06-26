// GETS AI providers. Three implementations of AIProvider:
//   1. GeminiFlashProvider — online, high quality. Calls YOUR backend, never the
//      Google API directly (so the API key never ships in the APK).
//   2. GemmaProvider — offline, on-device. Bridges to a native Capacitor plugin
//      running Gemma via MediaPipe LLM Inference / LiteRT.
//   3. MockProvider — final fallback so the app/demo always responds, even with
//      no backend and no on-device model yet.

import type { AIProvider, GenerateOptions, Lang } from "./types";
import { lookup as offlineLookup } from "./offlineBank";

// ── 1. Gemini Flash (online, via backend proxy) ─────────────────────────────────
// Point VITE_AI_ENDPOINT at your backend route. The backend holds the API key and
// calls Gemini Flash; the app only ever talks to your own server.
const AI_ENDPOINT = (import.meta as any).env?.VITE_AI_ENDPOINT ?? "/api/generate";

export class GeminiFlashProvider implements AIProvider {
  readonly name = "gemini-flash";

  isAvailable(): boolean {
    return typeof navigator !== "undefined" && navigator.onLine;
  }

  async generate(prompt: string, opts?: GenerateOptions): Promise<string> {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        lang: opts?.lang,
        system: opts?.system,
        strategy: opts?.strategy,
      }),
      signal: opts?.signal,
    });
    if (!res.ok) throw new Error(`gemini-flash backend ${res.status}`);
    const data = await res.json();
    const text = data.text ?? data.output ?? data.content ?? "";
    if (!text) throw new Error("gemini-flash empty response");
    return text;
  }
}

// ── 2. Gemma (offline, on-device via Capacitor native plugin) ────────────────────
// The native side (Kotlin) registers a plugin "GemmaLLM" that loads a quantized
// Gemma (e.g. Gemma 3 1B int4) with MediaPipe LLM Inference and exposes:
//   isReady(): Promise<{ ready: boolean }>
//   generate({ prompt }): Promise<{ text: string }>
// On web (no Capacitor) this provider simply reports unavailable.
interface GemmaBridge {
  isReady(): Promise<{ ready: boolean }>;
  generate(opts: { prompt: string }): Promise<{ text: string }>;
}
function gemmaBridge(): GemmaBridge | null {
  const cap = (globalThis as any).Capacitor;
  return cap?.Plugins?.GemmaLLM ?? null;
}

export class GemmaProvider implements AIProvider {
  readonly name = "gemma-ondevice";

  async isAvailable(): Promise<boolean> {
    const b = gemmaBridge();
    if (!b) return false;
    try {
      return (await b.isReady()).ready;
    } catch {
      return false;
    }
  }

  async generate(prompt: string, _opts?: GenerateOptions): Promise<string> {
    const b = gemmaBridge();
    if (!b) throw new Error("gemma plugin unavailable (web build)");
    const { text } = await b.generate({ prompt });
    if (!text) throw new Error("gemma empty response");
    return text;
  }
}

// ── 3. Mock (always-available fallback) ──────────────────────────────────────────
// Keeps the UI/demo working before the backend + on-device model exist, and powers
// the offline demo: it consults the authored offline answer bank (offlineBank.ts)
// so a disconnected tutor gives topic-specific replies, not one generic line. Order
// of preference: caller's domain fallback → offline bank match → generic line.
// This is the router's terminal fallback, so it also catches online backend errors.
const MOCK_REPLY: Record<Lang, string> = {
  tl: "Magandang tanong! Ang aming mga aralin ay naka-align sa MATATAG curriculum. Nais mo bang matuto pa?",
  en: "Great question! Our lessons are aligned with the MATATAG curriculum. Want to learn more?",
  ceb: "Maayong pangutana! Ang among mga leksiyon nahiuyon sa MATATAG curriculum. Gusto pa ba nimo magtuon?",
  hil: "Maayo nga pamangkot! Ang amon mga leksyon nahisanto sa MATATAG curriculum. Luyag mo pa magtuon?",
};

export class MockProvider implements AIProvider {
  readonly name = "mock";

  isAvailable(): boolean {
    return true;
  }

  async generate(prompt: string, opts?: GenerateOptions): Promise<string> {
    await new Promise((r) => setTimeout(r, 450)); // simulate latency
    const lang = opts?.lang ?? "tl";
    // Prefer a caller-supplied domain fallback (e.g. the teacher co-pilot's tailored
    // canned answer); then an authored offline-bank match for the question; finally a
    // generic, language-aware line so we never dead-end.
    return opts?.fallback ?? offlineLookup(prompt, lang) ?? MOCK_REPLY[lang] ?? MOCK_REPLY.tl;
  }
}
