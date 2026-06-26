// GETS AI router — picks a provider by availability and falls back gracefully.
//
// Priority order (first available wins):
//   Gemini Flash (online, best quality)
//     → Gemma (on-device, offline)
//       → Mock (always available, keeps the app responsive)
//
// This mirrors the README: high-quality generation when connected, on-device
// generation when offline, never a dead end.

import type { AIProvider, GenerateOptions } from "./types";
import { GeminiFlashProvider, GemmaProvider, MockProvider } from "./providers";

export class AIRouter {
  constructor(private readonly providers: AIProvider[]) {}

  /** First provider that reports itself available (falls back to the last one). */
  async pick(): Promise<AIProvider> {
    for (const p of this.providers) {
      try {
        if (await p.isAvailable()) return p;
      } catch {
        /* treat errors as unavailable and continue */
      }
    }
    return this.providers[this.providers.length - 1];
  }

  /** Generate via the best available provider; on failure, fall back to Mock. */
  async generate(prompt: string, opts?: GenerateOptions): Promise<{ text: string; provider: string }> {
    const chosen = await this.pick();
    const fallback = this.providers[this.providers.length - 1];
    try {
      return { text: await chosen.generate(prompt, opts), provider: chosen.name };
    } catch (err) {
      if (chosen !== fallback) {
        return { text: await fallback.generate(prompt, opts), provider: fallback.name };
      }
      throw err;
    }
  }
}

// App-wide singleton. Order matters — see priority comment above.
export const ai = new AIRouter([
  new GeminiFlashProvider(),
  new GemmaProvider(),
  new MockProvider(),
]);
