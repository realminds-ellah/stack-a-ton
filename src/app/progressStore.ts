// Local-first learner progress — points, streak, and completed lessons live in
// localStorage so they survive a reload or an app relaunch (important for the
// offline PWA demo, where the installed app may be reopened mid-session).
// Mirrors the pattern in src/auth/store.ts. Device-local only; no backend.

export interface Progress {
  points: number;
  streak: number;
  completedLessons: string[]; // subject ids the learner has finished
}

const KEY = "gets.progress";
const DEFAULT: Progress = { points: 1980, streak: 12, completedLessons: [] };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full / unavailable — non-fatal for the demo */
  }
}
