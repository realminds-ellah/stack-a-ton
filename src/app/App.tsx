import React, { useState, useEffect } from "react";
import {
  Home, BookOpen, Gamepad2, Trophy, Settings, ArrowRight, ArrowLeft,
  Heart, Flame, Sparkles, Volume2, ChevronRight,
  Check, Zap, Play, RefreshCw, CheckCircle, Award, X, Send, Mic,
  GraduationCap, Lock, Eye, MessageCircle, Wifi,
  Triangle, FlaskConical, BookMarked, Languages
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import getsLogo from "../imports/upscalemedia-transformed-1.png";
import getsMascot from "../imports/727918883_1504091370660265_8960748969875895198_n.png";
import getsMascotConfused from "../imports/gets-mascot-confused.png";
import getsMascotScholar from "../imports/gets-mascot-scholar.png";
import getsMoodExcited from "../imports/gets-mood-excited.png";
import getsMoodOkay from "../imports/gets-mood-okay.png";
import getsMoodPagod from "../imports/gets-mood-pagod.png";
import getsMoodStressed from "../imports/gets-mood-stressed.png";
import faceHappy from "../imports/gets-face-happy.png";
import faceNeutral from "../imports/gets-face-neutral.png";
import facePeace from "../imports/gets-face-peace.png";
import faceAplus from "../imports/gets-face-aplus.png";
import faceSad from "../imports/gets-face-sad.png";
import faceShocked from "../imports/gets-face-shocked.png";
import { useAI, speak, stopSpeaking, useSpeaking } from "../ai";

const P = "#185FA5";
const PD = "#0F4A87";
const A = "#EF9F27";
const SURF = "#E6F1FB";

type Screen =
  | "splash" | "roleSelect"
  | "onboarding_language" | "onboarding_assessment"
  | "onboarding_style_result" | "onboarding_profile"
  | "mood_check" | "studentApp" | "parentApp" | "teacherApp";

type StudentTab = "home" | "learn" | "game" | "rewards" | "sped";
type Role = "student" | "teacher" | "parent";
type LearningStyle = "Reading" | "Listening" | "Watching" | "Solving";
type Mood = "excited" | "okay" | "pagod" | "stressed" | null;
type GameMode = "riddle" | null;

interface LearnerProfile {
  name: string; avatar: string; language: string; learningStyle: LearningStyle; mood: Mood;
}

// Mascot: shows one cell from a 3×3 grid sticker sheet
// Each (row,col) maps to an isolated mascot expression cropped from the sticker sheet
const MASCOT_FACES: Record<string, string> = {
  "0,0": faceNeutral, "0,1": faceHappy,   "0,2": facePeace,
  "1,0": faceNeutral, "1,1": faceSad,     "1,2": faceShocked,
  "2,0": faceNeutral, "2,1": faceAplus,   "2,2": faceAplus,
};
function Mascot({ row = 0, col = 1, size = 64, className = "" }: { row?: number; col?: number; size?: number; className?: string }) {
  const src = MASCOT_FACES[`${row},${col}`] || faceNeutral;
  return (
    <div className={`overflow-hidden shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size, borderRadius: size * 0.18 }}>
      <img src={src} alt="GETS mascot" className="w-full h-full object-contain" style={{ padding: Math.round(size * 0.06) }} />
    </div>
  );
}

const LANGUAGES = [
  { code: "PH", flag: "🇵🇭", label: "Taglish / Filipino", greeting: "Kumusta! Handa ka na bang mag-aral?" },
  { code: "GB", flag: "🇬🇧", label: "English", greeting: "Hello! Ready to learn today?" },
  { code: "CEB", flag: "🌴", label: "Bisaya (Cebuano)", greeting: "Kumusta! Andam na ka ba mag-eskwela?" },
  { code: "ILO", flag: "🌾", label: "Ilocano", greeting: "Kumusta! Nakasagana ka nga manaral?" },
  { code: "HIL", flag: "⛵", label: "Hiligaynon", greeting: "Kumusta! Handa ka na nga mag-eskwela?" },
  { code: "BIC", flag: "🌶️", label: "Bicolano", greeting: "Kumusta! Handa ka na nang mag-aral?" },
  { code: "WAR", flag: "🐟", label: "Waray-Waray", greeting: "Kumusta! Andam ka na ba?" },
  { code: "OTH", flag: "✦", label: "Iba pa / Others", greeting: "Welcome! Ready to learn today?" },
];

const ASSESSMENT_QUESTIONS = [
  {
    tl: "Kapag may bago kang laruan, laro, o gadyet, ano ang una mong ginagawa?",
    en: "When you have a new toy, game, or gadget, what is your first step?",
    options: [
      { style: "Reading" as LearningStyle, icon: <BookOpen className="w-5 h-5" />, tl: "Binabasa ko ang manual o direksyon.", en: "Read the manual/directions." },
      { style: "Listening" as LearningStyle, icon: <Volume2 className="w-5 h-5" />, tl: "Nagtatanong ako sa nakakaalam o nakikinig sa paliwanag.", en: "Ask someone or listen to instructions." },
      { style: "Watching" as LearningStyle, icon: <Eye className="w-5 h-5" />, tl: "Nanonood ako ng video tutorial sa YouTube.", en: "Watch video tutorials." },
      { style: "Solving" as LearningStyle, icon: <Zap className="w-5 h-5" />, tl: "Sinusubukan ko kaagad laruin o kalikutin.", en: "Try playing with it immediately." },
    ],
  },
  {
    tl: "Paano mo mas madaling maalala ang isang magandang kwento?",
    en: "How do you easily remember a wonderful story?",
    options: [
      { style: "Reading" as LearningStyle, icon: <BookOpen className="w-5 h-5" />, tl: "Kapag binabasa ko ito mismo sa libro o screen.", en: "When reading it on a book/screen." },
      { style: "Listening" as LearningStyle, icon: <Volume2 className="w-5 h-5" />, tl: "Kapag isinalaysay o ibinahagi ito sa akin nang pasalita.", en: "When someone narrates/shares it aloud." },
      { style: "Watching" as LearningStyle, icon: <Eye className="w-5 h-5" />, tl: "Kapag may mga makukulay na larawan o video nito.", en: "When there are colorful pictures or videos." },
      { style: "Solving" as LearningStyle, icon: <Zap className="w-5 h-5" />, tl: "Kapag ako ay umaakto o gumagawa ng dula tungkol dito.", en: "When roleplaying or doing activities with it." },
    ],
  },
  {
    tl: "Kapag ikaw ay nag-aaral para sa pagsusulit, ano ang paborito mong paraan?",
    en: "When studying for an exam, what is your preferred way?",
    options: [
      { style: "Reading" as LearningStyle, icon: <BookOpen className="w-5 h-5" />, tl: "Muling pagbabasa ng aking mga isinulat na notes.", en: "Re-reading written notes." },
      { style: "Listening" as LearningStyle, icon: <Volume2 className="w-5 h-5" />, tl: "Pakikinig sa lecture o pakikipag-talakayan sa kaklase.", en: "Listening to lectures or discussing with classmates." },
      { style: "Watching" as LearningStyle, icon: <Eye className="w-5 h-5" />, tl: "Patingin sa mga diagram, tsart, at mga flashcard.", en: "Looking at diagrams, charts, and flashcards." },
      { style: "Solving" as LearningStyle, icon: <Zap className="w-5 h-5" />, tl: "Pagsagot agad sa mga pagsasanay o practice test.", en: "Answering practice quizzes right away." },
    ],
  },
];

const STYLE_INFO: Record<LearningStyle, { title: string; titleEn: string; desc: string; tip: string }> = {
  Reading: { title: "Pagbabasa", titleEn: "Reading Learner", desc: "Mas mabilis kang natututo sa pamamagitan ng pagbabasa at pagsusulat ng mga salita.", tip: "Para sa iyo, ang aming app ay magbibigay-diin sa detalyadong teksto, visual text highlights, at nakasulat na gabay." },
  Listening: { title: "Pakikinig", titleEn: "Listening Learner", desc: "Mas mabilis kang natututo sa pamamagitan ng tunog, boses, at pakikinig.", tip: "Gagamitin natin ang aming Voice Tutor at Read Aloud engine para bigkasin nang malakas ang bawat bahagi ng aralin." },
  Watching: { title: "Panonood", titleEn: "Visual Learner", desc: "Mas madali mong nauunawaan ang mga aralin kapag nakakakita ng tsart, video, at diagram.", tip: "I-aakma namin ang mga visual guide, infographics, at structured mindmaps para sa iyong mabilis na pagkatuto." },
  Solving: { title: "Pagsagot Agad", titleEn: "Kinesthetic Learner", desc: "Gusto mong subukan agad ang mga hamon at matuto sa pamamagitan ng trial and error.", tip: "Papadaliin namin ang pag-access sa mga interactive drills at laro bago sumisid sa malalim na teorya." },
};

const AVATARS = ["👧", "👦", "🎒", "🦉", "🐻", "🐼", "🦊", "🎨"];

interface Subject {
  id: string; label: string; labelEn: string; topic: string; progress: number;
  barColor: string; textColor: string; bg: string; border: string;
  icon: React.ReactNode; status: "strong" | "improving" | "needs-help";
  lesson: { title: string; body: string[]; example: string };
}

const SUBJECTS: Subject[] = [
  {
    id: "matematika", label: "Matematika", labelEn: "Mathematics",
    topic: "Polygons (Gilid at Anggulo)", progress: 75,
    barColor: A, textColor: A,
    bg: "bg-amber-50", border: "border-amber-200",
    icon: <Triangle className="w-5 h-5 text-amber-600" />,
    status: "strong",
    lesson: {
      title: "Ano ang Polygon?",
      body: [
        "Ang polygon ay isang saradong patag na hugis na may tatlo o higit pang tuwid na gilid (sides) at sulok (angles).",
        "Ang bawat polygon ay may pangalan batay sa bilang ng kanyang mga gilid. Ang tatsulok ay may 3 gilid, habang ang rectangle ay may 4.",
        "Ang regular na polygon ay may lahat ng gilid at sulok na magkakapantay, tulad ng equilateral triangle at square.",
      ],
      example: "Formula: Sum of interior angles = (n – 2) × 180°. Para sa hexagon (n=6): (6–2) × 180° = 720°.",
    },
  },
  {
    id: "agham", label: "Agham", labelEn: "Science",
    topic: "Ugnayan sa Ecosystem", progress: 40,
    barColor: "#10B981", textColor: "#047857",
    bg: "bg-emerald-50", border: "border-emerald-200",
    icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
    status: "improving",
    lesson: {
      title: "Mga Uri ng Ugnayan sa Ecosystem",
      body: [
        "Ang ecosystem ay isang sistema kung saan ang mga nabubuhay na bagay (biotic) at mga hindi nabubuhay (abiotic) ay nakikipag-ugnayan sa isa't isa.",
        "Ang symbiosis ay ang matagalang pakikipamuhay ng dalawang iba't ibang uri ng organismo. May tatlong uri: mutualism, commensalism, at parasitism.",
        "Sa mutualism, parehong nakikinabang ang dalawang organismo. Halimbawa: ang pukyutan at bulaklak.",
      ],
      example: "Parasitism: Ang lamok ay sumasipsip ng dugo sa tao (host). Napapahamak ang host habang nangingibabaw ang parasite.",
    },
  },
  {
    id: "ingles", label: "Ingles", labelEn: "English",
    topic: "Mga Anyo ng Panitikang Pilipino", progress: 60,
    barColor: P, textColor: P,
    bg: "bg-blue-50", border: "border-blue-200",
    icon: <BookMarked className="w-5 h-5 text-blue-600" />,
    status: "improving",
    lesson: {
      title: "Forms of Philippine Literature",
      body: [
        "Philippine literature comes in many forms shaped by our rich history and diverse cultures: folk tales, epics, poetry, and modern prose.",
        "Folk literature (oral tradition) includes the bugtong (riddles), salawikain (proverbs), and alamat (legends) passed down through generations.",
        "The epic is the highest form of pre-colonial poetry. Famous epics: Biag ni Lam-ang (Ilocano), Hinilawod (Visayan), and Darangen (Maranao).",
      ],
      example: "Biag ni Lam-ang: A heroic epic of the Ilocos region narrating the extraordinary feats of Lam-ang, born with the ability to speak at birth.",
    },
  },
  {
    id: "filipino", label: "Filipino", labelEn: "Filipino",
    topic: "Panitikan sa Panahon ng Katutubo", progress: 25,
    barColor: "#DC2626", textColor: "#B91C1C",
    bg: "bg-red-50", border: "border-red-200",
    icon: <Languages className="w-5 h-5 text-red-700" />,
    status: "needs-help",
    lesson: {
      title: "Panitikan sa Panahon ng Katutubo",
      body: [
        "Ang panitikang-bayan ng sinaunang Pilipino ay ipinaabot sa pamamagitan ng bibig (oral tradition) bago pa dumating ang mga Kastila.",
        "Kasama dito ang mga alamat, epiko, bugtong, salawikain, at awit. Ang alamat ay nagpapaliwanag ng pinagmulan ng mga bagay.",
        "Ang bugtong (riddle) ay isang tradisyunal na pasalitang laro ng wit at karunungan na gumagamit ng metapora at simbolismo.",
      ],
      example: "Salawikain: 'Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan.' — Huwag kalimutan ang iyong ugat.",
    },
  },
];

const BADGES = [
  { id: "b1", label: "Unang Hakbang", earned: true, date: "Hunyo 1" },
  { id: "b2", label: "7-Day Streak", earned: true, date: "Hunyo 8" },
  { id: "b3", label: "Kwentista", earned: true, date: "Hunyo 10" },
  { id: "b4", label: "Sprint Master", earned: true, date: "Hunyo 15" },
  { id: "b5", label: "Pang-abay Pro", earned: false },
  { id: "b6", label: "Sarimanok Sage", earned: false },
  { id: "b7", label: "Top Scorer", earned: false },
  { id: "b8", label: "Bugtong Master", earned: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Mark Joseph", avatar: "👦", points: 2340 },
  { rank: 2, name: "Jasmin", avatar: "👧", points: 1980, isYou: true },
  { rank: 3, name: "Ana Cruz", avatar: "👧", points: 1650 },
  { rank: 4, name: "Carlo B.", avatar: "👦", points: 1420 },
  { rank: 5, name: "Lea Santos", avatar: "👧", points: 1280 },
];

const RIDDLES = [
  { q: "Isang butil ng palay, sakop ang buong bahay.", opts: ["Bigas", "Ilaw", "Bubong", "Unan"], correct: 1, expl: "Ang ilaw ay nagbibigay ng liwanag sa buong silid — tulad ng isang butil na sumasaklaw sa lahat!" },
  { q: "Bumili ako ng alipin, mas mataas pa sa akin.", opts: ["Payong", "Sumbrero", "Sapatos", "Hagdan"], correct: 1, expl: "Ang sumbrero ay suot sa ulo — mas mataas ka sa iyong biniling alipin!" },
  { q: "Dala mo, dala ka; dala ka ng iyong dala.", opts: ["Sapatos", "Bag", "Bisikleta", "Pera"], correct: 0, expl: "Ang sapatos ay dinadala mo at sila rin ang nagdadala sa iyo!" },
];

const cx = (...a: (string | boolean | undefined | null)[]) => a.filter(Boolean).join(" ");

// ─── Accessibility / SPED (global, README-driven) ───────────────────────────────
interface A11ySettings {
  dyslexiaFont: boolean; readAloud: boolean; bionic: boolean; calmMode: boolean;
  largeText: boolean; zenMode: boolean; auditoryChimes: boolean; focusMode: boolean;
  profile: "none" | "dyslexia" | "adhd" | "autism";
}
const A11Y_DEFAULTS: A11ySettings = { dyslexiaFont: false, readAloud: false, bionic: false, calmMode: false, largeText: false, zenMode: false, auditoryChimes: false, focusMode: false, profile: "none" };
const A11yContext = React.createContext<{ s: A11ySettings; update: (p: Partial<A11ySettings>) => void }>({ s: A11Y_DEFAULTS, update: () => {} });
const useA11y = () => React.useContext(A11yContext);

// ─── Language / i18n (mother-tongue-first, README-driven) ───────────────────────
type Lang = "tl" | "en" | "ceb" | "hil";
const LANG_META: { code: Lang; label: string; flag: string }[] = [
  { code: "tl",  label: "Tagalog",    flag: "🇵🇭" },
  { code: "en",  label: "English",    flag: "🇬🇧" },
  { code: "ceb", label: "Bisaya",     flag: "🌴" },
  { code: "hil", label: "Hiligaynon", flag: "⛵" },
];
// NOTE: tl/en are verified; ceb/hil are best-effort and should be reviewed by a
// native speaker before production (matches the README's "validated per language").
const STR: Record<string, Record<Lang, string>> = {
  greeting:   { tl: "Magandang Araw!",                 en: "Good Day!",                    ceb: "Maayong Adlaw!",                  hil: "Maayong Adlaw!" },
  subjects:   { tl: "Aralin Ngayong Baitang (Grade 7)", en: "This Year's Lessons (Grade 7)", ceb: "Mga Leksiyon Karong Tuiga (Grade 7)", hil: "Mga Leksyon Sini nga Tuig (Grade 7)" },
  mission:    { tl: "Araw-araw na Misyon",             en: "Daily Mission",                ceb: "Adlaw-adlaw nga Misyon",          hil: "Adlaw-adlaw nga Misyon" },
  start:      { tl: "Simulan",                          en: "Start",                        ceb: "Sugdi",                           hil: "Sugdan" },
  navHome:    { tl: "Bahay",                            en: "Home",                         ceb: "Balay",                           hil: "Balay" },
  navLearn:   { tl: "Matuto",                           en: "Learn",                        ceb: "Tun-i",                           hil: "Tun-i" },
  navGame:    { tl: "Laro",                             en: "Game",                         ceb: "Dula",                            hil: "Hampang" },
  navRewards: { tl: "Gantimpala",                       en: "Rewards",                      ceb: "Ganti",                           hil: "Padya" },
  navSped:    { tl: "SPED",                             en: "SPED",                         ceb: "SPED",                            hil: "SPED" },
};
const LangContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "tl", setLang: () => {} });
const useLang = () => React.useContext(LangContext);
const useT = () => { const { lang } = useLang(); return (key: string) => (STR[key]?.[lang] ?? STR[key]?.tl ?? key); };
const codeToLang = (code: string): Lang => (code === "GB" ? "en" : code === "CEB" ? "ceb" : code === "HIL" ? "hil" : "tl");

// Compact language switcher — cycles Tagalog → English → Bisaya → Hiligaynon
function LangSwitcher() {
  const { lang, setLang } = useLang();
  const idx = Math.max(0, LANG_META.findIndex(l => l.code === lang));
  const cur = LANG_META[idx];
  return (
    <button onClick={() => setLang(LANG_META[(idx + 1) % LANG_META.length].code)} title="Palitan ang wika / Switch language"
      className="flex items-center gap-1 px-2 py-0.5 rounded-full border cursor-pointer transition-colors" style={{ borderColor: `${P}40`, backgroundColor: "#fff" }}>
      <span className="text-xs leading-none">{cur.flag}</span>
      <span className="text-[9px] font-black uppercase" style={{ color: P }}>{cur.code}</span>
    </button>
  );
}

// Read Aloud (TTS) now lives in one controller — see src/ai/tts.ts.
// `speak`, `stopSpeaking`, `useSpeaking` are imported at the top of this file:
// one voice (Gemini cloud TTS), serialized (no overlap), cached, with a
// "now speaking" state for the UI.

// Auditory chime via Web Audio
function chime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine"; o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.start(); o.stop(ctx.currentTime + 0.26);
    o.onended = () => ctx.close();
  } catch { /* WebAudio unsupported */ }
}
// Voice input (speech-to-text) via the Web Speech API — online STT in Chrome / Android WebView.
// Cebuano/Hiligaynon aren't reliably supported, so they fall back to Filipino (fil-PH).
const langToLocale = (lang: string) => (lang === "en" ? "en-US" : "fil-PH");
function useVoiceInput(lang: string) {
  const [listening, setListening] = useState(false);
  const recRef = React.useRef<any>(null);
  const supported = typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const stop = () => { try { recRef.current?.stop(); } catch { /* ignore */ } setListening(false); };
  const start = (onInterim: (t: string) => void, onFinal: (t: string) => void) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = langToLocale(lang);
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      let fin = "", int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += tr; else int += tr;
      }
      if (int) onInterim(int);
      if (fin) onFinal(fin.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    try { rec.start(); } catch { setListening(false); }
  };
  return { listening, supported, start, stop };
}
// Bionic Reading: bold the leading portion of each word
function BionicText({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\s+)/).map((tok, i) => {
        if (!tok || /^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        const n = Math.max(1, Math.ceil(tok.length * 0.5));
        return <span key={i}><strong>{tok.slice(0, n)}</strong>{tok.slice(n)}</span>;
      })}
    </>
  );
}
// Reusable text that respects Bionic Reading (bold word-stems) + Read Aloud (tap to hear)
function A11yText({ text, className }: { text: string; className?: string }) {
  const { s } = useA11y();
  return (
    <span onClick={() => s.readAloud && speak(text)} className={cx(className, s.readAloud && "cursor-pointer")}>
      {s.bionic ? <BionicText>{text}</BionicText> : text}
    </span>
  );
}

// Lightweight markdown for AI chat bubbles (Gemini returns **bold**, lists, etc.).
// Not a full parser — handles bold / italic / inline-code / line breaks / bullet +
// numbered lists / simple headings, and still honours Bionic Reading + Read Aloud.
const stripMd = (t: string) => t.replace(/[*_`#>]/g, "").replace(/\s*\n+\s*/g, " ").trim();
function mdInline(text: string, bionic: boolean): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|_([^_\n]+)_|`([^`]+)`)/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  const plain = (str: string) => (bionic ? <BionicText key={k++}>{str}</BionicText> : <span key={k++}>{str}</span>);
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(plain(text.slice(last, m.index)));
    if (m[2] ?? m[3]) out.push(<strong key={k++}>{m[2] ?? m[3]}</strong>);
    else if (m[4] ?? m[5]) out.push(<em key={k++}>{m[4] ?? m[5]}</em>);
    else if (m[6]) out.push(<code key={k++} className="px-1 py-0.5 rounded bg-black/10 text-[0.85em] font-mono">{m[6]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(plain(text.slice(last)));
  return out;
}
function Markdown({ text }: { text: string }) {
  const { s } = useA11y();
  const { lang } = useLang();
  const speakingId = useSpeaking();
  const plain = stripMd(text);
  const playing = speakingId === plain;
  const onClick = () => {
    if (playing) stopSpeaking();
    else if (s.readAloud) speak(plain, lang);
  };
  const lines = text.split("\n");
  return (
    <div onClick={onClick} className={cx("space-y-1", s.readAloud && "cursor-pointer")}>
      {playing && (
        <div className="flex items-center gap-1 mb-1 animate-pulse" style={{ color: P }}>
          <Volume2 className="w-3 h-3" /><span className="text-[9px] font-black uppercase tracking-wider">Sinasalita…</span>
        </div>
      )}
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const heading = line.match(/^#{1,3}\s+(.*)$/);
        if (heading) return <p key={i} className="font-display font-black">{mdInline(heading[1], s.bionic)}</p>;
        const bullet = line.match(/^\s*[-*]\s+(.*)$/);
        if (bullet) return <div key={i} className="flex gap-1.5"><span className="shrink-0">•</span><span>{mdInline(bullet[1], s.bionic)}</span></div>;
        const num = line.match(/^\s*(\d+)\.\s+(.*)$/);
        if (num) return <div key={i} className="flex gap-1.5"><span className="shrink-0 font-bold">{num[1]}.</span><span>{mdInline(num[2], s.bionic)}</span></div>;
        return <p key={i}>{mdInline(line, s.bionic)}</p>;
      })}
    </div>
  );
}

// (#3) Read-aloud paragraph with word highlighting synced to the TTS engine.
// Tap to hear; each word lights up as it is spoken (SpeechSynthesis boundary events).
function ReadAloudParagraph({ text, className }: { text: string; className?: string }) {
  const { s } = useA11y();
  const { lang } = useLang();
  const speakingId = useSpeaking();
  const playing = speakingId === text; // unified controller; id defaults to the text
  const onClick = () => {
    if (!s.readAloud) return;
    if (playing) stopSpeaking(); else speak(text, lang);
  };
  return (
    <p onClick={onClick}
      className={cx(className, s.readAloud && "cursor-pointer rounded-lg transition-colors", playing && "px-1 -mx-1")}
      style={playing ? { backgroundColor: "rgba(253,230,138,0.5)" } : undefined}>
      {s.bionic ? <BionicText>{text}</BionicText> : text}
    </p>
  );
}

// (#4) Micro-lessons: split a lesson into focus-friendly chunks with a timer + frequent reward cues (ADHD).
function FocusLesson({ body }: { body: string[] }) {
  const { s } = useA11y();
  const [chunk, setChunk] = useState(0);
  const [secs, setSecs] = useState(180); // 3-minute focus session
  useEffect(() => {
    const t = setInterval(() => setSecs(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60); const ss = String(secs % 60).padStart(2, "0");
  const last = chunk >= body.length - 1;
  const next = () => {
    if (s.auditoryChimes) chime();      // frequent rewards
    setChunk(c => Math.min(body.length - 1, c + 1));
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Focus Mode · Bahagi {chunk + 1}/{body.length}</span>
        <span className="text-xs font-black tabular-nums flex items-center gap-1" style={{ color: secs === 0 ? "#DC2626" : P }}>⏱ {mm}:{ss}</span>
      </div>
      <div className="flex gap-1.5">
        {body.map((_, i) => <div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{ backgroundColor: i <= chunk ? P : "#E5E7EB" }} />)}
      </div>
      <ReadAloudParagraph text={body[chunk]} className="text-sm text-muted-foreground font-medium leading-relaxed" />
      {secs === 0 && (
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <p className="text-xs font-bold text-emerald-800 mb-2">Magaling! Nag-focus ka ng 3 minuto. Magpahinga sandali? 🌱</p>
          <button onClick={() => setSecs(180)} className="text-[11px] font-black px-3 py-1.5 rounded-lg text-white cursor-pointer" style={{ backgroundColor: "#059669" }}>+3 minuto pa</button>
        </div>
      )}
      {!last ? (
        <button onClick={next} className="w-full text-white font-display font-black text-sm py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5" style={{ backgroundColor: P }}>
          Susunod na bahagi <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="w-full text-center font-display font-black text-sm py-2.5 rounded-xl" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>Tapos na ang aralin! ✓</div>
      )}
    </div>
  );
}

function PBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 flex-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{ backgroundColor: i < current ? P : "#E0E0E0" }} />
      ))}
    </div>
  );
}

function GetsBtn({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} data-distraction
      className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-white overflow-hidden"
      style={{ width: 52, height: 52, backgroundColor: P }}>
      <div className="w-full h-full flex items-center justify-center">
        <Mascot row={0} col={1} size={48} />
      </div>
    </button>
  );
}

function BottomNav({ active, onChange }: { active: StudentTab; onChange: (t: StudentTab) => void }) {
  const t = useT();
  const tabs = [
    { id: "home" as StudentTab, icon: <Home className="w-5 h-5" />, label: t("navHome") },
    { id: "learn" as StudentTab, icon: <BookOpen className="w-5 h-5" />, label: t("navLearn") },
    { id: "game" as StudentTab, icon: <Gamepad2 className="w-5 h-5" />, label: t("navGame") },
    { id: "rewards" as StudentTab, icon: <Trophy className="w-5 h-5" />, label: t("navRewards") },
    { id: "sped" as StudentTab, icon: <Settings className="w-5 h-5" />, label: t("navSped") },
  ];
  return (
    <nav data-distraction className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="max-w-sm mx-auto flex">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className={cx("flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer transition-colors")}
              style={{ color: isActive ? P : "#6B7280" }}>
              <div className="p-1.5 rounded-xl transition-all" style={{ backgroundColor: isActive ? `${P}18` : "transparent" }}>
                {tab.icon}
              </div>
              <span className="text-[9px] font-black tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #EAF3FF 50%, #D6E8FA 100%)" }}>
      {/* Subtle blue blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full" style={{ background: "rgba(24,95,165,0.07)" }} />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full" style={{ background: "rgba(24,95,165,0.05)" }} />
      <div className="absolute top-1/3 right-4 w-28 h-28 rounded-full" style={{ background: "rgba(239,159,39,0.10)" }} />
      <div className={cx("relative z-10 text-center px-8 transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
        {/* Logo + sparkles */}
        <div className="relative mx-auto mb-2" style={{ width: 300, height: 240 }}>
          {/* Sparkle top-right */}
          <div className="absolute" style={{ top: 12, right: 18 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 0 L9.8 7.5 L17 9 L9.8 10.5 L9 18 L8.2 10.5 L1 9 L8.2 7.5 Z" fill="rgba(24,95,165,0.4)" />
            </svg>
          </div>
          {/* Sparkle top-left */}
          <div className="absolute" style={{ top: 30, left: 22 }}>
            <svg width="10" height="10" viewBox="0 0 18 18" fill="none">
              <path d="M9 0 L9.8 7.5 L17 9 L9.8 10.5 L9 18 L8.2 10.5 L1 9 L8.2 7.5 Z" fill="rgba(239,159,39,0.5)" />
            </svg>
          </div>
          {/* Sparkle bottom-left */}
          <div className="absolute" style={{ bottom: 30, left: 10 }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 0 L9.8 7.5 L17 9 L9.8 10.5 L9 18 L8.2 10.5 L1 9 L8.2 7.5 Z" fill="rgba(24,95,165,0.3)" />
            </svg>
          </div>
          {/* Sparkle bottom-right */}
          <div className="absolute" style={{ bottom: 20, right: 12 }}>
            <svg width="8" height="8" viewBox="0 0 18 18" fill="none">
              <path d="M9 0 L9.8 7.5 L17 9 L9.8 10.5 L9 18 L8.2 10.5 L1 9 L8.2 7.5 Z" fill="rgba(239,159,39,0.4)" />
            </svg>
          </div>
          <ImageWithFallback src={getsLogo} alt="GETS Logo"
            className="relative w-full h-full object-contain"
            style={{ filter: "drop-shadow(0px 6px 20px rgba(24,95,165,0.22)) drop-shadow(0px 2px 6px rgba(24,95,165,0.12))" }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1" style={{ color: P }}>Guided Education for Tailored Success</p>
        <div className="h-px my-5 mx-auto w-16" style={{ background: "rgba(24,95,165,0.25)" }} />
        <p className="text-base font-semibold leading-relaxed mb-2" style={{ color: "#1A1A1A" }}>Ang iyong AI Learning Companion</p>
        <p className="text-sm mb-10" style={{ color: "#374151" }}>Grade 7 MATATAG Curriculum · Bilingual · Offline-Ready</p>
        <button onClick={onNext}
          className="w-full font-display font-black py-4 px-8 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-white"
          style={{ backgroundColor: P }}>
          Magsimula Tayo!
        </button>
        <p className="text-xs mt-5" style={{ color: "#6B7280" }}>Available offline · Dyslexia-friendly · SPED support</p>
      </div>
    </div>
  );
}

// ─── Role Select ──────────────────────────────────────────────────────────────
function RoleSelectScreen({ onSelect }: { onSelect: (r: Role) => void }) {
  const roles = [
    { id: "student" as Role, title: "Mag-aaral", en: "Student", desc: "Para sa Grade 7 na pag-aaral ng Filipino na may AI tutor", bc: P, bg: SURF, tc: P },
    { id: "parent" as Role, title: "Magulang", en: "Parent", desc: "I-monitor ang pag-unlad ng inyong anak at makipag-ugnayan sa guro", bc: "#059669", bg: "#f0fdf4", tc: "#059669" },
    { id: "teacher" as Role, title: "Guro", en: "Teacher", desc: "AI Co-pilot para sa lesson plans at pag-monitor ng klase", bc: "#7C3AED", bg: "#f5f3ff", tc: "#7C3AED" },
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col px-5 py-8">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl mb-4 overflow-hidden flex items-center justify-center" style={{ backgroundColor: SURF }}>
            <img src={getsMascotConfused} alt="GETS mascot" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="font-display font-black text-2xl leading-tight mb-2">Sino ka sa atin?</h1>
          <p className="text-sm text-muted-foreground font-medium">Piliin ang iyong papel upang i-personalize ang iyong karanasan.</p>
        </div>
        <div className="space-y-3 flex-1">
          {roles.map((r) => (
            <button key={r.id} onClick={() => onSelect(r.id)}
              className="w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              style={{ borderColor: r.bc, backgroundColor: r.bg }}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-black text-lg" style={{ color: r.tc }}>{r.title}</span>
                  <span className="text-muted-foreground text-xs font-semibold">/ {r.en}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{r.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0" style={{ color: r.tc }} />
            </button>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground font-medium">Your data is stored safely on your device only.</p>
      </div>
    </div>
  );
}

// ─── Language Pick ────────────────────────────────────────────────────────────
function LanguagePickScreen({ onNext, onBack }: { onNext: (lang: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState("PH");
  const active = LANGUAGES.find(l => l.code === selected)!;
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col max-w-sm mx-auto w-full">
      <div className="px-5 pt-5 pb-2 shrink-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: P }}>HAKBANG 2 NG 3</span>
        </div>
        <StepDots total={3} current={2} />
      </div>
      <div className="px-5 pt-4 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="bg-white border border-border rounded-2xl p-5 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: P }}>HAKBANG 2: WIKA AT DIYALEKTO</p>
            <h2 className="font-display font-black text-2xl mb-1">Piliin ang Iyong Wika</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">We support Philippine regional mother tongues and dialects.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} onClick={() => setSelected(lang.code)}
                className="p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer"
                style={{ borderColor: selected === lang.code ? P : "rgba(24,95,165,0.15)", backgroundColor: selected === lang.code ? SURF : "#fff" }}>
                <span className="text-2xl shrink-0">{lang.flag}</span>
                <div>
                  {selected === lang.code && <span className="text-[9px] font-black uppercase block" style={{ color: P }}>{lang.code}</span>}
                  <span className="text-xs font-bold leading-tight">{lang.label}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: SURF }}>
            <p className="font-display font-black text-lg mb-1" style={{ color: P }}>{active.code}</p>
            <p className="font-bold text-base mb-1">"{active.greeting}"</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">GREETING IN: {active.label.toUpperCase()}</p>
          </div>
        </div>
        <div className="bg-white border-t border-border px-0 py-4 flex gap-3 shrink-0">
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-border font-display font-black text-sm hover:bg-muted cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> BUMALIK
          </button>
          <button onClick={() => onNext(selected)} className="flex-1 flex items-center justify-center gap-2 text-white font-display font-black text-sm py-3.5 rounded-2xl cursor-pointer" style={{ backgroundColor: P }}>
            SUSUNOD <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Assessment ───────────────────────────────────────────────────────────────
function AssessmentScreen({ onDone, onBack }: { onDone: (style: LearningStyle) => void; onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<LearningStyle[]>([]);
  const [selected, setSelected] = useState<LearningStyle | null>(null);
  const q = ASSESSMENT_QUESTIONS[qIdx];
  const isLast = qIdx === ASSESSMENT_QUESTIONS.length - 1;
  const handleNext = () => {
    if (!selected) return;
    const na = [...answers, selected];
    if (isLast) {
      const counts = { Reading: 0, Listening: 0, Watching: 0, Solving: 0 } as Record<LearningStyle, number>;
      na.forEach(a => counts[a]++);
      const best = (Object.entries(counts) as [LearningStyle, number][]).sort((a, b) => b[1] - a[1])[0][0];
      onDone(best);
    } else { setAnswers(na); setQIdx(i => i + 1); setSelected(null); }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto w-full">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: P }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MAG-AARAL</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black uppercase" style={{ color: P }}>STEP 1 OF 2</span>
          <StepDots total={2} current={1} />
        </div>
        <div className="bg-white border border-border rounded-xl p-3">
          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: P }}>PAGSUSURI NG ISTILO</p>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm">Tanong {qIdx + 1} ng {ASSESSMENT_QUESTIONS.length}</span>
            <div className="flex gap-1 ml-auto">
              {ASSESSMENT_QUESTIONS.map((_, i) => (
                <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                  style={{ backgroundColor: i < qIdx ? "#059669" : i === qIdx ? P : "#E0E0E0" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pb-28 flex-1 overflow-y-auto">
        <div className="bg-white border border-border rounded-2xl p-5 mb-4">
          <h2 className="font-display font-black text-xl leading-snug mb-1">{q.tl}</h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{q.en}</p>
        </div>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button key={opt.style} onClick={() => setSelected(opt.style)}
              className="w-full p-4 rounded-2xl border-2 flex items-start gap-4 text-left transition-all cursor-pointer"
              style={{ borderColor: selected === opt.style ? P : "rgba(24,95,165,0.15)", backgroundColor: selected === opt.style ? SURF : "#fff" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: selected === opt.style ? `${P}22` : "#F0F5FB", color: P }}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-snug">{opt.tl}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: P }}>{opt.en}</p>
              </div>
              {selected === opt.style && <CheckCircle className="w-5 h-5 shrink-0 ml-auto mt-0.5" style={{ color: P }} />}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-5 py-4 flex gap-3 max-w-sm mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-border font-display font-black text-sm hover:bg-muted cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Bumalik
        </button>
        <button onClick={handleNext} disabled={!selected}
          className="flex-1 flex items-center justify-center gap-2 font-display font-black text-sm py-3.5 rounded-2xl cursor-pointer text-white"
          style={{ backgroundColor: selected ? P : "#D1D5DB" }}>
          {isLast ? "Tapusin" : "Susunod"}
        </button>
      </div>
    </div>
  );
}

// ─── Style Result ─────────────────────────────────────────────────────────────
function StyleResultScreen({ style, onStyleChange, onNext, onBack }: { style: LearningStyle; onStyleChange: (s: LearningStyle) => void; onNext: () => void; onBack: () => void }) {
  const info = STYLE_INFO[style];
  const allStyles: LearningStyle[] = ["Reading", "Listening", "Watching", "Solving"];
  return (
    <div className="h-[100dvh] bg-background flex flex-col max-w-sm mx-auto w-full overflow-hidden">
      <div className="px-5 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: P }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MAG-AARAL</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">PAGSUSURI KUMPLETO!</p>
          <p className="font-bold text-sm text-emerald-800 leading-snug">Natukoy na namin ang iyong Estilo ng Pagkatuto!</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-5 flex flex-col justify-center gap-3">
        <div className="bg-white border border-border rounded-2xl p-4 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-2 overflow-hidden flex items-center justify-center" style={{ backgroundColor: SURF }}>
            <img src={getsMascotScholar} alt="GETS scholar mascot" className="w-full h-full object-contain p-1" />
          </div>
          <div className="text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-2" style={{ backgroundColor: P }}>
            REKOMENDADONG ISTILO
          </div>
          <h2 className="font-display font-black text-xl mb-0.5">{info.title}</h2>
          <p className="text-xs text-muted-foreground font-semibold">({info.titleEn})</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-2">{info.desc}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
          <p className="font-bold text-xs text-emerald-800 mb-1">Paano ito makakatulong sa iyo:</p>
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">{info.tip}</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">GUSTO MO BA NG IBANG ISTILO? PILIIN DITO:</p>
          <div className="grid grid-cols-2 gap-2">
            {allStyles.map((s) => (
              <button key={s} onClick={() => onStyleChange(s)}
                className="py-2 px-3 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all"
                style={{ borderColor: s === style ? P : "rgba(24,95,165,0.15)", backgroundColor: s === style ? SURF : "#fff", color: s === style ? P : "#6B7280" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 bg-white border-t border-border px-5 py-3 flex flex-col gap-1.5 max-w-sm mx-auto w-full">
        <button onClick={onNext} className="w-full flex items-center justify-center gap-2 text-white font-display font-black text-sm py-3 rounded-2xl cursor-pointer" style={{ backgroundColor: P }}>
          Napakaganda! Gumawa ng Profile <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[10px] text-muted-foreground font-medium">Maaari mong baguhin ang SPED settings sa Settings tab kahit kailan.</p>
      </div>
    </div>
  );
}

// ─── Profile Create ───────────────────────────────────────────────────────────
function ProfileCreateScreen({ onDone, onBack }: { onDone: (name: string, avatar: string) => void; onBack: () => void }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto w-full">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: P }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MAG-AARAL</span>
        </div>
        <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase" style={{ color: P }}>STEP 2 OF 2</span><StepDots total={2} current={2} /></div>
      </div>
      <div className="px-5 pb-28 flex-1 overflow-y-auto space-y-5">
        <div>
          <h2 className="font-display font-black text-2xl mb-1">Gumawa ng iyong Account</h2>
          <p className="text-sm text-muted-foreground font-medium">Create your learner account to start.</p>
        </div>
        {/* Live preview of the account being created */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: SURF }}>
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0 shadow-sm">{avatar || "🙂"}</div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: P }}>Iyong Account</p>
            <p className="font-display font-black text-lg truncate">{name.trim() || "Pangalan mo dito"}</p>
            <p className="text-[11px] text-muted-foreground font-bold">Grade 7 · MATATAG</p>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">PANGALAN NG MAG-AARAL / STUDENT NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ilagay ang iyong pangalan..." autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none placeholder:text-muted-foreground"
              style={{ backgroundColor: "#F0F5FB" }} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3">PUMILI NG IYONG KARAKTER</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((av) => (
                <button key={av} onClick={() => setAvatar(av)}
                  className="w-full aspect-square rounded-2xl border-2 text-3xl flex items-center justify-center cursor-pointer transition-all"
                  style={{ borderColor: avatar === av ? P : "rgba(24,95,165,0.15)", backgroundColor: avatar === av ? SURF : "#F0F5FB", transform: avatar === av ? "scale(1.05)" : "scale(1)" }}>
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-5 py-4 flex flex-col gap-2 max-w-sm mx-auto w-full">
        <div className="flex gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-border font-display font-black text-sm hover:bg-muted cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Bumalik
          </button>
          <button onClick={() => name.trim() && avatar && onDone(name.trim(), avatar)} disabled={!name.trim() || !avatar}
            className="flex-1 flex items-center justify-center gap-2 font-display font-black text-sm py-3.5 rounded-2xl cursor-pointer text-white disabled:cursor-not-allowed"
            style={{ backgroundColor: name.trim() && avatar ? "#059669" : "#D1D5DB" }}>
            <Check className="w-4 h-4" /> Gumawa ng Account
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground font-medium">{!name.trim() ? "Ilagay ang iyong pangalan" : !avatar ? "Pumili ng iyong karakter" : "Maaari mong baguhin ang SPED settings sa Settings tab kahit kailan."}</p>
      </div>
    </div>
  );
}

// ─── Mood Check ───────────────────────────────────────────────────────────────
function MoodCheckScreen({ learner, onDone, onSkip }: { learner: LearnerProfile; onDone: (m: Mood) => void; onSkip: () => void }) {
  const [selected, setSelected] = useState<Mood>(null);
  const moods = [
    { id: "excited" as Mood, label: "Excited", sub: "Masigla", bg: "#FEF3C7", border: "#F59E0B", img: getsMoodExcited },
    { id: "okay" as Mood, label: "Okay Lang", sub: "Just alright", bg: "#F0F5FB", border: P, img: getsMoodOkay },
    { id: "pagod" as Mood, label: "Pagod", sub: "Tired / ADHD-friendly", bg: "#ECFDF5", border: "#059669", img: getsMoodPagod },
    { id: "stressed" as Mood, label: "Medyo Stressed", sub: "Anxious / Autism-friendly", bg: "#FFF1F2", border: "#F43F5E", img: getsMoodStressed },
  ];
  const responses: Record<NonNullable<Mood>, string> = {
    excited: "Wow, excited ka pala! Gamitin natin ang iyong sigla ngayon!",
    okay: "Salamat sa pagbabahagi. Let's do some relaxed learning!",
    pagod: "Naiintindihan kita. Gagawin nating mas maikling aralin ngayon para hindi ka mapagod.",
    stressed: "Huwag mag-alala! Magsimula tayo ng dahan-dahan at relaxed na aralin.",
  };
  return (
    <div className="h-[100dvh] bg-background flex flex-col max-w-sm mx-auto w-full overflow-hidden pb-16">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: P }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MAG-AARAL {learner.avatar}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-emerald-600"><Wifi className="w-3 h-3" /><span className="text-[9px] font-bold">ONLINE</span></div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: A }}>
            <Flame className="w-3 h-3" /><span className="text-[9px] font-black">12 streak</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-5 flex flex-col justify-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: SURF }}><img src={getsMoodOkay} alt="GETS mascot" className="w-full h-full object-contain p-1" /></div>
          <h2 className="font-display font-black text-xl text-center leading-tight">Kumusta ang pakiramdam mo today?</h2>
          <p className="text-xs text-muted-foreground font-medium text-center">How are you feeling right now, {learner.name}?</p>
        </div>
        <div className="rounded-2xl p-3" style={{ backgroundColor: "#FFF8E1" }}>
          <p className="text-xs font-semibold text-center leading-relaxed" style={{ color: "#92400E" }}>Walang maling sagot! I-aakma ko ang tono ng lesson para sa iyo.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <button key={mood.id} onClick={() => setSelected(mood.id)}
              className="p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all"
              style={{ backgroundColor: mood.bg, borderColor: selected === mood.id ? mood.border : "transparent", transform: selected === mood.id ? "scale(1.03)" : "scale(1)" }}>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"><img src={mood.img} alt={mood.label} className="w-full h-full object-contain" /></div>
              <div className="text-center">
                <p className="font-display font-black text-sm">{mood.label}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{mood.sub}</p>
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="bg-white border border-border rounded-2xl p-3 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: SURF }}><img src={getsMoodOkay} alt="GETS mascot" className="w-full h-full object-contain p-0.5" /></div>
            <p className="text-xs font-semibold leading-relaxed">{responses[selected]}</p>
          </div>
        )}
      </div>
      <div className="shrink-0 max-w-sm mx-auto w-full">
        {selected && (
          <div className="px-5 pb-1">
            <button onClick={() => onDone(selected)} className="w-full text-white font-display font-black text-sm px-8 py-3 rounded-2xl shadow cursor-pointer" style={{ backgroundColor: P }}>
              Magpatuloy
            </button>
          </div>
        )}
        <button onClick={onSkip} className="w-full text-center py-1.5 font-bold text-xs cursor-pointer hover:underline" style={{ color: P }}>Skip and go to Home</button>
        <BottomNav active="home" onChange={() => {}} />
      </div>
    </div>
  );
}

// ─── Student App ──────────────────────────────────────────────────────────────
function StudentApp({ learner, onBack }: { learner: LearnerProfile; onBack: () => void }) {
  const [tab, setTab] = useState<StudentTab>("home");
  const [points, setPoints] = useState(1980);
  const [activeLesson, setActiveLesson] = useState<Subject | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [getsOpen, setGetsOpen] = useState(false);
  const [chatLog, setChatLog] = useState<{ from: "ai" | "user"; text: string }[]>([
    { from: "ai", text: `Kumusta, ${learner.name}! Ako si GETS, ang iyong Grade 7 AI Companion. Itanong mo sa akin ang kahit ano tungkol sa ating aralin!` },
  ]);
  const [chatMsg, setChatMsg] = useState("");
  const { generate } = useAI();
  const { lang } = useLang();
  const { s: a11y } = useA11y();
  const voice = useVoiceInput(lang);
  const send = async (msg: string, opts?: { spoken?: boolean }) => {
    if (!msg.trim()) return;
    setChatMsg("");
    // optimistic: show the user's message + a pending bubble, then fill the reply
    setChatLog(prev => [...prev, { from: "user", text: msg }, { from: "ai", text: "…" }]);
    let reply: string;
    try {
      reply = await generate(msg, { lang });
    } catch {
      reply = "Pasensya, hindi ako makasagot ngayon. Subukan muli.";
    }
    setChatLog(prev => {
      const next = [...prev];
      next[next.length - 1] = { from: "ai", text: reply };
      return next;
    });
    // Voice loop: speak the reply if the user spoke, or Read Aloud is on.
    if (opts?.spoken || a11y.readAloud) speak(stripMd(reply), lang);
  };
  const toggleMic = () => {
    if (voice.listening) { voice.stop(); return; }
    voice.start(
      (interim) => setChatMsg(interim),
      (final) => { setChatMsg(""); send(final, { spoken: true }); },
    );
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto w-full flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: P }} />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">MAG-AARAL {learner.avatar}</span>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <div className="flex items-center gap-1 text-emerald-600"><Wifi className="w-3 h-3" /><span className="text-[8px] font-bold">ONLINE</span></div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: A }}>
            <Flame className="w-3 h-3" /><span className="text-[9px] font-black">12</span>
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full pb-24">
        {tab === "home" && <HomeTab learner={learner} points={points} onTabChange={setTab} />}
        {tab === "learn" && <LearnTab learner={learner} activeLesson={activeLesson} onSelectLesson={setActiveLesson} onBack={() => { if (activeLesson) setActiveLesson(null); else setTab("home"); }} />}
        {tab === "game" && <GameTab learner={learner} gameMode={gameMode} onSelectMode={setGameMode} onAddPoints={p => setPoints(prev => prev + p)} onBack={() => { if (gameMode) setGameMode(null); else setTab("home"); }} />}
        {tab === "rewards" && <RewardsTab points={points} />}
        {tab === "sped" && <SpedTab onBack={onBack} />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
      <GetsBtn onOpen={() => setGetsOpen(true)} />
      {getsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full max-w-sm mx-auto rounded-t-3xl p-5 max-h-[70vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ backgroundColor: SURF }}><Mascot row={0} col={1} size={40} /></div>
                <div><h3 className="font-display font-black text-base">GETS AI Tutor</h3><p className="text-[10px] text-muted-foreground font-medium">Itanong ang kahit ano!</p></div>
              </div>
              <button onClick={() => setGetsOpen(false)} className="p-2 bg-muted rounded-xl cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[160px] max-h-[260px]">
              {chatLog.map((msg, i) => (
                <div key={i} className={cx("flex", msg.from === "user" ? "justify-end" : "justify-start")}>
                  <div className="max-w-[80%] px-3.5 py-2.5 text-xs font-medium leading-relaxed"
                    style={{ backgroundColor: msg.from === "ai" ? SURF : P, color: msg.from === "ai" ? "#2C2C2A" : "#fff", borderRadius: msg.from === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px" }}>
                    <Markdown text={msg.text} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(chatMsg); }}
                placeholder={voice.listening ? "Nakikinig… magsalita ka" : "Itanong sa GETS..."} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium outline-none placeholder:text-muted-foreground"
                style={{ backgroundColor: "#F0F5FB" }} />
              {voice.supported && (
                <button onClick={toggleMic} aria-label="Magsalita sa GETS"
                  className={cx("w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer shrink-0 border transition-colors", voice.listening && "animate-pulse")}
                  style={{ borderColor: voice.listening ? "#DC2626" : `${P}40`, backgroundColor: voice.listening ? "#FEF2F2" : "#fff", color: voice.listening ? "#DC2626" : P }}>
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => send(chatMsg)} className="w-10 h-10 text-white rounded-xl flex items-center justify-center cursor-pointer shrink-0" style={{ backgroundColor: P }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ learner, points, onTabChange }: { learner: LearnerProfile; points: number; onTabChange: (t: StudentTab) => void }) {
  const t = useT();
  const todayQuest = SUBJECTS.find(s => s.status === "needs-help") || SUBJECTS[0];
  return (
    <div className="px-4 pt-3 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{t("greeting")}</p>
          <h1 className="font-display font-black text-2xl">{learner.name} {learner.avatar}</h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "#FEF3C7", color: A }}>
            <Flame className="w-3.5 h-3.5" /><span className="font-display font-black text-xs">12</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: SURF, color: P }}>
            <Sparkles className="w-3.5 h-3.5" /><span className="font-display font-black text-xs">{points.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Comfort Mode Banner */}
      <div className="rounded-2xl p-4 flex items-center gap-3 border" style={{ backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }}>
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: "#D1FAE5" }}>
          <Mascot row={0} col={1} size={48} />
        </div>
        <p className="text-xs font-semibold text-emerald-800 leading-relaxed flex-1">
          <strong>{learner.name}'s Comfort Mode:</strong> Ang audio read-aloud ay handa para sa iyo. Pindutin lamang ang speaker button sa kahit anong lesson!
        </p>
        <div className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 text-white" style={{ backgroundColor: P }}>GETS</div>
      </div>

      {/* Focus Quest */}
      <div onClick={() => onTabChange("learn")} className="rounded-2xl p-5 text-white cursor-pointer hover:opacity-95 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${P} 0%, #0F4A87 100%)` }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>{t("mission")}</span>
          <span className="text-white/70 text-[10px] font-bold uppercase">{todayQuest.labelEn}</span>
        </div>
        <h3 className="font-display font-black text-lg mb-1 leading-tight">Grade 7: {todayQuest.topic}</h3>
        <p className="text-white/80 text-xs font-medium mb-4">Simulan ang aralin ngayon at kumita ng hanggang +45 Points!</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              <div className="h-full bg-white rounded-full" style={{ width: `${todayQuest.progress}%` }} />
            </div>
            <span className="text-white/70 text-[10px] font-bold">{todayQuest.progress}%</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            {t("start")} <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-black text-base">{t("subjects")}</h2>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: A }}>MATATAG</span>
        </div>
        <div className="space-y-3 mt-3">
          {SUBJECTS.map(s => (
            <div key={s.id} onClick={() => onTabChange("learn")}
              className={cx("rounded-2xl border p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm transition-all", s.bg, s.border)}>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: s.textColor }}>{s.label}</p>
                <p className="font-display font-black text-sm leading-snug mb-2">Grade 7: {s.topic}</p>
                <PBar value={s.progress} color={s.barColor} />
                <p className="text-[10px] text-muted-foreground font-bold mt-1.5">PROGRESS: {s.progress}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Learn Tab ────────────────────────────────────────────────────────────────
function LearnTab({ learner, activeLesson, onSelectLesson, onBack }: { learner: LearnerProfile; activeLesson: Subject | null; onSelectLesson: (s: Subject) => void; onBack: () => void }) {
  const [format, setFormat] = useState<"text" | "audio" | "visual">("text");
  const [understood, setUnderstood] = useState<boolean | null>(null);
  const { s: a11y } = useA11y();
  if (activeLesson) {
    const lc = activeLesson.lesson;
    return (
      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-muted rounded-xl cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase" style={{ color: activeLesson.textColor }}>{activeLesson.label} · {activeLesson.labelEn}</p>
            <h2 className="font-display font-black text-base leading-tight">{activeLesson.topic}</h2>
          </div>
          <button onClick={() => speak(`${lc.title}. ${lc.body.join(" ")}`)} aria-label="Basahin nang malakas" className="p-2 rounded-xl text-white shrink-0 cursor-pointer" style={{ backgroundColor: P }}><Volume2 className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F0F5FB" }}>
          {(["text", "audio", "visual"] as const).map(f => (
            <button key={f} onClick={() => setFormat(f)} className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
              style={{ backgroundColor: format === f ? "#fff" : "transparent", color: format === f ? "#2C2C2A" : "#6B7280", boxShadow: format === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
              {f === "text" ? "Teksto" : f === "audio" ? "Pakikinig" : "Visual"}
            </button>
          ))}
        </div>
        <div className="bg-white border border-border rounded-2xl p-5 min-h-[240px]">
          {format === "text" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: P }}>AI-Generated Aralin</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: A }}>MATATAG</span>
              </div>
              <h3 className="font-display font-black text-base">{lc.title}</h3>
              {a11y.focusMode ? (
                <FocusLesson body={lc.body} />
              ) : (
                lc.body.map((p, i) => (
                  <ReadAloudParagraph key={i} text={p} className="text-sm text-muted-foreground font-medium leading-relaxed" />
                ))
              )}
              <div className="rounded-xl p-3.5" style={{ backgroundColor: "#FFF8E1", border: "1px solid #F59E0B" }}>
                <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: "#92400E" }}>Halimbawa</p>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: "#78350F" }}>{lc.example}</p>
              </div>
            </div>
          )}
          {format === "audio" && (
            <div className="flex flex-col items-center justify-center py-8 gap-5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ backgroundColor: SURF }}><Mascot row={0} col={2} size={96} /></div>
              <div className="text-center"><p className="font-display font-black text-base mb-1">Audio Lesson Mode</p><p className="text-xs text-muted-foreground font-medium">Ang aralin ay babasahin nang malakas para sa iyo</p></div>
              <button className="text-white font-display font-black px-8 py-3 rounded-xl flex items-center gap-2 cursor-pointer" style={{ backgroundColor: P }}>
                <Play className="w-4 h-4" /> I-play ang Aralin
              </button>
            </div>
          )}
          {format === "visual" && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Visual Concept Map</p>
              <div className="relative flex items-center justify-center h-48">
                <div className="absolute w-28 h-12 rounded-xl flex items-center justify-center text-white font-display font-black text-sm text-center" style={{ backgroundColor: P }}>{activeLesson.label.toUpperCase()}</div>
                {["Aralin 1", "Aralin 2", "Aralin 3", "Aralin 4"].map((lbl, i) => {
                  const pos = ["top-0 left-4", "top-0 right-4", "bottom-0 left-4", "bottom-0 right-4"];
                  return <div key={i} className={`absolute ${pos[i]} border-2 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white`} style={{ borderColor: P, color: P }}>{lbl}</div>;
                })}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground">Pag-unlad sa Paksa</span>
            <span className="font-display font-black text-sm" style={{ color: P }}>{activeLesson.progress}%</span>
          </div>
          <PBar value={activeLesson.progress} color={activeLesson.barColor} />
          {understood === null ? (
            <div className="flex gap-2">
              <button onClick={() => setUnderstood(false)} className="flex-1 bg-muted py-2.5 rounded-xl text-xs font-bold text-muted-foreground cursor-pointer">Hindi pa naiintindihan</button>
              <button onClick={() => setUnderstood(true)} className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 text-white" style={{ backgroundColor: "#059669" }}>
                <Check className="w-3.5 h-3.5" /> Naintindihan ko
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: understood ? "#ECFDF5" : SURF }}>
              <p className="text-sm font-bold" style={{ color: understood ? "#065F46" : P }}>
                {understood ? "Mahusay! Patuloy sa susunod na paksa." : "Basahin muli o subukan ang Audio mode para mas maunawaan."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 pt-4 space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display font-black text-2xl">Mga Aralin</h1>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: A }}>MATATAG</span>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ARALIN NGAYONG BAITANG (GRADE 7)</p>
      </div>
      <div className="rounded-xl p-3 flex items-center gap-2" style={{ backgroundColor: SURF }}>
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "#DBEAFE" }}><Mascot row={0} col={1} size={32} /></div>
        <p className="text-xs font-semibold" style={{ color: P }}>Learning Style: <strong>{learner.learningStyle} Learner</strong> — lessons optimized for you!</p>
      </div>
      <div className="space-y-3">
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => onSelectLesson(s)}
            className={cx("w-full p-4 rounded-2xl border text-left flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer", s.bg, s.border)}>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">{s.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: s.textColor }}>{s.label}</p>
              <p className="font-display font-black text-sm leading-snug mb-2">Grade 7: {s.topic}</p>
              <PBar value={s.progress} color={s.barColor} />
              <p className="text-[10px] text-muted-foreground font-bold mt-1.5">PROGRESS: {s.progress}%</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Game Tab ─────────────────────────────────────────────────────────────────
function GameTab({ learner, gameMode, onSelectMode, onAddPoints, onBack }: { learner: LearnerProfile; gameMode: GameMode; onSelectMode: (m: GameMode) => void; onAddPoints: (p: number) => void; onBack: () => void }) {
  const { s: a11y } = useA11y();
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [rIdx, setRIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  if (gameMode === "riddle") {
    const riddle = RIDDLES[rIdx];
    if (done) return (
      <div className="px-4 pt-6 flex flex-col items-center text-center gap-5">
        <div className="w-28 h-28 rounded-2xl overflow-hidden" style={{ backgroundColor: SURF }}><Mascot row={hearts > 0 ? 2 : 1} col={1} size={112} /></div>
        <h2 className="font-display font-black text-xl">{hearts > 0 ? "Matagumpay!" : "Subukan Muli"}</h2>
        <p className="text-sm text-muted-foreground font-medium">Score: {score}/{RIDDLES.length}</p>
        {hearts > 0 && <div className="rounded-2xl px-6 py-4" style={{ backgroundColor: "#FEF3C7" }}><p className="font-display font-black text-2xl" style={{ color: A }}>+50 Points</p></div>}
        <div className="flex gap-2 w-full">
          <button onClick={() => { setRIdx(0); setAnswered(null); setHearts(3); setScore(0); setDone(false); }} className="flex-1 text-white font-display font-black py-3 rounded-xl cursor-pointer" style={{ backgroundColor: P }}>Ulit na Laro</button>
          <button onClick={onBack} className="flex-1 bg-muted font-display font-black py-3 rounded-xl cursor-pointer">Menu</button>
        </div>
      </div>
    );
    return (
      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-muted rounded-xl cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex gap-1">{[...Array(3)].map((_, i) => <Heart key={i} className={cx("w-5 h-5", hearts > i ? "fill-red-500 text-red-500" : "text-muted")} />)}</div>
          <span className="text-xs font-black" style={{ color: P }}>Score: {score}</span>
        </div>
        <div className="rounded-2xl p-4 flex items-center justify-around min-h-[100px]" style={{ background: "linear-gradient(to bottom, #134E7A, #0D3055)" }}>
          <div className="text-center"><div className="text-3xl mb-1">{learner.avatar}</div><div className="text-white text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: P }}>{learner.name}</div></div>
          <div className="font-black text-lg text-white">vs</div>
          <div className="text-center"><div className="w-10 h-10 rounded-xl mx-auto mb-1 overflow-hidden" style={{ backgroundColor: "#1a4a2e" }}><Mascot row={1} col={2} size={40} /></div><div className="text-white text-[9px] font-black bg-emerald-700 px-2 py-0.5 rounded-full">Sawang Gubat</div></div>
        </div>
        <p className="text-center text-xs font-bold text-muted-foreground">Riddle {rIdx + 1} / {RIDDLES.length}</p>
        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <p className="font-display font-black text-base leading-snug"><A11yText text={riddle.q} /></p>
          <div className="grid grid-cols-2 gap-2">
            {riddle.opts.map((opt, i) => {
              let style: React.CSSProperties = { backgroundColor: "#F0F5FB", borderColor: "transparent" };
              if (answered !== null) {
                if (i === riddle.correct) style = { backgroundColor: "#ECFDF5", borderColor: "#059669" };
                else if (answered === i) style = { backgroundColor: "#FFF1F2", borderColor: "#F43F5E", textDecoration: "line-through", opacity: 0.7 };
                else style = { backgroundColor: "#F8F8F8", borderColor: "transparent", opacity: 0.4 };
              }
              return <button key={i} disabled={answered !== null} onClick={() => { setAnswered(i); if (i === riddle.correct) setScore(s => s + 1); else setHearts(h => Math.max(0, h - 1)); }} className="p-3 rounded-xl border-2 text-sm font-semibold text-left cursor-pointer disabled:cursor-default" style={style}>{a11y.bionic ? <BionicText>{opt}</BionicText> : opt}</button>;
            })}
          </div>
          {answered !== null && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl text-xs font-semibold leading-relaxed" style={{ backgroundColor: answered === riddle.correct ? "#ECFDF5" : "#FFF1F2", color: answered === riddle.correct ? "#065F46" : "#9B1C1C", border: `1px solid ${answered === riddle.correct ? "#A7F3D0" : "#FECACA"}` }}>
                <A11yText text={riddle.expl} />
              </div>
              <button onClick={() => { if (rIdx < RIDDLES.length - 1) { setRIdx(i => i + 1); setAnswered(null); } else { setDone(true); if (hearts > 0) onAddPoints(50); } }} className="w-full text-white font-display font-black py-3 rounded-xl cursor-pointer" style={{ backgroundColor: P }}>
                {rIdx < RIDDLES.length - 1 ? "Ipagpatuloy" : "Tapusin ang Laro"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  const modes = [
    { id: "riddle" as GameMode, title: "Bugtungan sa Gubat", sub: "PRE-COLONIAL LITERATURE", desc: "Lutasin ang mga riddles upang matalo ang kalaban!", bg: "#ECFDF5", border: "#A7F3D0", tc: "#065F46", pts: "+50 pts", mR: 1, mC: 2 },
    { id: null, title: "Pang-abay Superhero Arena", sub: "WIKA AT BALARILA", desc: "Bumuo ng tamang pangungusap at umatake gamit ang Pang-abay!", bg: SURF, border: "#BFDBFE", tc: P, pts: "+50 pts", mR: 0, mC: 1 },
    { id: null, title: "Ang Alamat ni Maria", sub: "DYSLEXIA-FRIENDLY STORY", desc: "Gumawa ng mahahalagang desisyon sa pakikipagsapalaran!", bg: "#FFF1F2", border: "#FECACA", tc: "#9B1C1C", pts: "+50 pts", mR: 1, mC: 1 },
    { id: null, title: "Bilis-Isip Speed Sprint", sub: "TIMER-BASED CHALLENGE", desc: "10 segundo bawat tanong! Mas mabilis, mas maraming Points!", bg: "#FEF3C7", border: "#FDE68A", tc: "#92400E", pts: "+65 pts", mR: 2, mC: 1 },
  ];
  return (
    <div className="px-4 pt-4 space-y-5">
      <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">GETS Filipino</p><h1 className="font-display font-black text-2xl">Mga Laro</h1></div>
      <div className="rounded-2xl p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${P}, #7C3AED)` }}>
        <div className="flex justify-center mb-2"><div className="w-16 h-16 rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><Mascot row={0} col={2} size={64} /></div></div>
        <p className="font-display font-black text-base mb-0.5">GETS G7 Filipino Arena</p>
        <p className="text-white/80 text-xs font-medium">Kumita ng mga Points sa bawat laro!</p>
      </div>
      <div className="space-y-3">
        {modes.map((mode, i) => (
          <button key={i} onClick={() => mode.id !== undefined && onSelectMode(mode.id)} className="w-full text-left rounded-2xl border-2 p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer"
            style={{ backgroundColor: mode.bg, borderColor: mode.border }}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: mode.border }}><Mascot row={mode.mR} col={mode.mC} size={48} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-muted-foreground">{mode.sub}</p>
              <p className="font-display font-black text-sm leading-snug mb-1" style={{ color: mode.tc }}>{mode.title}</p>
              <p className="text-[11px] text-muted-foreground font-medium line-clamp-2">{mode.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: A }}>{mode.pts}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Rewards Tab ──────────────────────────────────────────────────────────────
function RewardsTab({ points }: { points: number }) {
  const [rewardTab, setRewardTab] = useState<"badges" | "leaderboard">("badges");
  return (
    <div className="px-4 pt-4 space-y-5">
      <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Iyong mga tagumpay</p><h1 className="font-display font-black text-2xl">Gantimpala</h1></div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Sparkles className="w-5 h-5" style={{ color: P }} />, val: points.toLocaleString(), lbl: "Points" },
          { icon: <Flame className="w-5 h-5 text-orange-500" />, val: "12", lbl: "Day Streak" },
          { icon: <Award className="w-5 h-5" style={{ color: A }} />, val: BADGES.filter(b => b.earned).length, lbl: "Mga Badge" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-3.5 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <div className="font-display font-black text-xl">{s.val}</div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase">Lingguhang Streak</p>
        <div className="flex gap-1.5 justify-between">
          {["Lun", "Mar", "Miy", "Huw", "Biy", "Sab", "Lin"].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: i < 5 ? P : "#F0F5FB", color: i < 5 ? "#fff" : "#6B7280" }}>
                {i < 5 ? <Check className="w-4 h-4" /> : "·"}
              </div>
              <span className="text-[9px] font-bold text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4 flex items-center gap-4" style={{ backgroundColor: SURF }}>
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"><Mascot row={2} col={1} size={64} /></div>
        <div><p className="font-display font-black text-base" style={{ color: P }}>Napakahusay!</p><p className="text-xs text-muted-foreground font-medium leading-relaxed">Patuloy ang iyong pagpapagaling. Kumita ng mas maraming badges!</p></div>
      </div>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: "#F0F5FB" }}>
        {(["badges", "leaderboard"] as const).map(t => (
          <button key={t} onClick={() => setRewardTab(t)} className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ backgroundColor: rewardTab === t ? "#fff" : "transparent", color: rewardTab === t ? "#2C2C2A" : "#6B7280", boxShadow: rewardTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
            {t === "badges" ? "Mga Badge" : "Leaderboard"}
          </button>
        ))}
      </div>
      {rewardTab === "badges" && (
        <div className="grid grid-cols-4 gap-2.5">
          {BADGES.map(b => (
            <div key={b.id} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center"
              style={{ backgroundColor: b.earned ? "#FEF3C7" : "#F8F8F8", borderColor: b.earned ? "#F59E0B" : "#E0E0E0", opacity: b.earned ? 1 : 0.5 }}>
              {b.earned ? <div className="w-8 h-8 rounded-lg overflow-hidden"><Mascot row={2} col={1} size={32} /></div> : <Lock className="w-5 h-5 text-muted-foreground" />}
              <span className="text-[8px] font-bold text-muted-foreground leading-tight text-center">{b.label}</span>
              {b.earned && b.date && <span className="text-[7px] font-medium" style={{ color: A }}>{b.date}</span>}
            </div>
          ))}
        </div>
      )}
      {rewardTab === "leaderboard" && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {LEADERBOARD.map((user, i) => (
            <div key={i} className={cx("flex items-center gap-3 px-4 py-3.5", i < LEADERBOARD.length - 1 && "border-b border-border")}
              style={{ backgroundColor: user.isYou ? SURF : "#fff" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs shrink-0"
                style={{ backgroundColor: i === 0 ? "#FEF3C7" : i === 1 ? SURF : "#F5F5F5", color: i === 0 ? "#92400E" : i === 1 ? P : "#6B7280" }}>{user.rank}</div>
              <span className="text-lg shrink-0">{user.avatar}</span>
              <span className="font-bold text-sm flex-1" style={{ color: user.isYou ? P : "#2C2C2A" }}>{user.name}{user.isYou && " (Ikaw)"}</span>
              <span className="font-display font-black text-sm">{user.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SPED Tab ─────────────────────────────────────────────────────────────────
function SpedTab({ onBack }: { onBack: () => void }) {
  const { s, update } = useA11y();
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="w-12 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-colors" style={{ backgroundColor: on ? P : "#D1D5DB" }}>
      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm" style={{ left: on ? 24 : 2 }} />
    </button>
  );
  // Profile presets — mapped to the README's SPED accessibility modes
  const PRESETS: Record<A11ySettings["profile"], Omit<A11ySettings, "profile">> = {
    none:     { dyslexiaFont: false, readAloud: false, bionic: false, calmMode: false, largeText: false, zenMode: false, auditoryChimes: false, focusMode: false },
    dyslexia: { dyslexiaFont: true,  readAloud: true,  bionic: true,  calmMode: false, largeText: false, zenMode: false, auditoryChimes: false, focusMode: false }, // font + read-aloud + text highlighting
    adhd:     { dyslexiaFont: false, readAloud: false, bionic: false, calmMode: false, largeText: false, zenMode: true,  auditoryChimes: true,  focusMode: true  }, // micro-lessons + focus-friendly + reward cues
    autism:   { dyslexiaFont: false, readAloud: false, bionic: false, calmMode: true,  largeText: false, zenMode: true,  auditoryChimes: false, focusMode: false }, // reduced clutter + predictable
  };
  const applyProfile = (id: A11ySettings["profile"]) => {
    const preset = PRESETS[id];
    update({ ...preset, profile: id });
    if (preset.auditoryChimes) chime();
    if (preset.readAloud) speak("Naka-bukas na ang read aloud.");
  };
  const toggleKey = (key: keyof Omit<A11ySettings, "profile">) => {
    const next = !s[key];
    update({ [key]: next, profile: "none" } as Partial<A11ySettings>);
    if (next && (key === "auditoryChimes" || s.auditoryChimes)) chime();
    if (next && key === "readAloud") speak("Naka-bukas na ang read aloud. Babasahin ko nang malakas ang teksto.");
  };
  const profiles = [
    { id: "none" as const, label: "Walang Profile", desc: "Default settings", bg: "#F0F5FB", border: "#BFDBFE", tc: P },
    { id: "dyslexia" as const, label: "Dyslexia", desc: "Font + spacing support", bg: "#EDE9FE", border: "#C4B5FD", tc: "#5B21B6" },
    { id: "adhd" as const, label: "ADHD", desc: "Shorter lessons + timers", bg: "#FEF3C7", border: "#FDE68A", tc: "#92400E" },
    { id: "autism" as const, label: "Autism-friendly", desc: "Low sensory + calm mode", bg: "#ECFDF5", border: "#A7F3D0", tc: "#065F46" },
  ];
  const settings: { key: keyof Omit<A11ySettings, "profile">; label: string; desc: string }[] = [
    { key: "dyslexiaFont", label: "Dyslexia-Friendly Font", desc: "Gamit ang Lexend font para madaling basahin" },
    { key: "readAloud", label: "Read Aloud (TTS)", desc: "Basahin nang malakas ang lahat ng teksto" },
    { key: "bionic", label: "Bionic Reading", desc: "I-bold ang unang bahagi ng bawat salita" },
    { key: "calmMode", label: "Calm Mode / No Animations", desc: "Tanggalin ang mga animation at malakas na kulay" },
    { key: "largeText", label: "Malaking Teksto", desc: "Palakihin ang lahat ng text" },
    { key: "zenMode", label: "Zen Mode", desc: "Tanggalin ang lahat ng distraction" },
    { key: "auditoryChimes", label: "Auditory Chimes", desc: "Mga tunog para sa routine-sensitive na mag-aaral" },
    { key: "focusMode", label: "Focus Mode (Micro-Lessons)", desc: "Hatiin ang aralin sa maiikling bahagi na may timer" },
  ];
  return (
    <div className="px-4 pt-4 space-y-5">
      <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Accessibility at Support</p><h1 className="font-display font-black text-2xl">SPED Settings</h1><p className="text-xs text-muted-foreground font-medium mt-1">I-customize ang app para sa iyong mga pangangailangan.</p></div>
      <div className="bg-white border border-border rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">MABILIS NA PROFILE</p>
        <div className="grid grid-cols-2 gap-2">
          {profiles.map(p => (
            <button key={p.id} onClick={() => applyProfile(p.id)} className="py-3 px-3 rounded-xl border-2 text-xs font-bold flex flex-col gap-0.5 cursor-pointer transition-all text-left"
              style={{ backgroundColor: s.profile === p.id ? p.bg : "#F8F8F8", borderColor: s.profile === p.id ? p.border : "#E0E0E0", color: s.profile === p.id ? p.tc : "#6B7280" }}>
              <span className="font-black">{p.label}</span><span className="text-[9px] opacity-70">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">MGA SETTING</p>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {settings.map((st, i) => (
            <div key={st.key} className={cx("flex items-center gap-3 p-4", i < settings.length - 1 && "border-b border-border")}>
              <div className="flex-1 min-w-0"><p className="font-bold text-sm">{st.label}</p><p className="text-[11px] text-muted-foreground font-medium leading-snug">{st.desc}</p></div>
              <Toggle on={!!s[st.key]} onToggle={() => toggleKey(st.key)} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={onBack} className="w-full py-3.5 rounded-2xl border-2 font-display font-black text-sm cursor-pointer hover:opacity-90 transition-opacity"
        style={{ borderColor: "#A32D2D", backgroundColor: "#FFF1F2", color: "#A32D2D" }}>Lumabas sa Account</button>
    </div>
  );
}

// ─── Parent App ───────────────────────────────────────────────────────────────
const PARENT_CHILDREN = [
  {
    key: "Jasmin", avatar: "👧", grade: "Grade 7", profile: "ADHD Support",
    score: 88, time: "125 mins", streak: 12, trend: "+5%", trendUp: true,
    weeklyTime: [45, 60, 30, 70, 55, 80, 50],
    subjects: [
      { label: "Matematika", progress: 75, color: A },
      { label: "Agham", progress: 40, color: "bg-emerald-500" },
      { label: "Ingles", progress: 60, color: P },
      { label: "Filipino", progress: 25, color: "bg-red-500" },
    ],
    recentActivity: [
      { action: "Completed Bugtungan sa Gubat", time: "2 hours ago", type: "game" },
      { action: "Finished Matematika lesson", time: "Yesterday, 4pm", type: "lesson" },
      { action: "Earned Sprint Master badge", time: "Yesterday, 2pm", type: "badge" },
      { action: "Studied Filipino for 30 mins", time: "2 days ago", type: "lesson" },
    ],
    teacherNote: "Jasmin is excelling in Reading and participates actively in class discussions. She may need extra support in Filipino writing exercises.",
  },
  {
    key: "Maria", avatar: "👧", grade: "Grade 7", profile: "Dyslexia Support",
    score: 76, time: "90 mins", streak: 4, trend: "Stable", trendUp: false,
    weeklyTime: [30, 40, 25, 50, 35, 45, 40],
    subjects: [
      { label: "Matematika", progress: 55, color: A },
      { label: "Agham", progress: 60, color: "bg-emerald-500" },
      { label: "Ingles", progress: 70, color: P },
      { label: "Filipino", progress: 45, color: "bg-red-500" },
    ],
    recentActivity: [
      { action: "Used Bionic Reading mode", time: "3 hours ago", type: "lesson" },
      { action: "Completed Agham lesson", time: "Yesterday, 5pm", type: "lesson" },
      { action: "Studied with Read Aloud on", time: "2 days ago", type: "lesson" },
    ],
    teacherNote: "Maria is making steady progress with the dyslexia-friendly tools. The bionic reading and audio features are helping her engage better with lessons.",
  },
  {
    key: "Mark Joseph", avatar: "👦", grade: "Grade 7", profile: "Autism Support",
    score: 92, time: "145 mins", streak: 12, trend: "+15%", trendUp: true,
    weeklyTime: [80, 90, 70, 100, 85, 120, 110],
    subjects: [
      { label: "Matematika", progress: 95, color: A },
      { label: "Agham", progress: 88, color: "bg-emerald-500" },
      { label: "Ingles", progress: 90, color: P },
      { label: "Filipino", progress: 82, color: "bg-red-500" },
    ],
    recentActivity: [
      { action: "Top scorer in Speed Sprint", time: "1 hour ago", type: "game" },
      { action: "Finished all Matematika modules", time: "Today, 9am", type: "lesson" },
      { action: "Earned Top Scorer badge", time: "Yesterday", type: "badge" },
    ],
    teacherNote: "Mark Joseph is an outstanding student. He consistently leads the class. Consider enrichment activities to keep him challenged.",
  },
];

function ParentApp({ onBack }: { onBack: () => void }) {
  const [selectedChild, setSelectedChild] = useState("Jasmin");
  const [tab, setTab] = useState<"overview" | "ask" | "settings">("overview");
  const [chatLog, setChatLog] = useState<{ from: "parent" | "ai"; text: string }[]>([
    { from: "ai", text: "Kumusta! I'm your GETS Parent Assistant. Ask me anything about your child's learning progress, study habits, or how to support them at home." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const { generate } = useAI();
  const { lang } = useLang();
  const { s: a11y } = useA11y();
  const voice = useVoiceInput(lang);

  const child = PARENT_CHILDREN.find(c => c.key === selectedChild)!;

  const suggestedQuestions = [
    `How is ${selectedChild} doing this week?`,
    `Which subject needs the most attention?`,
    `How can I help ${selectedChild} at home?`,
    `What's ${selectedChild}'s learning style?`,
  ];

  const aiResponses: Record<string, string> = {
    default: `Based on this week's data, ${child.key} has studied for ${child.time} with an average score of ${child.score}%. ${child.trendUp ? `That's ${child.trend} improvement — great progress!` : "Performance is stable this week."} Their strongest subject is ${child.subjects.reduce((a, b) => a.progress > b.progress ? a : b).label}.`,
    subject: `${child.key}'s weakest subject right now is ${child.subjects.reduce((a, b) => a.progress < b.progress ? a : b).label} at ${child.subjects.reduce((a, b) => a.progress < b.progress ? a : b).progress}% completion. I recommend spending 15–20 minutes daily on this subject. The GETS app has adaptive lessons that adjust to ${child.key}'s pace.`,
    help: `Here are 3 ways to support ${child.key} at home:\n\n1. Review the day's lesson together for 10 minutes after school.\n2. Ask them to explain what they learned — teaching reinforces memory.\n3. Celebrate small wins to keep motivation high. ${child.key} currently has a ${child.streak}-day streak!`,
    style: `${child.key}'s learning profile is set to "${child.profile}". The GETS app has automatically adjusted font sizes, animation levels, and lesson pacing to match their needs. You can fine-tune these in the SPED Settings tab anytime.`,
  };

  // Domain fallback used offline (Mock); a real provider ignores it and generates.
  const cannedReply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("subject") || lower.includes("attention") || lower.includes("paksa")) return aiResponses.subject;
    if (lower.includes("help") || lower.includes("home") || lower.includes("tulong") || lower.includes("bahay")) return aiResponses.help;
    if (lower.includes("style") || lower.includes("learning") || lower.includes("profile")) return aiResponses.style;
    return aiResponses.default;
  };

  const sendMessage = async (text: string, opts?: { spoken?: boolean }) => {
    if (!text.trim()) return;
    setChatLog(prev => [...prev, { from: "parent", text }]);
    setChatInput("");
    setAiTyping(true);
    let response: string;
    try {
      response = await generate(text, { lang, system: `You are the GETS parent assistant. Explain ${child.key}'s learning progress in clear, jargon-free language and suggest supportive actions at home.`, fallback: cannedReply(text) });
    } catch {
      response = cannedReply(text);
    }
    setChatLog(prev => [...prev, { from: "ai", text: response }]);
    setAiTyping(false);
    if (opts?.spoken || a11y.readAloud) speak(stripMd(response), lang);
  };
  const toggleMic = () => {
    if (voice.listening) { voice.stop(); return; }
    voice.start((interim) => setChatInput(interim), (final) => { setChatInput(""); sendMessage(final, { spoken: true }); });
  };

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, aiTyping]);

  const maxWeeklyTime = Math.max(...child.weeklyTime);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFB" }}>
      {/* Header */}
      <div className="bg-white border-b border-border px-5 pt-5 pb-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack} className="p-2 rounded-xl cursor-pointer transition-colors hover:bg-muted" style={{ backgroundColor: "#F0F5FB" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: P }} />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GETS Parent Portal</p>
              <h1 className="font-display font-black text-lg" style={{ color: "#1A1A1A" }}>Family Dashboard</h1>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-black text-sm" style={{ backgroundColor: P }}>G</div>
          </div>

          {/* Child selector */}
          <div className="flex gap-2">
            {PARENT_CHILDREN.map(ch => (
              <button key={ch.key} onClick={() => { setSelectedChild(ch.key); setChatLog([{ from: "ai", text: `Kumusta! Ask me anything about ${ch.key}'s learning progress.` }]); }}
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 cursor-pointer transition-all"
                style={{ borderColor: selectedChild === ch.key ? P : "transparent", backgroundColor: selectedChild === ch.key ? SURF : "#F0F5FB" }}>
                <span className="text-lg shrink-0">{ch.avatar}</span>
                <div className="text-left min-w-0">
                  <p className="text-xs font-black truncate" style={{ color: selectedChild === ch.key ? P : "#4B5563" }}>{ch.key}</p>
                  <p className="text-[9px] font-medium text-muted-foreground">Grade 7</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-border px-5">
        <div className="max-w-sm mx-auto flex">
          {([
            { id: "overview", label: "Overview" },
            { id: "ask", label: "Ask AI" },
            { id: "settings", label: "Settings" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-xs font-black cursor-pointer transition-all relative"
              style={{ color: tab === t.id ? P : "#6B7280" }}>
              {t.label}
              {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: P }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-4 py-5 space-y-4 pb-8">

          {/* ── OVERVIEW TAB ── */}
          {tab === "overview" && (
            <>
              {/* Hero card */}
              <div className="rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${P} 0%, #0F4A87 100%)` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">{child.avatar}</div>
                  <div>
                    <h2 className="font-display font-black text-xl">{child.key}</h2>
                    <p className="text-white/70 text-xs font-medium">{child.grade} · {child.profile}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-display font-black">{child.score}%</div>
                    <div className="text-white/70 text-[10px] font-bold uppercase">Avg Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Study Time", value: child.time },
                    { label: "Day Streak", value: `${child.streak} days` },
                    { label: "This Week", value: child.trend },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-2xl px-3 py-2.5 text-center">
                      <p className="font-display font-black text-sm text-white">{stat.value}</p>
                      <p className="text-white/60 text-[9px] font-bold uppercase mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly activity chart */}
              <div className="bg-white rounded-3xl p-5 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>Weekly Study Time</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Minutes per day this week</p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: child.trendUp ? "#ECFDF5" : "#FEF3C7", color: child.trendUp ? "#065F46" : "#92400E" }}>
                    {child.trend} vs last week
                  </span>
                </div>
                <div className="flex items-end gap-1.5 h-20">
                  {child.weeklyTime.map((mins, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-lg transition-all" style={{ height: `${(mins / maxWeeklyTime) * 72}px`, backgroundColor: i === 6 ? P : `${P}40` }} />
                      <span className="text-[9px] font-bold text-muted-foreground">{days[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject progress */}
              <div className="bg-white rounded-3xl p-5 border border-border">
                <p className="font-display font-black text-sm mb-4" style={{ color: "#1A1A1A" }}>Subject Progress</p>
                <div className="space-y-4">
                  {child.subjects.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold" style={{ color: "#2C2C2A" }}>{s.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black" style={{ color: "#2C2C2A" }}>{s.progress}%</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: s.progress >= 75 ? "#ECFDF5" : s.progress >= 50 ? "#FEF3C7" : "#FFF1F2", color: s.progress >= 75 ? "#065F46" : s.progress >= 50 ? "#92400E" : "#9B1C1C" }}>
                            {s.progress >= 75 ? "Strong" : s.progress >= 50 ? "Improving" : "Needs help"}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#F0F5FB" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.progress}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher's note */}
              <div className="bg-white rounded-3xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: "#059669" }}>T</div>
                  <div>
                    <p className="font-bold text-xs" style={{ color: "#1A1A1A" }}>Mrs. Corazon Dela Cruz</p>
                    <p className="text-[9px] text-muted-foreground">Class Teacher · Rizal NHS</p>
                  </div>
                  <span className="ml-auto text-[9px] text-muted-foreground font-medium">Today</span>
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: "#374151" }}>{child.teacherNote}</p>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-3xl p-5 border border-border">
                <p className="font-display font-black text-sm mb-4" style={{ color: "#1A1A1A" }}>Recent Activity</p>
                <div className="space-y-3">
                  {child.recentActivity.map((act, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: act.type === "game" ? "#FEF3C7" : act.type === "badge" ? SURF : "#F0FDF4" }}>
                        <span className="text-sm">{act.type === "game" ? "🎮" : act.type === "badge" ? "🏅" : "📖"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "#2C2C2A" }}>{act.action}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── ASK AI TAB ── */}
          {tab === "ask" && (
            <div className="flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
              {/* AI intro */}
              <div className="rounded-3xl p-4 mb-4 flex items-start gap-3" style={{ backgroundColor: SURF }}>
                <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: `${P}22` }}>
                  <Mascot row={0} col={1} size={40} />
                </div>
                <div>
                  <p className="font-display font-black text-sm" style={{ color: P }}>GETS Parent AI</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Ask anything about {child.key}'s progress, study habits, or how to help at home.</p>
                </div>
              </div>

              {/* Suggested questions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all hover:opacity-80 border"
                    style={{ backgroundColor: "#fff", borderColor: `${P}30`, color: P }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat messages */}
              <div className="flex-1 space-y-3 mb-4">
                {chatLog.map((msg, i) => (
                  <div key={i} className={cx("flex", msg.from === "parent" ? "justify-end" : "justify-start")}>
                    {msg.from === "ai" && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mr-2 mt-1" style={{ backgroundColor: `${P}20` }}>
                        <Mascot row={0} col={1} size={28} />
                      </div>
                    )}
                    <div className="max-w-[78%] px-4 py-3 text-xs font-medium leading-relaxed whitespace-pre-line"
                      style={{
                        backgroundColor: msg.from === "ai" ? "#fff" : P,
                        color: msg.from === "ai" ? "#2C2C2A" : "#fff",
                        borderRadius: msg.from === "ai" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                        border: msg.from === "ai" ? "1px solid rgba(24,95,165,0.1)" : "none",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}>
                      <Markdown text={msg.text} />
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden" style={{ backgroundColor: `${P}20` }}><Mascot row={0} col={1} size={28} /></div>
                    <div className="px-4 py-3 rounded-2xl bg-white border border-border flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: P, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 sticky bottom-4">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendMessage(chatInput); }}
                  placeholder={voice.listening ? "Nakikinig… magsalita ka" : `Ask about ${child.key}...`}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-medium outline-none placeholder:text-muted-foreground border border-border bg-white"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }} />
                {voice.supported && (
                  <button onClick={toggleMic} aria-label="Magsalita"
                    className={cx("w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer shrink-0 border transition-colors", voice.listening && "animate-pulse")}
                    style={{ borderColor: voice.listening ? "#DC2626" : `${P}40`, backgroundColor: voice.listening ? "#FEF2F2" : "#fff", color: voice.listening ? "#DC2626" : P }}>
                    <Mic className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => sendMessage(chatInput)}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: P }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <>
              <div className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>Child Profile</p>
                </div>
                {[
                  { label: "SPED Support", value: child.profile },
                  { label: "Learning Style", value: "Reading Learner" },
                  { label: "Grade Level", value: "Grade 7" },
                ].map((s, i, arr) => (
                  <div key={i} className={cx("flex items-center px-5 py-4", i < arr.length - 1 && "border-b border-border")}>
                    <p className="flex-1 text-sm font-semibold" style={{ color: "#2C2C2A" }}>{s.label}</p>
                    <span className="text-xs font-bold text-muted-foreground mr-2">{s.value}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>Parental Controls</p>
                </div>
                {[
                  { label: "Screen Time Limit", value: "60 mins / day" },
                  { label: "App Lock PIN", value: "Enabled" },
                  { label: "Offline Sync", value: "On" },
                  { label: "App Language", value: "Filipino" },
                  { label: "Progress Alerts", value: "Weekly" },
                ].map((s, i, arr) => (
                  <div key={i} className={cx("flex items-center px-5 py-4", i < arr.length - 1 && "border-b border-border")}>
                    <p className="flex-1 text-sm font-semibold" style={{ color: "#2C2C2A" }}>{s.label}</p>
                    <span className="text-xs font-bold text-muted-foreground mr-2">{s.value}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>

              <button onClick={onBack}
                className="w-full py-3.5 rounded-2xl text-sm font-display font-black cursor-pointer transition-opacity hover:opacity-80 border-2"
                style={{ borderColor: "#A32D2D", backgroundColor: "#FFF1F2", color: "#A32D2D" }}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Teacher App ──────────────────────────────────────────────────────────────
const TEACHER_CLASSES = [
  {
    id: "sampaguita", name: "Grade 7 — Sampaguita", subject: "Filipino", color: "#A32D2D",
    topic: "Panitikan sa Panahon ng Katutubo", students: 14, avgScore: 82, spedCount: 3,
    materials: [
      { type: "Lesson Plan", title: "Panitikan sa Katutubo", status: "approved" },
      { type: "Quiz", title: "Bugtong at Salawikain", status: "draft" },
    ],
  },
  {
    id: "luzon", name: "Grade 7 — Luzon", subject: "Agham", color: "#059669",
    topic: "Ugnayan sa Ecosystem", students: 12, avgScore: 78, spedCount: 2,
    materials: [
      { type: "Lesson Plan", title: "Symbiosis at Ecological Relationships", status: "approved" },
      { type: "Worksheet", title: "Food Web Activity", status: "approved" },
    ],
  },
  {
    id: "visayas", name: "Grade 7 — Visayas", subject: "Matematika", color: A,
    topic: "Polygons (Gilid at Anggulo)", students: 12, avgScore: 88, spedCount: 1,
    materials: [
      { type: "Lesson Plan", title: "Regular at Irregular Polygons", status: "approved" },
      { type: "Quiz", title: "Interior Angles Formula", status: "draft" },
    ],
  },
];

const TEACHER_AI_RESPONSES: Record<string, string> = {
  default: "I can help you create lesson plans, quizzes, worksheets, or rubrics — with built-in SPED adaptations. Try asking me:\n\n• \"Make a lesson plan on Alamat for Grade 7\"\n• \"Create a 5-item quiz on Polygons\"\n• \"How do I adapt this lesson for dyslexic students?\"\n• \"What are good ADHD-friendly activities?\"",
  lessonplan: "Here's a MATATAG-aligned lesson plan:\n\n**Topic:** Panitikan sa Panahon ng Katutubo\n**Grade:** 7 | **Duration:** 60 mins\n\n**Layunin:**\nMatukoy ang mga katangian ng oral tradition at maibahagi ang kahalagahan ng Alamat.\n\n**Mga Gawain:**\n1. Motivation: Magpakita ng larawan ng Pinya (5 mins)\n2. Pagbabasa ng Alamat ng Pinya (15 mins)\n3. Pangkatang talakayan: Mga katangian (20 mins)\n4. Paglikha ng sariling maikling Alamat (15 mins)\n5. Pagbabahagi at pagtatasa (5 mins)\n\n**SPED Adaptation:**\n• Dyslexia: Bionic text format, larger font\n• ADHD: Break into 15-min segments\n• Autism: Structured checklist provided",
  quiz: "Here's a 5-item quiz on Polygons:\n\n1. Ano ang kahulugan ng polygon? (2pts)\n2. Ilang anggulo ang mayroon ang isang hexagon? (1pt)\n3. Gamitin ang formula (n–2)×180° para hanapin ang sum of interior angles ng pentagon. (3pts)\n4. Ano ang pagkakaiba ng regular at irregular polygon? (2pts)\n5. Iguhit ang isang octagon at bilangin ang mga gilid nito. (2pts)\n\n**SPED Note:** Para sa mga dyslexic na estudyante, maaaring basahin nang malakas ang bawat tanong.",
  sped: "Here are practical SPED strategies for your class:\n\n**For Dyslexia:**\n• Use bionic reading (bold first half of words)\n• Increase font size to 14pt minimum\n• Allow extra time on written tasks\n• Pair text with visuals\n\n**For ADHD:**\n• Break lessons into 10–15 min chunks\n• Use movement breaks between activities\n• Provide a visual timer\n• Give one instruction at a time\n\n**For Autism:**\n• Post a visual schedule of the class\n• Warn before transitions (say '5 minutes left')\n• Provide a quiet corner option\n• Use literal, concrete language",
  adhd: "Great ADHD-friendly classroom activities:\n\n1. **Station Rotation** — Students rotate between 3 activity stations every 12 minutes\n2. **Think-Pair-Share** — Short individual think time, then partner discussion\n3. **Exit Ticket** — 2-minute written reflection at end of class\n4. **Gamified Drills** — Use the GETS Bilis-Isip Speed Sprint for vocabulary review\n5. **Movement-based Review** — Students stand if answer is TRUE, sit if FALSE\n\nAll of these work well within the MATATAG curriculum framework.",
};

function TeacherApp({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"overview" | "ai" | "classes">("overview");
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<{ from: "teacher" | "ai"; text: string }[]>([
    { from: "ai", text: "Hi, Mrs. Corazon! I'm your GETS AI Co-pilot. I can help you draft lesson plans, quizzes, worksheets, and SPED adaptations in seconds. What do you need today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const { generate } = useAI();
  const { lang } = useLang();
  const { s: a11y } = useA11y();
  const voice = useVoiceInput(lang);

  const quickPrompts = [
    "Make a lesson plan on Alamat",
    "Create a quiz on Polygons",
    "SPED tips for my class",
    "ADHD-friendly activities",
  ];

  // Domain fallback used offline (Mock); a real provider ignores it and generates.
  const cannedReply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("lesson plan") || lower.includes("lesson") || lower.includes("alamat")) return TEACHER_AI_RESPONSES.lessonplan;
    if (lower.includes("quiz") || lower.includes("polygon") || lower.includes("test")) return TEACHER_AI_RESPONSES.quiz;
    if (lower.includes("sped") || lower.includes("dyslexia") || lower.includes("autism") || lower.includes("adapt")) return TEACHER_AI_RESPONSES.sped;
    if (lower.includes("adhd") || lower.includes("activities") || lower.includes("activit")) return TEACHER_AI_RESPONSES.adhd;
    return TEACHER_AI_RESPONSES.default;
  };

  const sendMessage = async (text: string, opts?: { spoken?: boolean }) => {
    if (!text.trim()) return;
    setChatLog(prev => [...prev, { from: "teacher", text }]);
    setChatInput("");
    setAiTyping(true);
    let reply: string;
    try {
      reply = await generate(text, { lang, system: "You are the GETS teacher co-pilot. Help draft MATATAG-aligned lesson plans, quizzes, worksheets, and SPED adaptations. The teacher reviews and approves everything.", fallback: cannedReply(text) });
    } catch {
      reply = cannedReply(text);
    }
    setChatLog(prev => [...prev, { from: "ai", text: reply }]);
    setAiTyping(false);
    if (opts?.spoken || a11y.readAloud) speak(stripMd(reply), lang);
  };
  const toggleMic = () => {
    if (voice.listening) { voice.stop(); return; }
    voice.start((interim) => setChatInput(interim), (final) => { setChatInput(""); sendMessage(final, { spoken: true }); });
  };

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, aiTyping]);

  const selectedClass = TEACHER_CLASSES.find(c => c.id === activeClass);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFB" }}>

      {/* Header */}
      <div className="bg-white border-b border-border px-5 pt-5 pb-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={activeClass ? () => setActiveClass(null) : onBack}
              className="p-2 rounded-xl cursor-pointer hover:bg-muted transition-colors" style={{ backgroundColor: "#F0F5FB" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: P }} />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GETS Teacher Portal</p>
              <h1 className="font-display font-black text-lg" style={{ color: "#1A1A1A" }}>
                {activeClass ? selectedClass?.name : "Teacher Dashboard"}
              </h1>
            </div>
            <div className="text-right">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-black text-sm" style={{ backgroundColor: "#7C3AED" }}>C</div>
            </div>
          </div>
          {!activeClass && (
            <p className="text-xs text-muted-foreground font-medium ml-11">Mrs. Corazon Dela Cruz · Rizal NHS</p>
          )}
        </div>
      </div>

      {/* Tab bar — hidden when viewing class detail */}
      {!activeClass && (
        <div className="bg-white border-b border-border px-5">
          <div className="max-w-sm mx-auto flex">
            {([
              { id: "overview", label: "Overview" },
              { id: "ai", label: "AI Co-pilot" },
              { id: "classes", label: "My Classes" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-3 text-xs font-black cursor-pointer transition-all relative"
                style={{ color: tab === t.id ? P : "#6B7280" }}>
                {t.label}
                {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: P }} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-4 py-5 pb-8">

          {/* ── CLASS DETAIL VIEW ── */}
          {activeClass && selectedClass && (
            <div className="space-y-4">
              {/* Class header card */}
              <div className="rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${selectedClass.color}, ${selectedClass.color}CC)` }}>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{selectedClass.subject}</p>
                <h2 className="font-display font-black text-lg mb-1 leading-snug">{selectedClass.topic}</h2>
                <div className="flex gap-3 mt-3">
                  {[
                    { label: "Students", value: selectedClass.students },
                    { label: "Avg Score", value: `${selectedClass.avgScore}%` },
                    { label: "SPED", value: selectedClass.spedCount },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/15 rounded-xl px-3 py-2 text-center flex-1">
                      <p className="font-display font-black text-sm">{s.value}</p>
                      <p className="text-white/60 text-[9px] font-bold uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>Materials</p>
                  <button className="text-xs font-black px-3 py-1.5 rounded-full text-white cursor-pointer" style={{ backgroundColor: P }}>+ Add</button>
                </div>
                {selectedClass.materials.map((mat, i) => (
                  <div key={i} className={cx("flex items-center gap-3 px-5 py-4", i < selectedClass.materials.length - 1 && "border-b border-border")}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0F5FB" }}>
                      <BookMarked className="w-4 h-4" style={{ color: P }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: "#2C2C2A" }}>{mat.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{mat.type}</p>
                    </div>
                    <span className="text-[9px] font-black px-2 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: mat.status === "approved" ? "#ECFDF5" : "#FEF3C7", color: mat.status === "approved" ? "#065F46" : "#92400E" }}>
                      {mat.status === "approved" ? "Live" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick AI action */}
              <div className="rounded-3xl p-5 border" style={{ backgroundColor: SURF, borderColor: `${P}25` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0"><Mascot row={0} col={1} size={40} /></div>
                  <div>
                    <p className="font-display font-black text-sm mb-1" style={{ color: P }}>Need something for this class?</p>
                    <p className="text-xs text-muted-foreground font-medium mb-3">Ask the AI Co-pilot to generate materials tailored for {selectedClass.name}.</p>
                    <button onClick={() => { setActiveClass(null); setTab("ai"); sendMessage(`Create a lesson plan for ${selectedClass.subject} — ${selectedClass.topic}`); }}
                      className="text-xs font-black px-4 py-2 rounded-xl text-white cursor-pointer" style={{ backgroundColor: P }}>
                      Generate with AI →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── OVERVIEW TAB ── */}
          {!activeClass && tab === "overview" && (
            <div className="space-y-4">
              {/* Hero summary */}
              <div className="rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${P} 0%, #7C3AED 100%)` }}>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">This Week's Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Students", value: "38", sub: "3 sections" },
                    { label: "Avg Class Score", value: "84%", sub: "+3% vs last week" },
                    { label: "SPED Students", value: "6", sub: "Dyslexia, ADHD, Autism" },
                    { label: "Materials Created", value: "12", sub: "This month" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 rounded-2xl p-3">
                      <p className="font-display font-black text-xl text-white">{s.value}</p>
                      <p className="text-white/60 text-[9px] font-bold uppercase leading-tight mt-0.5">{s.label}</p>
                      <p className="text-white/50 text-[9px] font-medium mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class performance */}
              <div className="bg-white rounded-3xl border border-border p-5">
                <p className="font-display font-black text-sm mb-4" style={{ color: "#1A1A1A" }}>Class Performance</p>
                <div className="space-y-4">
                  {TEACHER_CLASSES.map((cls, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div>
                          <span className="text-xs font-bold" style={{ color: "#2C2C2A" }}>{cls.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium ml-2">{cls.subject}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: cls.color }}>{cls.avgScore}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#F0F5FB" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cls.avgScore}%`, backgroundColor: cls.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Students needing attention */}
              <div className="bg-white rounded-3xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>Students Needing Attention</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Below 50% progress this week</p>
                </div>
                {[
                  { name: "Maria C.", section: "Sampaguita", subject: "Filipino", progress: 25 },
                  { name: "Carlo B.", section: "Luzon", subject: "Agham", progress: 38 },
                  { name: "Ana R.", section: "Visayas", subject: "Matematika", progress: 42 },
                ].map((s, i, arr) => (
                  <div key={i} className={cx("flex items-center gap-3 px-5 py-3.5", i < arr.length - 1 && "border-b border-border")}>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0" style={{ color: P }}>
                      {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: "#2C2C2A" }}>{s.name} · {s.section}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{s.subject} — {s.progress}% progress</p>
                    </div>
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F5FB" }}>
                      <div className="h-full rounded-full bg-red-400" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick action */}
              <button onClick={() => setTab("ai")}
                className="w-full rounded-3xl p-4 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity border"
                style={{ backgroundColor: SURF, borderColor: `${P}20` }}>
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0"><Mascot row={0} col={1} size={48} /></div>
                <div className="flex-1 text-left">
                  <p className="font-display font-black text-sm" style={{ color: P }}>Ask your AI Co-pilot</p>
                  <p className="text-xs text-muted-foreground font-medium">Generate lesson plans, quizzes & more instantly</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </button>
            </div>
          )}

          {/* ── AI CO-PILOT TAB ── */}
          {!activeClass && tab === "ai" && (
            <div className="flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
              {/* Intro */}
              <div className="rounded-3xl p-4 mb-4 flex items-start gap-3" style={{ backgroundColor: SURF }}>
                <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0"><Mascot row={0} col={1} size={40} /></div>
                <div>
                  <p className="font-display font-black text-sm" style={{ color: P }}>GETS AI Co-pilot</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Ask me to create lesson plans, quizzes, worksheets, rubrics — with SPED adaptations built in.</p>
                </div>
              </div>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity border"
                    style={{ backgroundColor: "#fff", borderColor: `${P}30`, color: P }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat */}
              <div className="flex-1 space-y-3 mb-4">
                {chatLog.map((msg, i) => (
                  <div key={i} className={cx("flex", msg.from === "teacher" ? "justify-end" : "justify-start")}>
                    {msg.from === "ai" && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mr-2 mt-1" style={{ backgroundColor: `${P}20` }}>
                        <Mascot row={0} col={1} size={28} />
                      </div>
                    )}
                    <div className="max-w-[78%] px-4 py-3 text-xs font-medium leading-relaxed whitespace-pre-line"
                      style={{
                        backgroundColor: msg.from === "ai" ? "#fff" : P,
                        color: msg.from === "ai" ? "#2C2C2A" : "#fff",
                        borderRadius: msg.from === "ai" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                        border: msg.from === "ai" ? "1px solid rgba(24,95,165,0.1)" : "none",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}>
                      <Markdown text={msg.text} />
                      {/* Approve / Copy actions on AI messages */}
                      {msg.from === "ai" && i > 0 && (
                        <div className="flex gap-2 mt-3 pt-2.5 border-t border-border">
                          <button className="text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer text-white" style={{ backgroundColor: "#059669" }}>
                            Use this
                          </button>
                          <button className="text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer border border-border bg-muted" style={{ color: "#4B5563" }}>
                            Refine
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden" style={{ backgroundColor: `${P}20` }}><Mascot row={0} col={1} size={28} /></div>
                    <div className="px-4 py-3 rounded-2xl bg-white border border-border flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: P, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 sticky bottom-4">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendMessage(chatInput); }}
                  placeholder={voice.listening ? "Listening… speak now" : "Ask the AI Co-pilot..."}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-medium outline-none placeholder:text-muted-foreground border border-border bg-white"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }} />
                {voice.supported && (
                  <button onClick={toggleMic} aria-label="Speak"
                    className={cx("w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer shrink-0 border transition-colors", voice.listening && "animate-pulse")}
                    style={{ borderColor: voice.listening ? "#DC2626" : `${P}40`, backgroundColor: voice.listening ? "#FEF2F2" : "#fff", color: voice.listening ? "#DC2626" : P }}>
                    <Mic className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => sendMessage(chatInput)}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: P }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── CLASSES TAB ── */}
          {!activeClass && tab === "classes" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">3 Active Sections</p>
              {TEACHER_CLASSES.map((cls) => (
                <button key={cls.id} onClick={() => setActiveClass(cls.id)}
                  className="w-full bg-white rounded-3xl border border-border p-5 text-left hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cls.color}18` }}>
                      <GraduationCap className="w-5 h-5" style={{ color: cls.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-display font-black text-sm" style={{ color: "#1A1A1A" }}>{cls.name}</p>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ backgroundColor: cls.color }}>{cls.subject}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium mb-3">{cls.topic}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground">{cls.students} students</span>
                          <span className="text-[10px] font-bold text-muted-foreground">{cls.spedCount} SPED</span>
                          <span className="text-[10px] font-bold" style={{ color: cls.color }}>{cls.avgScore}% avg</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="mt-3 w-full h-1 rounded-full" style={{ backgroundColor: "#F0F5FB" }}>
                    <div className="h-full rounded-full" style={{ width: `${cls.avgScore}%`, backgroundColor: cls.color }} />
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedLang, setSelectedLang] = useState("PH");
  const [learningStyle, setLearningStyle] = useState<LearningStyle>("Reading");
  const [learner, setLearner] = useState<LearnerProfile>({ name: "", avatar: "🙂", language: "PH", learningStyle: "Reading", mood: null });
  const [a11y, setA11y] = useState<A11ySettings>(A11Y_DEFAULTS);
  const updateA11y = (p: Partial<A11ySettings>) => setA11y(prev => ({ ...prev, ...p }));
  const [lang, setLang] = useState<Lang>("tl");
  // Malaking Teksto: scale the root font-size so rem-based text grows app-wide
  useEffect(() => {
    document.documentElement.style.fontSize = a11y.largeText ? "118.75%" : "";
    return () => { document.documentElement.style.fontSize = ""; };
  }, [a11y.largeText]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
    <A11yContext.Provider value={{ s: a11y, update: updateA11y }}>
      <style>{`
        .a11y-calm *, .a11y-calm *::before, .a11y-calm *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        .a11y-calm { filter: saturate(0.72); }
        .a11y-dyslexic, .a11y-dyslexic * { letter-spacing: 0.03em; word-spacing: 0.08em; line-height: 1.7; }
        .a11y-zen [data-distraction] { display: none !important; }
      `}</style>
      <div
        className={cx("min-h-screen bg-background font-sans", a11y.calmMode && "a11y-calm", a11y.dyslexiaFont && "a11y-dyslexic", a11y.zenMode && "a11y-zen")}
        style={{ fontFamily: a11y.dyslexiaFont ? '"Lexend", "Nunito", system-ui, sans-serif' : undefined }}
      >
      {screen === "splash" && <SplashScreen onNext={() => setScreen("roleSelect")} />}
      {screen === "roleSelect" && <RoleSelectScreen onSelect={r => { if (r === "student") setScreen("onboarding_language"); else if (r === "parent") setScreen("parentApp"); else setScreen("teacherApp"); }} />}
      {screen === "onboarding_language" && <LanguagePickScreen onNext={code => { setSelectedLang(code); setLang(codeToLang(code)); setScreen("onboarding_assessment"); }} onBack={() => setScreen("roleSelect")} />}
      {screen === "onboarding_assessment" && <AssessmentScreen onDone={style => { setLearningStyle(style); setScreen("onboarding_style_result"); }} onBack={() => setScreen("onboarding_language")} />}
      {screen === "onboarding_style_result" && <StyleResultScreen style={learningStyle} onStyleChange={setLearningStyle} onNext={() => setScreen("onboarding_profile")} onBack={() => setScreen("onboarding_assessment")} />}
      {screen === "onboarding_profile" && <ProfileCreateScreen onDone={(name, avatar) => { setLearner({ name, avatar, language: selectedLang, learningStyle, mood: null }); setScreen("mood_check"); }} onBack={() => setScreen("onboarding_style_result")} />}
      {screen === "mood_check" && <MoodCheckScreen learner={learner} onDone={mood => { setLearner(prev => ({ ...prev, mood })); setScreen("studentApp"); }} onSkip={() => setScreen("studentApp")} />}
      {screen === "studentApp" && <StudentApp learner={learner} onBack={() => setScreen("roleSelect")} />}
      {screen === "parentApp" && <ParentApp onBack={() => setScreen("roleSelect")} />}
      {screen === "teacherApp" && <TeacherApp onBack={() => setScreen("roleSelect")} />}
      </div>
    </A11yContext.Provider>
    </LangContext.Provider>
  );
}
