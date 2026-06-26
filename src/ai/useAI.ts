// React hook over the AI router. Exposes a generate() that routes to the best
// available provider, plus live connectivity + the provider used for the last call
// (handy for a "Online · Gemini" / "Offline · Gemma" badge in the UI).

import { useCallback, useEffect, useState } from "react";
import { ai } from "./router";
import type { GenerateOptions } from "./types";

export function useAI() {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const generate = useCallback(async (prompt: string, opts?: GenerateOptions) => {
    setBusy(true);
    try {
      const { text, provider } = await ai.generate(prompt, opts);
      setLastProvider(provider);
      return text;
    } finally {
      setBusy(false);
    }
  }, []);

  return { generate, online, busy, lastProvider };
}
