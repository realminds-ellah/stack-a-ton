// Server-side Gemini Text-to-Speech. Returns natural, multilingual speech
// (English + Filipino) as base64 WAV that the browser can play directly.
// Key stays server-side, like the chat proxy.

import { GoogleGenAI } from "@google/genai";

// Wrap raw PCM (Gemini returns 16-bit mono PCM, usually 24kHz) in a WAV header
// so an <audio> element can play it.
function pcmToWav(pcm, sampleRate = 24000, channels = 1, bits = 16) {
  const blockAlign = (channels * bits) / 8;
  const byteRate = sampleRate * blockAlign;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function ttsWithGemini({
  text,
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts",
  voiceName = process.env.GEMINI_TTS_VOICE || "Aoede", // warm, youthful
}) {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set on the server");
  if (!text || !text.trim()) throw new Error("text is required");

  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.generateContent({
    model,
    contents: text,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  });

  const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  const b64 = part?.inlineData?.data;
  if (!b64) throw new Error("Gemini TTS returned no audio");

  // Derive sample rate from the mime type if present (e.g. "audio/L16;rate=24000").
  const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType || "")?.[1]) || 24000;
  const wav = pcmToWav(Buffer.from(b64, "base64"), rate);
  return { audio: wav.toString("base64"), mime: "audio/wav" };
}
