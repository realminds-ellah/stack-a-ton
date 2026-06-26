// GETS Text-to-Speech controller — the ONE place that produces speech.
//
// - One voice/model: Gemini cloud TTS (via /api/tts). Browser TTS is the
//   offline-only fallback, with a single consistent voice pick.
// - No overlap: a request token serializes calls. Each speak() invalidates the
//   previous one; a stale in-flight result is dropped, never played on top.
// - Cached: identical (lang|text) audio is reused — instant repeats, no re-spend.
// - Speaking state: a tiny external store so the UI can show a "now speaking" cue
//   (subscribe via useSpeaking()). The speaking id defaults to the spoken text.

import { useSyncExternalStore } from "react";

const TTS_ENDPOINT = (import.meta as any).env?.VITE_TTS_ENDPOINT ?? "/api/tts";
const SPEAK_RATE = 0.9; // browser-fallback rate (calmer for learners)

// ── speaking state (external store) ─────────────────────────────────────────────
let speakingId: string | null = null;
const listeners = new Set<() => void>();
function setSpeaking(id: string | null) {
  speakingId = id;
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
export function useSpeaking(): string | null {
  return useSyncExternalStore(subscribe, () => speakingId, () => null);
}

// ── audio cache (bounded) ───────────────────────────────────────────────────────
const cache = new Map<string, string>(); // key "lang|text" -> base64 wav
function cacheGet(k: string) {
  const v = cache.get(k);
  if (v) { cache.delete(k); cache.set(k, v); } // LRU touch
  return v;
}
function cachePut(k: string, v: string) {
  cache.set(k, v);
  if (cache.size > 50) cache.delete(cache.keys().next().value as string);
}

// ── playback control ────────────────────────────────────────────────────────────
let token = 0;
let audioEl: HTMLAudioElement | null = null;

export function stopSpeaking() {
  token++; // invalidate any in-flight request
  try { audioEl?.pause(); } catch { /* ignore */ }
  audioEl = null;
  try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
  setSpeaking(null);
}

function pickVoice(locale: string): SpeechSynthesisVoice | undefined {
  const base = locale.split("-")[0].toLowerCase();
  const candidates = window.speechSynthesis.getVoices()
    .filter((v) => v.lang === locale || v.lang?.toLowerCase().startsWith(base));
  const score = (v: SpeechSynthesisVoice) => {
    let s = 0;
    if (/google/i.test(v.name)) s += 4;
    if (/natural|neural|premium|enhanced/i.test(v.name)) s += 4;
    if (v.localService === false) s += 2;
    if (v.lang === locale) s += 1;
    return s;
  };
  return candidates.sort((a, b) => score(b) - score(a))[0];
}

function speakBrowser(text: string, lang: string, my: number, sid: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const locale = lang === "en" ? "en-US" : "fil-PH";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    u.rate = SPEAK_RATE;
    u.pitch = 1.05;
    const v = pickVoice(locale);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.onend = () => { if (my === token) setSpeaking(null); };
    u.onerror = () => { if (my === token) setSpeaking(null); };
    if (my !== token) return;
    setSpeaking(sid);
    synth.resume();
    synth.speak(u);
  } catch { /* TTS unsupported */ }
}

// Speak `text`. Cloud TTS when online, browser TTS otherwise. `id` lets the UI
// know which item is speaking (defaults to the text itself).
export async function speak(text: string, lang: string = "tl", id?: string) {
  if (!text?.trim()) return;
  stopSpeaking();
  const my = token;          // current token after stopSpeaking's increment
  const sid = id ?? text;
  const key = `${lang}|${text}`;

  let audioB64 = cacheGet(key);
  if (!audioB64 && typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const res = await fetch(TTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio) { audioB64 = data.audio as string; cachePut(key, audioB64); }
      }
    } catch { /* fall through to browser */ }
  }
  if (my !== token) return;  // a newer speak()/stop() superseded us — drop

  if (audioB64) {
    try {
      const a = new Audio(`data:audio/wav;base64,${audioB64}`);
      audioEl = a;
      a.onended = () => { if (my === token) { setSpeaking(null); audioEl = null; } };
      setSpeaking(sid);
      await a.play();
      return;
    } catch { /* fall through to browser */ }
  }
  if (my !== token) return;
  speakBrowser(text, lang, my, sid);
}

// Warm up the browser voice list (empty until this fires on some browsers).
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
}
