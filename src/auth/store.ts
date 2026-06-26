// Local-first auth — accounts + session live in localStorage. No backend.
// This is device-local only; the password hash is light obfuscation, NOT real
// security. When the backend lands, swap these functions for real auth calls.

export type Role = "student" | "teacher" | "parent";

export interface Account {
  id: string;
  username: string;
  role: Role;
  name: string;
  avatar: string;
  pass: string;        // hashed (local-only)
  createdAt: number;
  onboarded?: boolean; // student finished onboarding
  lang?: string;       // preferred language code (PH/GB/CEB/HIL/…)
  // teacher preferences
  school?: string;
  strategy?: string;             // default teaching strategy for the co-pilot
  reviewBeforePublish?: boolean; // require teacher review of AI content
}

const ACCTS_KEY = "gets.accounts";
const SESSION_KEY = "gets.session";

function load(): Account[] {
  try { return JSON.parse(localStorage.getItem(ACCTS_KEY) || "[]"); } catch { return []; }
}
function save(list: Account[]) {
  localStorage.setItem(ACCTS_KEY, JSON.stringify(list));
}
// djb2 — light obfuscation so passwords aren't stored in plain text. Not secure.
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return "h" + h.toString(36);
}
function uid(): string {
  try { return crypto.randomUUID(); } catch { return "u" + Math.abs(Date.now() | 0).toString(36) + load().length; }
}

export function listAccounts(): Account[] {
  return load();
}

export function signUp(d: { username: string; password: string; role: Role; name: string; avatar: string }):
  { ok: boolean; error?: string; account?: Account } {
  const username = d.username.trim();
  if (username.length < 3) return { ok: false, error: "Username must be at least 3 characters." };
  if (d.password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
  if (!d.name.trim()) return { ok: false, error: "Please enter a display name." };
  if (!d.avatar) return { ok: false, error: "Please pick an avatar." };
  const accts = load();
  if (accts.some(a => a.username.toLowerCase() === username.toLowerCase()))
    return { ok: false, error: "That username is already taken." };
  const account: Account = {
    id: uid(), username, role: d.role, name: d.name.trim(), avatar: d.avatar,
    pass: hash(d.password), createdAt: Date.now(),
  };
  accts.push(account);
  save(accts);
  localStorage.setItem(SESSION_KEY, account.id);
  return { ok: true, account };
}

export function logIn(username: string, password: string):
  { ok: boolean; error?: string; account?: Account } {
  const a = load().find(x => x.username.toLowerCase() === username.trim().toLowerCase());
  if (!a || a.pass !== hash(password)) return { ok: false, error: "Wrong username or password." };
  localStorage.setItem(SESSION_KEY, a.id);
  return { ok: true, account: a };
}

export function getSession(): Account | null {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return load().find(a => a.id === id) || null;
}

export function logOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function updateAccount(id: string, patch: Partial<Account>): void {
  const accts = load();
  const i = accts.findIndex(a => a.id === id);
  if (i >= 0) { accts[i] = { ...accts[i], ...patch }; save(accts); }
}
