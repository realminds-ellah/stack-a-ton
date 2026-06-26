// GETS AI layer — shared types.
// The app talks to ONE interface (AIProvider). Concrete providers (Gemini Flash
// online, Gemma on-device offline, Mock fallback) implement it, and the router
// (router.ts) picks the right one by connectivity. This keeps the UI decoupled
// from how/where generation happens — backend + on-device work plug in here.

export type Lang = "tl" | "en" | "ceb" | "hil";

/** One of the README's five teaching strategies (used to shape the prompt). */
export type TeachingStrategy =
  | "read-listen"
  | "worked-example"
  | "guiding-questions"
  | "quest"
  | "eli5";

export interface GenerateOptions {
  /** Learner's language — generation should respond in this language. */
  lang?: Lang;
  /** Optional system / grounding instruction (e.g. MATATAG context). */
  system?: string;
  /** Optional teaching strategy to shape the explanation. */
  strategy?: TeachingStrategy;
  /** Abort in-flight generation (e.g. user navigates away). */
  signal?: AbortSignal;
  /** Domain-specific offline reply. Used by MockProvider so a screen can keep its
   *  tailored canned answer until a real provider (Gemini/Gemma) is reachable. */
  fallback?: string;
}

export interface AIProvider {
  /** Stable id for telemetry / debug ("gemini-flash", "gemma-ondevice", "mock"). */
  readonly name: string;
  /** Whether this provider can serve a request right now. */
  isAvailable(): boolean | Promise<boolean>;
  /** Generate a completion for `prompt`. Throws on failure (router will fall back). */
  generate(prompt: string, opts?: GenerateOptions): Promise<string>;
}
