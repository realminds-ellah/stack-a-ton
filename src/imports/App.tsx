import React, { useState, useEffect, useRef } from "react";
import {
  Flame,
  Award,
  Sparkles,
  Settings,
  User,
  Home,
  BookOpen,
  Heart,
  Play,
  Volume2,
  ChevronRight,
  Check,
  TrendingUp,
  HelpCircle,
  Activity,
  Wifi,
  WifiOff,
  RotateCw,
  LogOut,
  Smile,
  ShieldAlert,
  Shield,
  VolumeX,
  Plus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Lock,
  Volume1,
  Menu,
  ChevronLeft,
  Eye,
  Info,
  Languages,
  X,
  Mic,
  MicOff,
  Send,
  FileText,
  Save,
  Copy,
  CheckCircle,
  UploadCloud,
  AlertCircle,
  Users,
  Sliders,
  Brain,
  GraduationCap,
  Search,
  Calculator,
  FlaskConical,
  Zap,
  Gamepad2
} from "lucide-react";
import { ScreenType, AccessibilitySettings, LearningStyle, LearnerState, Subject, QuizQuestion, Badge, LeaderboardUser } from "./types";
import { SUBJECTS, QUIZ_QUESTIONS, BADGES, LEADERBOARD, PARENT_METRICS, LESSON_AUDIO_TRANSCRIPTS } from "./data";
import { G7FilipinoGame } from "./components/G7FilipinoGame";
import { BionicText } from "./components/BionicText";

// --- Enhanced Parent Portal Child Profiles ---
export const CHILD_PROFILES = {
  "Jasmin": {
    name: "Jasmin",
    avatar: "👧",
    timeSpent: "125 mins",
    timeSpentCompare: "+15% vs last week",
    avgScore: "88%",
    avgScoreCompare: "+5% vs last week",
    streak: 12,
    effortPoints: 180,
    dailyPerformance: [
      { day: "Lun", score: 80 },
      { day: "Mar", score: 85 },
      { day: "Miy", score: 90 },
      { day: "Huw", score: 85 },
      { day: "Biy", score: 95 },
      { day: "Sab", score: 88 },
      { day: "Lin", score: 92 }
    ],
    subjects: [
      { name: "Panitikan (Literature)", progress: 85, level: "Napakahusay", topic: "Kuwentong-Bayan at Alamat", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Wika (Grammar)", progress: 70, level: "Humuhusay", topic: "Mga Pang-ugnay at Pang-abay", status: "Improving", statusTagalog: "Umuunlad" },
      { name: "Pagbasa (Reading)", progress: 90, level: "Napakahusay", topic: "Pagsusuri ng Tekstong Impormatibo", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Pagsulat (Writing)", progress: 60, level: "Nagsisimula", topic: "Pagsulat ng Talaarawan", status: "Needs help", statusTagalog: "Kailangan ng Gabay" }
    ],
    insights: [
      {
        id: "ins-1",
        title: "Pang-abay Superhero 🦸‍♂️",
        description: "Have Jasmin describe her favorite superhero using descriptive adverbs (Pang-abay na Pamaraan). Ask her, 'Paano lumipad si Juan Dalisay? Mabilis ba o dahan-dahan?'",
        category: "Wika (Grammar)"
      },
      {
        id: "ins-2",
        title: "Talaarawan ng Pamilya 📖",
        description: "Encourage Jasmin to write a brief, 3-sentence diary entry about what you did today. Focus on chronological ordering (Pang-ugnay na Panahon) like 'Una, Kasunod, at Sa huli'.",
        category: "Pagsulat (Writing)"
      }
    ],
    settings: {
      dyslexiaFont: false,
      readAloud: false,
      textHighlighting: false,
      shorterLessons: false,
      calmMode: false,
      textSize: "md" as const,
      accessibilityProfile: "none" as const,
    }
  },
  "Maria": {
    name: "Maria",
    avatar: "👧",
    timeSpent: "90 mins",
    timeSpentCompare: "+8% vs last week",
    avgScore: "76%",
    avgScoreCompare: "-2% vs last week",
    streak: 4,
    effortPoints: 95,
    dailyPerformance: [
      { day: "Lun", score: 70 },
      { day: "Mar", score: 75 },
      { day: "Miy", score: 80 },
      { day: "Huw", score: 72 },
      { day: "Biy", score: 78 },
      { day: "Sab", score: 76 },
      { day: "Lin", score: 82 }
    ],
    subjects: [
      { name: "Panitikan (Literature)", progress: 65, level: "Nagsisimula", topic: "Mga Karunungang-Bayan", status: "Needs help", statusTagalog: "Kailangan ng Gabay" },
      { name: "Wika (Grammar)", progress: 80, level: "Napakahusay", topic: "Mga Ponemang Suprasegmental", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Pagbasa (Reading)", progress: 72, level: "Humuhusay", topic: "Pag-unawa sa mga Pabula", status: "Improving", statusTagalog: "Umuunlad" },
      { name: "Pagsulat (Writing)", progress: 75, level: "Humuhusay", topic: "Pagbuo ng maikling Opinyon/Sanaysay", status: "Improving", statusTagalog: "Umuunlad" }
    ],
    insights: [
      {
        id: "ins-3",
        title: "Super Sanaysay Practice ✏️",
        description: "Let's ask Maria to write a short opinion piece (Sanaysay) about whether school uniforms are necessary. It helps build arguments using persuasive words!",
        category: "Pagsulat (Writing)"
      },
      {
        id: "ins-4",
        title: "Karunungang-Bayan Hunt 🕵️‍♀️",
        description: "Share a traditional riddle (Bugtong) or proverb (Salawikain) with Maria during lunch. Ask her to explain the deeper metaphorical meaning behind it.",
        category: "Panitikan (Literature)"
      }
    ],
    settings: {
      dyslexiaFont: true,
      readAloud: true,
      textHighlighting: false,
      shorterLessons: true,
      calmMode: true,
      textSize: "md" as const,
      accessibilityProfile: "dyslexia" as const,
    }
  },
  "Mark Joseph": {
    name: "Mark Joseph",
    avatar: "👦",
    timeSpent: "145 mins",
    timeSpentCompare: "+20% vs last week",
    avgScore: "92%",
    avgScoreCompare: "+15% vs last week",
    streak: 12,
    effortPoints: 240,
    dailyPerformance: [
      { day: "Lun", score: 90 },
      { day: "Mar", score: 92 },
      { day: "Miy", score: 95 },
      { day: "Huw", score: 91 },
      { day: "Biy", score: 96 },
      { day: "Sab", score: 94 },
      { day: "Lin", score: 98 }
    ],
    subjects: [
      { name: "Panitikan (Literature)", progress: 95, level: "Napakahusay", topic: "Epiko ng Maranao (Daraingen)", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Wika (Grammar)", progress: 88, level: "Napakahusay", topic: "Antas ng Wika (Pormal vs Balbal)", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Pagbasa (Reading)", progress: 94, level: "Napakahusay", topic: "Paghahambing ng mga Teksto", status: "Strong", statusTagalog: "Mahusay / Matatag" },
      { name: "Pagsulat (Writing)", progress: 90, level: "Napakahusay", topic: "Pagsulat ng sariling Awiting-Bayan", status: "Strong", statusTagalog: "Mahusay / Matatag" }
    ],
    insights: [
      {
        id: "ins-5",
        title: "Epic Poetry Challenge 🦚",
        description: "Mark Joseph is excelling! Challenge him to identify alliteration or write a modern 4-line stanza about nature using the rhythmic style of a traditional epiko.",
        category: "Panitikan (Literature)"
      },
      {
        id: "ins-6",
        title: "Pormal vs Balbal debate 💬",
        description: "Pick 3 slang words (Balbal) and ask Mark Joseph to translate them to formal Filipino (Pormal). Discuss together why different situations require different levels of formal speech.",
        category: "Wika (Grammar)"
      }
    ],
    settings: {
      dyslexiaFont: false,
      readAloud: false,
      textHighlighting: false,
      shorterLessons: false,
      calmMode: true,
      textSize: "lg" as const,
      accessibilityProfile: "autism" as const,
    }
  }
};

// --- Learning Style Screening Questions & Metadata ---
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    questionText: "Kapag may bago kang laruan, laro, o gadyet, ano ang una mong ginagawa?",
    subText: "When you have a new toy, game, or gadget, what is your first step?",
    options: [
      { style: "Reading" as LearningStyle, text: "Binabasa ko ang manual o direksyon.", sub: "Read the manual/directions.", icon: "📖" },
      { style: "Listening" as LearningStyle, text: "Nagtatanong ako sa nakakaalam o nakikinig sa paliwanag.", sub: "Ask someone or listen to instructions.", icon: "🎧" },
      { style: "Watching" as LearningStyle, text: "Nanonood ako ng video tutorial sa YouTube.", sub: "Watch video tutorials.", icon: "📺" },
      { style: "Solving first" as LearningStyle, text: "Sinusubukan ko kaagad laruin o kalikutin.", sub: "Try playing with it immediately.", icon: "🧩" }
    ]
  },
  {
    id: 2,
    questionText: "Paano mo mas madaling maalala ang isang magandang kwento?",
    subText: "How do you easily remember a wonderful story?",
    options: [
      { style: "Reading" as LearningStyle, text: "Kapag binabasa ko ito mismo sa libro o screen.", sub: "When reading it on a book/screen.", icon: "📖" },
      { style: "Listening" as LearningStyle, text: "Kapag isinalaysay o ibinahagi ito sa akin nang pasalita.", sub: "When someone narrates/shares it aloud.", icon: "🎧" },
      { style: "Watching" as LearningStyle, text: "Kapag may mga makukulay na larawan o video nito.", sub: "When there are colorful pictures or videos.", icon: "📺" },
      { style: "Solving first" as LearningStyle, text: "Kapag ako ay umaakto o gumagawa ng dula tungkol dito.", sub: "When roleplaying or doing activities with it.", icon: "🧩" }
    ]
  },
  {
    id: 3,
    questionText: "Kapag ikaw ay nag-aaral para sa pagsusulit, ano ang paborito mong paraan?",
    subText: "When studying for an exam, what is your preferred way?",
    options: [
      { style: "Reading" as LearningStyle, text: "Muling pagbabasa ng aking mga isinulat na notes.", sub: "Re-reading written notes.", icon: "📖" },
      { style: "Listening" as LearningStyle, text: "Pakikinig sa lecture o pakikipag-talakayan sa kaklase.", sub: "Listening to lectures or discussing with classmates.", icon: "🎧" },
      { style: "Watching" as LearningStyle, text: "Patingin sa mga diagram, tsart, at mga flashcard.", sub: "Looking at diagrams, charts, and flashcards.", icon: "📺" },
      { style: "Solving first" as LearningStyle, text: "Pagsagot agad sa mga pagsasanay o practice test.", sub: "Answering practice quizzes right away.", icon: "🧩" }
    ]
  }
];

const STYLE_DETAILS = {
  "Reading": {
    title: "Pagbabasa (Reading Learner) 📖",
    desc: "Mas mabilis kang natututo sa pamamagitan ng pagbabasa at pagsusulat ng mga salita.",
    tips: "Para sa iyo, ang aming app ay magbibigay-diin sa detalyadong teksto, visual text highlights, at nakasulat na gabay."
  },
  "Listening": {
    title: "Pakikinig (Auditory Learner) 🎧",
    desc: "Mas mabilis kang natututo sa pamamagitan ng tunog, boses, at pakikinig.",
    tips: "Gagamitin natin ang aming Voice Tutor at Read Aloud engine para bigkasin nang malakas ang bawat bahagi ng aralin."
  },
  "Watching": {
    title: "Panonood (Visual Learner) 📺",
    desc: "Mas madali mong nauunawaan ang mga aralin kapag nakakakita ng mga tsart, video, at makukulay na diagram.",
    tips: "I-aakma namin ang mga visual guide, infographics, at structured mindmaps para sa iyong mabilis na pagkatuto."
  },
  "Solving first": {
    title: "Pagsagot Agad (Kinesthetic/Active Learner) 🧩",
    desc: "Gusto mong subukan agad ang mga hamon at matuto sa pamamagitan ng trial and error.",
    tips: "Papadaliin namin ang pag-access sa mga interactive drills, laro, at interactive diagnostic exercises bago sumisid sa malalim na teorya."
  }
};

const getRecommendedStyle = (answers: LearningStyle[]): LearningStyle => {
  const counts: Record<LearningStyle, number> = {
    "Reading": 0,
    "Listening": 0,
    "Watching": 0,
    "Solving first": 0
  };
  answers.forEach(ans => {
    if (ans) {
      counts[ans] = (counts[ans] || 0) + 1;
    }
  });
  
  let recommended: LearningStyle = "Reading";
  let maxCount = -1;
  
  const styles: LearningStyle[] = ["Reading", "Listening", "Watching", "Solving first"];
  styles.forEach(style => {
    if (counts[style] > maxCount) {
      maxCount = counts[style];
      recommended = style;
    }
  });
  
  return recommended;
};

const renderTeacherContent = (text: string) => {
  if (!text) return null;
  
  const lines = text.split("\n");
  const renderedElements: any[] = [];
  
  let currentList: { items: string[]; type: "bullet" | "number" } | null = null;
  
  const parseInlineStyles = (content: string) => {
    if (!content) return "";
    // Regex matching double asterisks and single asterisks cleanly
    // For general safety, split by ** to identify bold segments
    const parts = content.split(/\*\*/g);
    return parts.map((part, idx) => {
      // Alternating index parts are inside matching **
      if (idx % 2 === 1) {
        // Double check to strip any stray single asterisks
        const cleanedBold = part.replace(/\*/g, "");
        return (
          <strong key={idx} className="font-extrabold text-[#2D3436] bg-[#FFF9E6]/50 px-0.5 rounded-sm">
            {cleanedBold}
          </strong>
        );
      }
      // Non-bold part: strip any stray single asterisks too
      const cleanedText = part.replace(/\*/g, "");
      return cleanedText;
    });
  };

  const flushList = (key: string | number) => {
    if (!currentList) return null;
    const el = currentList.type === "bullet" ? (
      <ul key={key} className="list-disc pl-5 my-2 space-y-1.5 text-xs text-slate-700 font-semibold">
        {currentList.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">{parseInlineStyles(item)}</li>
        ))}
      </ul>
    ) : (
      <ol key={key} className="list-decimal pl-5 my-2 space-y-1.5 text-xs text-slate-700 font-semibold">
        {currentList.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">{parseInlineStyles(item)}</li>
        ))}
      </ol>
    );
    currentList = null;
    return el;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    
    if (!trimmed) {
      if (currentList) {
        const el = flushList(`list-${i}`);
        if (el) renderedElements.push(el);
      }
      continue;
    }
    
    // Check if header
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      if (currentList) {
        const el = flushList(`list-${i}`);
        if (el) renderedElements.push(el);
      }
      const level = headerMatch[1].length;
      const titleText = headerMatch[2];
      
      if (level === 1) {
        renderedElements.push(
          <h1 key={`h-${i}`} className="text-sm font-display font-black text-slate-900 mt-5 mb-2 pb-1.5 border-b border-slate-100 uppercase tracking-wide flex items-center gap-1.5">
            {parseInlineStyles(titleText)}
          </h1>
        );
      } else if (level === 2) {
        renderedElements.push(
          <h2 key={`h-${i}`} className="text-xs font-display font-black text-[#2980B9] mt-4 mb-2 flex items-center gap-1.5">
            {parseInlineStyles(titleText)}
          </h2>
        );
      } else {
        renderedElements.push(
          <h3 key={`h-${i}`} className="text-[11px] font-display font-black text-[#1F618D] mt-3.5 mb-1.5 uppercase tracking-wider">
            {parseInlineStyles(titleText)}
          </h3>
        );
      }
      continue;
    }
    
    // Check if list item
    const bulletMatch = trimmed.match(/^[\*\-\+]\s+(.*)$/);
    // Also support checking for numbered list item like "1. Item" or "1) Item"
    const numberMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      if (currentList && currentList.type === "bullet") {
        currentList.items.push(itemText);
      } else {
        if (currentList) {
          const el = flushList(`list-${i}`);
          if (el) renderedElements.push(el);
        }
        currentList = { items: [itemText], type: "bullet" };
      }
      continue;
    } else if (numberMatch) {
      const itemText = numberMatch[2];
      if (currentList && currentList.type === "number") {
        currentList.items.push(itemText);
      } else {
        if (currentList) {
          const el = flushList(`list-${i}`);
          if (el) renderedElements.push(el);
        }
        currentList = { items: [itemText], type: "number" };
      }
      continue;
    }
    
    // Normal line. If we were in a list, flush it
    if (currentList) {
      const el = flushList(`list-${i}`);
      if (el) renderedElements.push(el);
    }
    
    // Check if callout container or box
    const hasCalloutIndicator = trimmed.startsWith("💡") || trimmed.startsWith("🌟") || trimmed.startsWith("🧡") || trimmed.startsWith("🚀") || trimmed.startsWith("������️") || trimmed.startsWith("📋") || trimmed.startsWith("📝") || trimmed.startsWith("✏️") || trimmed.startsWith("👨‍👩‍👧");
    
    if (hasCalloutIndicator) {
      renderedElements.push(
        <div key={`callout-${i}`} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl text-xs text-slate-800 font-semibold my-2.5 flex items-start gap-2.5 shadow-2xs">
          <span className="text-base leading-none shrink-0 mt-0.5">{trimmed.slice(0, 2)}</span>
          <div className="leading-relaxed">{parseInlineStyles(trimmed.slice(2).trim())}</div>
        </div>
      );
    } else {
      renderedElements.push(
        <p key={`p-${i}`} className="text-xs leading-relaxed font-semibold text-slate-600 mb-2.5">
          {parseInlineStyles(trimmed)}
        </p>
      );
    }
  }
  
  if (currentList) {
    const el = flushList("list-final");
    if (el) renderedElements.push(el);
  }
  
  return <div className="space-y-1 pr-1">{renderedElements}</div>;
};

// --- Custom Checkbox component matching ideal designs ---
const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
        checked
          ? "bg-[#3182CE] border-[#3182CE] text-white shadow-xs"
          : "bg-white border-slate-300 hover:border-slate-400"
      }`}
    >
      {checked && (
        <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
};

export default function App() {
  // --- Simulation State ---
  const [selectedScreen, setSelectedScreen] = useState<ScreenType>("splash");
  const [activeTab, setActiveTab] = useState<"home" | "learn" | "rewards" | "profile">("home");
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [activeSubject, setActiveSubject] = useState<Subject>(SUBJECTS[0]);
  
  // --- Role & Language Choice State ---
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "parent">("student");
  const [appLanguage, setAppLanguage] = useState<string>("tl");
  const [roleSelectStep, setRoleSelectStep] = useState<number>(1);
  const [showOtherDialects, setShowOtherDialects] = useState<boolean>(false);
  const [customDialectInput, setCustomDialectInput] = useState<string>("");
  const [teacherProfile, setTeacherProfile] = useState({
    name: "Mrs. Corazon Dela Cruz",
    school: "Rizal National High School",
    specialFocus: "Mathematics & SPED Inclusion",
  });
  const [parentProfile, setParentProfile] = useState({
    name: "Gng. Alcantara",
    childName: "Jasmin",
    relationship: "Ina / Mother",
    alertsEnabled: true,
  });
  
  // --- Student & App Core State ---
  const [learner, setLearner] = useState<LearnerState>({
    name: "Jasmin",
    avatar: "👧",
    streak: 12,
    pusoPoints: 410,
    learningStyle: null,
    moodToday: "Okay",
    completedQuests: ["q1"],
    settings: {
      dyslexiaFont: false,
      readAloud: true,
      textHighlighting: true,
      shorterLessons: false,
      calmMode: false,
      textSize: "md",
      accessibilityProfile: "none",
      bionicReading: false,
      dyslexicLetterSpacing: false,
      globalTts: false,
      ttsRate: 1,
      zenMode: false,
      literalLabels: false,
      soothingCanvas: false,
      sequentialChecklist: false,
      auditoryChimes: false,
      dopamineRewards: false,
    },
    offlineMode: false,
  });

  // Student Specific Accommodation Settings
  const [studentSettings, setStudentSettings] = useState<{
    [key: string]: AccessibilitySettings;
  }>({
    "Jasmin": { dyslexiaFont: false, readAloud: false, textHighlighting: true, shorterLessons: false, calmMode: false, textSize: "md", accessibilityProfile: "none", bionicReading: false, dyslexicLetterSpacing: false, globalTts: false, ttsRate: 1, zenMode: false, literalLabels: false, soothingCanvas: false, sequentialChecklist: false, auditoryChimes: false, dopamineRewards: false },
    "Mark Joseph": { dyslexiaFont: true, readAloud: true, textHighlighting: false, shorterLessons: true, calmMode: true, textSize: "md", accessibilityProfile: "dyslexia", bionicReading: true, dyslexicLetterSpacing: true, globalTts: true, ttsRate: 1, zenMode: false, literalLabels: false, soothingCanvas: false, sequentialChecklist: false, auditoryChimes: false, dopamineRewards: false },
    "Maria Clara": { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "lg", accessibilityProfile: "none", bionicReading: false, dyslexicLetterSpacing: false, globalTts: false, ttsRate: 1, zenMode: false, literalLabels: false, soothingCanvas: false, sequentialChecklist: false, auditoryChimes: false, dopamineRewards: false },
    "Gabriel": { dyslexiaFont: false, readAloud: false, textHighlighting: true, shorterLessons: false, calmMode: true, textSize: "lg", accessibilityProfile: "autism", bionicReading: false, dyslexicLetterSpacing: false, globalTts: false, ttsRate: 1, zenMode: true, literalLabels: true, soothingCanvas: true, sequentialChecklist: true, auditoryChimes: false, dopamineRewards: false },
  });

  // Keep Jasmin's settings in sync with teacher dashboard studentSettings state
  useEffect(() => {
    if (studentSettings["Jasmin"]) {
      setLearner(prev => ({
        ...prev,
        settings: {
          ...studentSettings["Jasmin"]
        }
      }));
    }
  }, [studentSettings["Jasmin"]]);

  // --- Learning Style Screening State ---
  const [assessmentIndex, setAssessmentIndex] = useState<number>(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<LearningStyle[]>([]);
  const [showAssessmentResult, setShowAssessmentResult] = useState<boolean>(false);

  // --- Quiz Practice State ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // --- Dynamic Lesson State ---
  const [lessonFormat, setLessonFormat] = useState<string>("text_voice");
  const [lessonLanguage, setLessonLanguage] = useState<"en" | "tl">("tl");
  const [lessonContent, setLessonContent] = useState<string>("");
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [didItLand, setDidItLand] = useState<"yes" | "no" | null>(null);
  
  // --- Audio Read Aloud Speech State ---
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeechWordIndex, setCurrentSpeechWordIndex] = useState<number>(-1);
  const [speechWords, setSpeechWords] = useState<string[]>([]);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<any>(null);

  // --- Sarimanok Egg Hatching & Pet Streak State ---
  const [sarimanokState, setSarimanokState] = useState<{
    eggBought: boolean;
    warmth: number; // 0 to 100
    hatched: boolean;
    stage: number; // 1 = Egg 🥚, 2 = Cracked Egg 🐣, 3 = Baby Sarimanok 🐥, 4 = Legendary Sarimanok 🦚
    petName: string;
    decorations: string[]; // e.g. ["Crown", "Rainbow Aura"]
  }>({
    eggBought: true,
    warmth: 30,
    hatched: false,
    stage: 1,
    petName: "Sari",
    decorations: [],
  });
  const [petMessage, setPetMessage] = useState<string>("");

  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);

  const speakText = (text: string, lang: "en" | "tl" = "tl") => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (currentlySpeakingText === text) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip Markdown or extra tags from the text
    const cleanText = text
      .replace(/[#*`_\[\]]/g, "")
      .replace(/&nbsp;/g, " ")
      .substring(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "tl" ? "es-ES" : "en-US";
    utterance.rate = learner.settings.ttsRate || 0.85;

    utterance.onend = () => {
      setCurrentlySpeakingText(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingText(null);
    };

    setCurrentlySpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  // --- ADHD Reading Ruler State ---
  const [adhdRulerY, setAdhdRulerY] = useState<number | null>(null);

  // --- GETS AI Interactive Chat & Speech Assistant State ---
  const [isGetsChatOpen, setIsGetsChatOpen] = useState(false);
  const [getsQuery, setGetsQuery] = useState("");
  const [getsChatLog, setGetsChatLog] = useState<{ sender: "user" | "gets"; text: string }[]>([
    {
      sender: "gets",
      text: "Kumusta, Jasmin! Ako si GETS, ang iyong Grade 7 MATATAG AI Companion. 🎓 Itanong mo sa akin ang kahit ano tungkol sa ating lesson, o pindutin ang 🎙️ para magsalita!"
    }
  ]);
  const [isGetsLoading, setIsGetsLoading] = useState(false);
  const [isSpeechListening, setIsSpeechListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // --- Teacher Co-pilot State ---
  const [teacherTab, setTeacherTab] = useState<"copilot" | "dashboard" | "classes">("dashboard");
  const [copilotSubTab, setCopilotSubTab] = useState<"config" | "workspace">("config");
  const [selectedDashboardStudent, setSelectedDashboardStudent] = useState<string | null>("Jasmin");
  const [teacherSubject, setTeacherSubject] = useState<string>("math");
  const [teacherAssetType, setTeacherAssetType] = useState<string>("lesson_plan");
  const [teacherGeneratedContent, setTeacherGeneratedContent] = useState<string>("");
  const [isTeacherLoading, setIsTeacherLoading] = useState<boolean>(false);
  const [isTeacherEditing, setIsTeacherEditing] = useState<boolean>(false);
  const [isEditingTeacherProfile, setIsEditingTeacherProfile] = useState<boolean>(false);
  const [isEditingParentProfile, setIsEditingParentProfile] = useState<boolean>(false);
  const [parentTab, setParentTab] = useState<"dashboard" | "audit" | "teacher" | "settings">("dashboard");
  const [selectedChildKey, setSelectedChildKey] = useState<"Jasmin" | "Maria" | "Mark Joseph">("Jasmin");
  const [customInsightSubject, setCustomInsightSubject] = useState<string>("Panitikan");
  const [customInsightTopic, setCustomInsightTopic] = useState<string>("Kuwentong-Bayan");
  const [customInsightAdvice, setCustomInsightAdvice] = useState<string>("");
  const [isGeneratingCustomInsight, setIsGeneratingCustomInsight] = useState<boolean>(false);
  const [teacherEditedText, setTeacherEditedText] = useState<string>("");
  const [teacherApproved, setTeacherApproved] = useState<boolean>(false);
  const [teacherTopic, setTeacherTopic] = useState<string>("");
  const [hasSpedStudents, setHasSpedStudents] = useState<boolean>(true);
  const [customInstruction, setCustomInstruction] = useState<string>("");

  // --- STATEFUL PARENT CONFIGURATIONS PER STUDENT (Tailored Growth Focus) ---
  const [childrenState, setChildrenState] = useState({
    "Jasmin": {
      name: "Jasmin",
      avatar: "👧",
      timeSpent: "125 mins",
      timeSpentCompare: "Self-Growth: +15% study focus vs last week",
      avgScore: "88%",
      avgScoreCompare: "Self-Accuracy: +5% improvement vs last week",
      streak: 12,
      effortPoints: 180,
      dailyPerformance: [
        { day: "Lun", score: 80 },
        { day: "Mar", score: 85 },
        { day: "Miy", score: 90 },
        { day: "Huw", score: 85 },
        { day: "Biy", score: 95 },
        { day: "Sab", score: 88 },
        { day: "Lin", score: 92 }
      ],
      subjects: [
        { name: "Panitikan (Literature)", progress: 85, level: "Napakahusay", topic: "Kuwentong-Bayan at Alamat", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Wika (Grammar)", progress: 70, level: "Humuhusay", topic: "Mga Pang-ugnay at Pang-abay", status: "Improving", statusTagalog: "Umuunlad" },
        { name: "Pagbasa (Reading)", progress: 90, level: "Napakahusay", topic: "Pagsusuri ng Tekstong Impormatibo", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Pagsulat (Writing)", progress: 60, level: "Nagsisimula", topic: "Pagsulat ng Talaarawan", status: "Needs help", statusTagalog: "Kailangan ng Gabay" }
      ],
      insights: [
        {
          id: "ins-1",
          title: "Pang-abay Superhero 🦸‍♂️",
          description: "Have Jasmin describe her favorite superhero using descriptive adverbs (Pang-abay na Pamaraan). Ask her, 'Paano lumipad si Juan Dalisay? Mabilis ba o dahan-dahan?'",
          category: "Wika (Grammar)"
        },
        {
          id: "ins-2",
          title: "Talaarawan ng Pamilya 📖",
          description: "Encourage Jasmin to write a brief, 3-sentence diary entry about what you did today. Focus on chronological ordering (Pang-ugnay na Panahon) like 'Una, Kasunod, at Sa huli'.",
          category: "Pagsulat (Writing)"
        }
      ],
      needsProfile: "adhd", // adhd, autism, dyslexia, general
      isDiagnosed: false, // true = Diagnosed, false = Support Only (Non-Diagnosed)
      studyHoursLimit: 45, // in minutes
      screenTimeLimit: 60, // in minutes
      appLockEnabled: false,
      appLockPin: "1234",
      offlineSyncEnabled: true,
      cachedLessonsCount: 18,
      controlledLanguage: "tl",
      completedBondingQuests: [] as string[],
      teacherMessages: [
        { sender: "teacher", text: "Kumusta po Gng. Alcantara! Nais ko po kayong balitaan tungkol kay Jasmin. Siya po ay naging napakahusay sa ating talakayan tungkol sa Epiko kahapon. Napaka-aktibo niya!", time: "Kahapon, 2:30 PM" },
        { sender: "parent", text: "Maraming salamat po Bb. Corazon. Paano ko pa po siya matutulungan sa bahay?", time: "Kahapon, 4:15 PM" },
        { sender: "teacher", text: "Maganda po kung magagawa ninyo ang 'Pang-abay Superhero' na bonding activity sa app. Medyo nahirapan po siya sa pagsulat ng pang-abay sa klase.", time: "Kahapon, 4:20 PM" }
      ]
    },
    "Maria": {
      name: "Maria",
      avatar: "👧",
      timeSpent: "90 mins",
      timeSpentCompare: "Self-Growth: +8% study focus vs last week",
      avgScore: "76%",
      avgScoreCompare: "Self-Accuracy: Steady progress, stable scores",
      streak: 4,
      effortPoints: 95,
      dailyPerformance: [
        { day: "Lun", score: 70 },
        { day: "Mar", score: 75 },
        { day: "Miy", score: 80 },
        { day: "Huw", score: 72 },
        { day: "Biy", score: 78 },
        { day: "Sab", score: 76 },
        { day: "Lin", score: 82 }
      ],
      subjects: [
        { name: "Panitikan (Literature)", progress: 65, level: "Nagsisimula", topic: "Mga Karunungang-Bayan", status: "Needs help", statusTagalog: "Kailangan ng Gabay" },
        { name: "Wika (Grammar)", progress: 80, level: "Napakahusay", topic: "Mga Ponemang Suprasegmental", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Pagbasa (Reading)", progress: 72, level: "Humuhusay", topic: "Pag-unawa sa mga Pabula", status: "Improving", statusTagalog: "Umuunlad" },
        { name: "Pagsulat (Writing)", progress: 75, level: "Humuhusay", topic: "Pagbuo ng maikling Opinyon/Sanaysay", status: "Improving", statusTagalog: "Umuunlad" }
      ],
      insights: [
        {
          id: "ins-3",
          title: "Super Sanaysay Practice ✏️",
          description: "Let's ask Maria to write a short opinion piece (Sanaysay) about whether school uniforms are necessary. It helps build arguments using persuasive words!",
          category: "Pagsulat (Writing)"
        },
        {
          id: "ins-4",
          title: "Karunungang-Bayan Hunt 🕵️‍♀️",
          description: "Share a traditional riddle (Bugtong) or proverb (Salawikain) with Maria during lunch. Ask her to explain the deeper metaphorical meaning behind it.",
          category: "Panitikan (Literature)"
        }
      ],
      needsProfile: "dyslexia",
      isDiagnosed: true,
      studyHoursLimit: 30,
      screenTimeLimit: 45,
      appLockEnabled: true,
      appLockPin: "0000",
      offlineSyncEnabled: true,
      cachedLessonsCount: 12,
      controlledLanguage: "ceb",
      completedBondingQuests: [] as string[],
      teacherMessages: [
        { sender: "teacher", text: "Magandang araw po! Tungkol po kay Maria, napansin ko pong medyo nahihirapan siya sa pagbasa ng mabilisang teksto. Nilagyan ko po ng Dyslexia support ang kaniyang profile.", time: "2 araw ang nakalipas" },
        { sender: "parent", text: "Salamat po teacher. Susubukan po namin ang reading highlights sa bahay.", time: "2 araw ang nakalipas" }
      ]
    },
    "Mark Joseph": {
      name: "Mark Joseph",
      avatar: "👦",
      timeSpent: "145 mins",
      timeSpentCompare: "Self-Growth: +20% study focus vs last week",
      avgScore: "92%",
      avgScoreCompare: "Self-Accuracy: +15% accuracy improvement",
      streak: 12,
      effortPoints: 240,
      dailyPerformance: [
        { day: "Lun", score: 90 },
        { day: "Mar", score: 92 },
        { day: "Miy", score: 95 },
        { day: "Huw", score: 91 },
        { day: "Biy", score: 96 },
        { day: "Sab", score: 94 },
        { day: "Lin", score: 98 }
      ],
      subjects: [
        { name: "Panitikan (Literature)", progress: 95, level: "Napakahusay", topic: "Epiko ng Maranao (Daraingen)", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Wika (Grammar)", progress: 88, level: "Napakahusay", topic: "Antas ng Wika (Pormal vs Balbal)", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Pagbasa (Reading)", progress: 94, level: "Napakahusay", topic: "Paghahambing ng mga Teksto", status: "Strong", statusTagalog: "Mahusay / Matatag" },
        { name: "Pagsulat (Writing)", progress: 90, level: "Napakahusay", topic: "Pagsulat ng sariling Awiting-Bayan", status: "Strong", statusTagalog: "Mahusay / Matatag" }
      ],
      insights: [
        {
          id: "ins-5",
          title: "Epic Poetry Challenge 🦚",
          description: "Mark Joseph is excelling! Challenge him to identify alliteration or write a modern 4-line stanza about nature using the rhythmic style of a traditional epiko.",
          category: "Panitikan (Literature)"
        },
        {
          id: "ins-6",
          title: "Pormal vs Balbal debate 💬",
          description: "Pick 3 slang words (Balbal) and ask Mark Joseph to translate them to formal Filipino (Pormal). Discuss together why different situations require different levels of formal speech.",
          category: "Wika (Grammar)"
        }
      ],
      needsProfile: "autism",
      isDiagnosed: true,
      studyHoursLimit: 60,
      screenTimeLimit: 90,
      appLockEnabled: false,
      appLockPin: "5678",
      offlineSyncEnabled: true,
      cachedLessonsCount: 24,
      controlledLanguage: "en",
      completedBondingQuests: [] as string[],
      teacherMessages: [
        { sender: "teacher", text: "Hello po! Si Mark Joseph ay napakahusay sa Geometry at Panitikan. Ang kaniyang lohika ay kamangha-mangha! Bigyan po natin siya ng higit na enrichment activities sa bahay.", time: "3 araw ang nakalipas" }
      ]
    }
  });

  const [parentPinInput, setParentPinInput] = useState("");
  const [isParentPinUnlocked, setIsParentPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [directMessageText, setDirectMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [isSyncingOffline, setIsSyncingOffline] = useState(false);

  // Synchronize student learner settings when active parent profile settings are altered
  useEffect(() => {
    const activeChildData = childrenState[selectedChildKey];
    if (activeChildData) {
      // Map needs profile to actual learner accommodation settings
      const dyslexiaVal = activeChildData.needsProfile === "dyslexia";
      const shorterLessonsVal = activeChildData.needsProfile === "adhd";
      const calmModeVal = activeChildData.needsProfile === "autism";
      
      setLearner(prev => ({
        ...prev,
        name: activeChildData.name,
        avatar: activeChildData.avatar,
        settings: {
          ...prev.settings,
          dyslexiaFont: dyslexiaVal,
          shorterLessons: shorterLessonsVal,
          calmMode: calmModeVal,
        },
        offlineMode: !activeChildData.offlineSyncEnabled
      }));

      if (activeChildData.controlledLanguage) {
        setAppLanguage(activeChildData.controlledLanguage);
        setLessonLanguage(activeChildData.controlledLanguage === "en" ? "en" : "tl");
      }
    }
  }, [childrenState, selectedChildKey]);
  

  // Class & Module Organization States
  const [teacherClasses, setTeacherClasses] = useState<Array<{ id: string; name: string; subject: string; topic: string }>>([
    { id: "7-sampaguita", name: "Grade 7 - Sampaguita", subject: "math", topic: "Polygons" },
    { id: "7-luzon", name: "Grade 7 - Luzon", subject: "science", topic: "Ecological Relationships" },
    { id: "7-visayas", name: "Grade 7 - Visayas", subject: "english", topic: "Philippine Literary Genres" }
  ]);
  const [activeClassId, setActiveClassId] = useState<string>("7-sampaguita");
  const [teacherModules, setTeacherModules] = useState<Array<{ id: string; name: string; classId: string; description: string; assets: Array<{ type: string; title: string; content: string }> }>>([
    { 
      id: "m1", 
      name: "Sapat na Geometry (Polygons)", 
      classId: "7-sampaguita", 
      description: "Lesson plans and practice worksheets focusing on regular and irregular polygons.",
      assets: [
        { type: "lesson_plan", title: "MATATAG Geometry Plan", content: "Properties of Regular and Irregular Polygons..." }
      ]
    },
    { 
      id: "m2", 
      name: "Tunay na Ecology (Interactions)", 
      classId: "7-luzon", 
      description: "Curriculum units explaining symbiotic relationships in natural ecosystems.",
      assets: []
    }
  ]);

  const [showAddClass, setShowAddClass] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassSubject, setNewClassSubject] = useState<string>("math");
  
  const [showAddModule, setShowAddModule] = useState<boolean>(false);
  const [newModuleName, setNewModuleName] = useState<string>("");
  const [newModuleDesc, setNewModuleDesc] = useState<string>("");
  const [refinementPrompt, setRefinementPrompt] = useState<string>("");

  const generateParentAdvice = async () => {
    setIsGeneratingCustomInsight(true);
    setCustomInsightAdvice("");
    try {
      const response = await fetch("/api/parent-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          childName: selectedChildKey,
          subject: "Grade 7 Filipino (" + customInsightSubject + ")",
          topic: customInsightTopic,
          progress: CHILD_PROFILES[selectedChildKey].subjects[0].progress,
          level: CHILD_PROFILES[selectedChildKey].subjects[0].level
        })
      });
      const data = await response.json();
      if (data && data.advice) {
        setCustomInsightAdvice(data.advice);
      } else {
        setCustomInsightAdvice("Magbasa ng kuwento o alamat kasama si " + selectedChildKey + " at hilingin sa kaniya na ilarawan ang mga tauhan gamit ang mga Pang-abay na Pamaraan (tulad ng mabilis, mahusay, dahan-dahan)!");
      }
    } catch (e) {
      console.error("Failed to generate parent advice:", e);
      setCustomInsightAdvice("Magbasa ng kuwento o alamat kasama si " + selectedChildKey + " at hilingin sa kaniya na ilarawan ang mga tauhan gamit ang mga Pang-abay na Pamaraan (tulad ng mabilis, mahusay, dahan-dahan)!");
    } finally {
      setIsGeneratingCustomInsight(false);
    }
  };

  const generateTeacherAsset = async (subj = teacherSubject, asset = teacherAssetType, topic = teacherTopic) => {
    setIsTeacherLoading(true);
    setTeacherApproved(false);
    setIsTeacherEditing(false);
    setCopilotSubTab("workspace");
    
    try {
      const response = await fetch("/api/teacher-copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: subj,
          assetType: asset,
          topic: topic || undefined,
          hasSpedStudents: hasSpedStudents,
          customInstruction: customInstruction || undefined
        }),
      });
      
      const data = await response.json();
      if (data && data.content) {
        setTeacherGeneratedContent(data.content);
        setTeacherEditedText(data.content);
        setCopilotSubTab("workspace");
      }
    } catch (error) {
      console.error("Error calling teacher co-pilot api:", error);
    } finally {
      setIsTeacherLoading(false);
    }
  };

  const handleRefineAsset = async () => {
    if (!refinementPrompt.trim() || !teacherGeneratedContent) return;
    setIsTeacherLoading(true);
    setTeacherApproved(false);
    setIsTeacherEditing(false);

    try {
      const compositeInstruction = `You are a curriculum assistant. Please refine the educational material based on this request: "${refinementPrompt}".
      
      Here is the current material that you must edit and improve (preserve general sections, but apply the revision perfectly):
      
      --- START CURRENT MATERIAL ---
      ${teacherGeneratedContent}
      --- END CURRENT MATERIAL ---
      
      Make sure to return only the final revised material with no extra conversational commentary, keeping the formatting clean.`;

      const response = await fetch("/api/teacher-copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: teacherSubject,
          assetType: teacherAssetType,
          topic: teacherTopic || undefined,
          hasSpedStudents: hasSpedStudents,
          customInstruction: compositeInstruction
        }),
      });

      const data = await response.json();
      if (data && data.content) {
        setTeacherGeneratedContent(data.content);
        setTeacherEditedText(data.content);
        setRefinementPrompt(""); // Clear once completed
      }
    } catch (error) {
      console.error("Error calling teacher refinement api:", error);
    } finally {
      setIsTeacherLoading(false);
    }
  };

  useEffect(() => {
    if (selectedScreen === "teacher" && !teacherGeneratedContent && !isTeacherLoading) {
      generateTeacherAsset(teacherSubject, teacherAssetType, teacherTopic);
    }
  }, [selectedScreen]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lessonLanguage === "tl" ? "fil-PH" : "en-US";

      rec.onstart = () => {
        setIsSpeechListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setGetsQuery(transcript);
          // Auto send transcribed query
          handleSendGetsQuery(transcript);
        }
      };

      rec.onend = () => {
        setIsSpeechListening(false);
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsSpeechListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setSpeechSupported(false);
    }
  }, [lessonLanguage]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert(lessonLanguage === "tl" ? "Hindi suportado ang Speech Recognition sa browser na ito. Pakitype na lang po." : "Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isSpeechListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Could not start recognition:", err);
      }
    }
  };

  const handleSendGetsQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    // Add user message to chat log
    setGetsChatLog(prev => [...prev, { sender: "user", text: trimmed }]);
    setGetsQuery("");
    setIsGetsLoading(true);

    try {
      const response = await fetch("/api/gets-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          subjectId: activeSubject.id,
          language: lessonLanguage,
          format: lessonFormat
        }),
      });

      const data = await response.json();
      const answer = data.answer || "Paumanhin, hindi ko nakuha ang sagot. Maaari mo bang ulitin?";
      
      setGetsChatLog(prev => [...prev, { sender: "gets", text: answer }]);

      // If read aloud is active, speak the tutor's response aloud!
      if (learner.settings.readAloud) {
        speakGetsAnswer(answer);
      }
    } catch (err) {
      console.error("GETS query failed:", err);
      setGetsChatLog(prev => [...prev, { sender: "gets", text: "Naku, nagkaroon tayo ng problema sa koneksyon kay GETS. Magpatuloy offline!" }]);
    } finally {
      setIsGetsLoading(false);
    }
  };

  const speakGetsAnswer = (text: string) => {
    if ('speechSynthesis' in window && !learner.offlineMode) {
      window.speechSynthesis.cancel();
      // Strip markdown
      const cleanText = text.replace(/[#*`_\[\]]/g, "").replace(/&nbsp;/g, " ").substring(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lessonLanguage === "tl" ? "es-ES" : "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Trigger first-launch lesson fetch on load or subject change ---
  useEffect(() => {
    fetchLessonContent(lessonFormat, activeSubject);
  }, [lessonFormat, activeSubject]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
    };
  }, []);

  // --- Fetch custom lesson with server Gemini support & fallbacks ---
  const fetchLessonContent = async (format: string, subject: Subject) => {
    setIsLoadingLesson(true);
    setDidItLand(null);
    stopAudioPlayback();
    try {
      const response = await fetch("/api/gets-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: subject.topic,
          format: format,
          subjectId: subject.id,
        }),
      });
      const data = await response.json();
      setLessonContent(data.content);
    } catch (err) {
      console.log("Error contacting server. Using local high-quality MATATAG lesson content.");
    } finally {
      setIsLoadingLesson(false);
    }
  };

  // --- Audio TTS Synthesizer ---
  const startAudioPlayback = () => {
    stopAudioPlayback();
    
    // Extract readable text, stripping Markdown tags
    const textToRead = lessonContent
      .replace(/[#*`_\[\]]/g, "")
      .replace(/&nbsp;/g, " ")
      .substring(0, 450); // limit for preview speech

    const words = textToRead.split(/\s+/).filter(w => w.length > 0);
    setSpeechWords(words);
    setIsPlayingAudio(true);
    setCurrentSpeechWordIndex(0);

    // If Web Speech API is supported and we're not simulated "offline"
    if ('speechSynthesis' in window && !learner.offlineMode) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      // Select Tagalog-like accent/voice if possible, or general bilingual
      utterance.lang = lessonLanguage === "tl" ? "es-ES" : "en-US"; // es-ES sounds reasonably close to Tagalog vowels for a general synthesis fallback
      utterance.rate = learner.settings.ttsRate || 0.85; // use ttsRate from accessibility settings

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          // Estimate index
          const charIndex = event.charIndex;
          const preText = textToRead.substring(0, charIndex);
          const currentWordCount = preText.split(/\s+/).filter(w => w.length > 0).length;
          setCurrentSpeechWordIndex(currentWordCount);
        }
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentSpeechWordIndex(-1);
      };

      utterance.onerror = () => {
        // Fallback to simulated animation if voice synthesis fails
        simulateAudioHighlighting(words);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Offline or Unsupported: beautiful simulated highlight for SPED demonstration
      simulateAudioHighlighting(words);
    }
  };

  const simulateAudioHighlighting = (words: string[]) => {
    let index = 0;
    const intervalMs = Math.round(380 / (learner.settings.ttsRate || 1));
    speechIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        setCurrentSpeechWordIndex(index);
        index++;
      } else {
        stopAudioPlayback();
      }
    }, intervalMs); // slow readable pace
  };

  const stopAudioPlayback = () => {
    setIsPlayingAudio(false);
    setCurrentSpeechWordIndex(-1);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }
  };

  // --- Quiz mechanics ---
  const handleAnswerSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswerIndex(index);
  };

  const submitQuizAnswer = () => {
    if (selectedAnswerIndex === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const activeQuestion = QUIZ_QUESTIONS[currentQuizIndex];
    
    // Encouragement rewards points
    let pointsAwarded = 5; // "+5 Puso Points" for effort
    if (selectedAnswerIndex === activeQuestion.correctAnswerIndex) {
      pointsAwarded = 15; // "+15 Puso Points" for correct answer
      setQuizScore(prev => prev + 1);
    }
    
    setLearner(prev => ({
      ...prev,
      pusoPoints: prev.pusoPoints + pointsAwarded
    }));
  };

  const nextQuizQuestion = () => {
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // Finished set! Let's award a completed quest
      setLearner(prev => ({
        ...prev,
        completedQuests: [...prev.completedQuests, "polygon_master_drill"]
      }));
      setSelectedScreen("rewards");
      setActiveTab("rewards");
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // --- Settings modifications ---
  const setAccessibilityProfile = (profile: "none" | "adhd" | "dyslexia" | "autism") => {
    setLearner(prev => {
      const isDyslexia = profile === "dyslexia";
      const isAdhd = profile === "adhd";
      const isAutism = profile === "autism";
      return {
        ...prev,
        settings: {
          ...prev.settings,
          accessibilityProfile: profile,
          dyslexiaFont: isDyslexia,
          shorterLessons: isAdhd,
          calmMode: isAutism,
          
          // Fine-grained updates matching profile selection
          bionicReading: isDyslexia,
          dyslexicLetterSpacing: isDyslexia,
          globalTts: isDyslexia,
          ttsRate: isDyslexia ? 1 : (prev.settings.ttsRate || 1),
          
          zenMode: isAutism,
          literalLabels: isAutism,
          soothingCanvas: isAutism,
          sequentialChecklist: isAutism,
          
          auditoryChimes: isAdhd,
          dopamineRewards: isAdhd,
        }
      };
    });
  };

  const updateSettingValue = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setLearner(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setLearner(prev => {
      const newVal = !prev.settings[key];
      let profile = prev.settings.accessibilityProfile;
      
      if (key === "dyslexiaFont") {
        profile = newVal ? "dyslexia" : "none";
      } else if (key === "shorterLessons") {
        profile = newVal ? "adhd" : "none";
      } else if (key === "calmMode") {
        profile = newVal ? "autism" : "none";
      }

      return {
        ...prev,
        settings: {
          ...prev.settings,
          [key]: newVal,
          accessibilityProfile: profile,
        }
      };
    });
  };

  const changeTextSize = (size: "sm" | "md" | "lg" | "xl") => {
    setLearner(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        textSize: size,
      }
    }));
  };

  // --- Offline simulated sync ---
  const toggleOfflineMode = () => {
    stopAudioPlayback();
    setLearner(prev => {
      const nextOffline = !prev.offlineMode;
      return {
        ...prev,
        offlineMode: nextOffline,
      };
    });
  };

  // --- Sarimanok Pet and Egg Hatchery Functions ---
  const incubateEgg = (cost: number) => {
    if (learner.pusoPoints < cost) {
      setPetMessage("Kulang ang iyong Puso Points! Mag-aral pa para maka-ipon! 💖");
      return;
    }

    setLearner(prev => ({ ...prev, pusoPoints: prev.pusoPoints - cost }));
    setSarimanokState(prev => {
      const nextWarmth = Math.min(prev.warmth + 20, 100);
      let nextStage = prev.stage;
      if (nextWarmth >= 100 && prev.stage === 1) {
        nextStage = 2; // Cracked stage!
      }
      return {
        ...prev,
        warmth: nextWarmth,
        stage: nextStage,
      };
    });
    setPetMessage("Nag-apply ng init! +20% Warmth sa mahiwagang itlog! 🔥");
    setTimeout(() => setPetMessage(""), 3000);
  };

  const hatchSarimanok = () => {
    setSarimanokState(prev => ({
      ...prev,
      hatched: true,
      stage: 3, // Baby Sarimanok!
    }));
    setPetMessage("🎉 CRACK! Napisa na ang iyong mahiwagang Sarimanok! Bigyan ito ng pangalan sa ibaba! 🌈✨");
    setLearner(prev => ({ ...prev, pusoPoints: prev.pusoPoints + 20 }));
    setTimeout(() => setPetMessage(""), 5000);
  };

  const feedSarimanok = (cost: number) => {
    if (learner.pusoPoints < cost) {
      setPetMessage("Kulang ang iyong Puso Points para bumili ng binhi para sa Sarimanok! 💖");
      return;
    }
    setLearner(prev => ({ ...prev, pusoPoints: prev.pusoPoints - cost }));
    setSarimanokState(prev => {
      const nextStage = Math.min(prev.stage + 1, 4);
      return {
        ...prev,
        stage: nextStage
      };
    });
    setPetMessage("Pinakain ang iyong Sarimanok ng mahiwagang buto! Lumaki at lumakas ito! 🌽🌈");
    setTimeout(() => setPetMessage(""), 3000);
  };

  const nameSarimanok = (name: string) => {
    setSarimanokState(prev => ({ ...prev, petName: name }));
    setPetMessage(`Pangalan ng pet pinalitan sa "${name}"! 🏷️`);
    setTimeout(() => setPetMessage(""), 3000);
  };

  // --- Accessibility-ready Class Helper ---
  const getTextSizeClass = () => {
    switch (learner.settings.textSize) {
      case "sm": return "text-sm";
      case "lg": return "text-lg";
      case "xl": return "text-xl";
      default: return "text-base";
    }
  };

  const getSubjectBentoStyles = (subjectId: string) => {
    switch (subjectId) {
      case "math":
        return {
          bg: "bg-[#FFF3E0]/70",
          border: "border-[#FFE0B2]",
          subtitle: "text-[#E65100]",
          progressBg: "bg-[#FF7F50]",
          emoji: "📐",
        };
      case "filipino":
        return {
          bg: "bg-[#E3F2FD]/70",
          border: "border-[#BBDEFB]",
          subtitle: "text-[#1565C0]",
          progressBg: "bg-[#4A90E2]",
          emoji: "✍️",
        };
      case "science":
        return {
          bg: "bg-[#E8F5E9]/70",
          border: "border-[#C8E6C9]",
          subtitle: "text-[#2E7D32]",
          progressBg: "bg-[#4CAF50]",
          emoji: "🔬",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-[#E9E7E0]",
          subtitle: "text-[#636E72]",
          progressBg: "bg-[#2D3436]",
          emoji: "📖",
        };
    }
  };

  const getHeadingSizeClass = (level: 1 | 2 | 3) => {
    const sizeOffset = learner.settings.textSize === "xl" ? "text-3xl" : learner.settings.textSize === "lg" ? "text-2xl" : "text-xl";
    if (level === 1) return `${sizeOffset} font-bold text-slate-900 leading-tight`;
    if (level === 2) return "text-lg font-semibold text-slate-800";
    return "text-sm font-medium text-slate-700";
  };

  // Custom Taglish translations helper
  const translate = (enText: string, tlText: string) => {
    if (lessonLanguage === "tl") return tlText;
    return enText;
  };

  const activeProfileClass = [
    (learner.settings.dyslexiaFont || learner.settings.accessibilityProfile === "dyslexia") ? "dyslexia-mode" : "",
    (learner.settings.dyslexicLetterSpacing || (learner.settings.accessibilityProfile === "dyslexia" && learner.settings.dyslexicLetterSpacing !== false)) ? "dyslexic-spacing" : "",
    (learner.settings.soothingCanvas || learner.settings.accessibilityProfile === "autism") ? "autism-mode" : "",
    (learner.settings.accessibilityProfile === "adhd") ? "adhd-mode" : "",
  ].filter(Boolean).join(" ");

  return (
    <div 
      onMouseMove={(e) => {
        if (learner.settings.accessibilityProfile === "adhd") {
          setAdhdRulerY(e.clientY);
        }
      }}
      className={`min-h-screen bg-[#FDFCF8] flex flex-col lg:flex-row text-[#333333] transition-all duration-300 ${activeProfileClass}`}
    >
      {/* ADHD Reading Ruler Overlay */}
      {learner.settings.accessibilityProfile === "adhd" && adhdRulerY !== null && (
        <div 
          style={{ top: adhdRulerY - 18 }} 
          className="pointer-events-none fixed left-0 right-0 h-9 bg-[#EBF8FF]/40 border-y-2 border-[#3182CE]/50 mix-blend-multiply z-50 transition-all duration-75"
        />
      )}
      
      {/* =========================================================================
          LEFT PANEL: INTERACTIVE SIMULATION ENGINE & CONTROL PANEL
          ========================================================================= */}
      <div className="hidden">
        <div>
          {/* Header Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#A8D5BA] border-2 border-white shadow-sm flex items-center justify-center text-white text-xl font-bold font-display">
              J
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg text-[#2D3436] tracking-tight">GETS Console</h1>
              <p className="text-xs text-[#636E72] font-semibold">Bilingual MATATAG Companion</p>
            </div>
          </div>

          <div className="bg-[#E8F5E9] rounded-3xl p-4.5 border border-[#C8E6C9] mb-6">
            <h2 className="text-xs font-display font-bold uppercase tracking-wider text-[#2E7D32] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              DepEd MATATAG Grade 7 Standard
            </h2>
            <p className="text-xs text-[#333333] leading-relaxed">
              Designed for low-cost Android phones in rural or offline environments. Supports diverse learners including students with **dyslexia, ADHD, and autism**.
            </p>
          </div>

          {/* Quick jump menu - EXACT requested screens list */}
          <div className="mb-6">
            <label className="block text-xs font-display font-bold text-[#636E72] uppercase tracking-wider mb-2.5">
              Select Screen to Inspect
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelectedScreen("splash"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "splash"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                🎥 Splash Screen
              </button>
              
              <button
                onClick={() => { setSelectedScreen("onboarding"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "onboarding"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                📋 Screen 2: Preference
              </button>

              <button
                onClick={() => { setSelectedScreen("home"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "home"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                🏠 Screen 1: Home
              </button>

              <button
                onClick={() => { setSelectedScreen("lesson"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "lesson"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                📖 Screen 3: Core Lesson
              </button>

              <button
                onClick={() => { setSelectedScreen("quiz"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "quiz"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                ✏️ Screen 4: Adaptive Drill
              </button>

              <button
                onClick={() => { setSelectedScreen("rewards"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "rewards"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                🏆 Screen 5: Rewards
              </button>

              <button
                onClick={() => { setSelectedScreen("settings"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "settings"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                ⚙️ Screen 6: SPED Settings
              </button>

              <button
                onClick={() => { setSelectedScreen("feelings"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "feelings"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                ❤️ Screen 7: Feelings Check
              </button>

              <button
                onClick={() => { setSelectedScreen("parent"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "parent"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                👨‍👩‍👧 Screen 8: Parent Summary
              </button>

              <button
                onClick={() => { setSelectedScreen("offline"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedScreen === "offline"
                    ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                📴 Offline Status
              </button>

              <button
                onClick={() => { setSelectedScreen("teacher"); }}
                className={`py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer col-span-2 ${
                  selectedScreen === "teacher"
                    ? "bg-[#2980B9] border-[#2980B9] text-white shadow-xs"
                    : "bg-white hover:bg-[#FDFCF8] text-[#333333] border-[#E9E7E0]"
                }`}
              >
                👩‍🏫 Screen 10: Teacher Co-pilot
              </button>
            </div>
          </div>

          {/* Quick simulation controls */}
          <div className="mb-6 space-y-4 border-t border-[#E9E7E0] pt-5">
            <h3 className="text-xs font-display font-bold text-[#636E72] uppercase tracking-wider">
              Simulation Hardware Deck
            </h3>

            {/* Offline Simulator Switch */}
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#E9E7E0]">
              <div className="flex items-center gap-2">
                {learner.offlineMode ? (
                  <WifiOff className="w-5 h-5 text-rose-500" />
                ) : (
                  <Wifi className="w-5 h-5 text-emerald-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#2D3436]">Simulate Offline Mode</div>
                  <div className="text-[10px] text-[#636E72] font-medium">
                    {learner.offlineMode ? "Offline (Local queues active)" : "Connected to DepEd Server"}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleOfflineMode}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  learner.offlineMode ? "bg-[#FF7F50] justify-end" : "bg-emerald-500 justify-start"
                }`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Simulated telemetry logger */}
            <div className="bg-[#2D3436] text-white font-mono text-[10px] rounded-2xl p-3.5 shadow-inner">
              <div className="text-[#FF7F50] font-semibold mb-1 font-display">=== GETS STATUS LOG ===</div>
              <div>⚡ Network: {learner.offlineMode ? "OFFLINE - Local Storage Active" : "ONLINE - Sync Completed"}</div>
              <div>🎮 Active Student: {learner.name} (Grade 7)</div>
              <div>💖 Puso Points: {learner.pusoPoints} pts</div>
              <div>📖 Learning Style: {learner.learningStyle || "Not Set"}</div>
              <div>⚙️ OpenDyslexic: {learner.settings.dyslexiaFont ? "ENABLED (ComicFallback)" : "DISABLED"}</div>
              <div>🛡️ Autism Calm Mode: {learner.settings.calmMode ? "ACTIVE (No clutter)" : "INACTIVE"}</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-[#636E72] border-t border-[#E9E7E0] pt-3 font-medium">
          MATATAG Curriculum compliant. Offline Queue synchronizer V1.2. Developed for budget mobile hardware.
        </div>
      </div>

      {/* =========================================================================
          RIGHT MAIN STAGE: THE ANDROID PHONE SIMULATOR FRAME
          ========================================================================= */}
      <div className="flex-1 p-4 lg:p-8 flex items-center justify-center bg-[#FDFCF8] relative overflow-hidden">
        {/* Soft floating background design tokens */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#E1F5FE]/35 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#FFF3E0]/35 blur-3xl" />

        {/* PHYSICAL-LIKE SMARTPHONE CHASSIS */}
        <div className="relative w-full max-w-[390px] h-[780px] rounded-[52px] bg-[#2D3436] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-4 border-[#333333] flex flex-col justify-between overflow-hidden">
          
          {/* CAMERA NOTCH & SPEAKER GRILL */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-[#2D3436] rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-[#333333] rounded-full mb-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333333] ml-2 mb-1" />
          </div>

          {/* INTERNAL SCREEN CONTAINER */}
          <div className="w-full h-full bg-[#FDFCF8] rounded-[38px] overflow-hidden flex flex-col justify-between relative text-[#333333]">
            
            {/* 1. MOCK PHONE STATUS BAR */}
            <div className="h-10 bg-white border-b border-[#E9E7E0] px-6 pt-3 flex justify-between items-center text-[11px] font-bold text-[#636E72] select-none z-30 shrink-0">
              <span className="tracking-tight text-[#2D3436]">10:15 AM</span>
              <div className="flex items-center gap-1.5">
                {learner.offlineMode ? (
                  <button
                    onClick={toggleOfflineMode}
                    title="Simulate online"
                    className="flex items-center gap-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-colors"
                  >
                    <WifiOff className="w-3 h-3" /> OFFLINE
                  </button>
                ) : (
                  <button
                    onClick={toggleOfflineMode}
                    title="Simulate offline"
                    className="flex items-center gap-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-colors"
                  >
                    <Wifi className="w-3 h-3" /> ONLINE
                  </button>
                )}
                <span className="text-[#E67E22]">🔥 12d Streak</span>
                <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-[1px] flex items-center">
                  <div className="h-full w-4/5 bg-slate-500 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* 1.5. ACTIVE MODE HEADER (No multi-role leaks for students) */}
            {selectedScreen !== "splash" && selectedScreen !== "role_select" && (
              <div className="bg-white border-b border-[#E9E7E0] px-4 py-2.5 flex justify-between items-center shrink-0 select-none z-30">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    selectedRole === "student" ? "bg-[#FF7F50]" :
                    selectedRole === "teacher" ? "bg-[#2980B9]" : "bg-[#2ECC71]"
                  }`} />
                  <span className="text-[10px] font-display font-black text-[#2D3436] uppercase tracking-wider">
                    {selectedRole === "student" && "Mag-aaral 🧑‍🎓"}
                    {selectedRole === "teacher" && "Guro 👩‍🏫"}
                    {selectedRole === "parent" && "Magulang 👨‍👩‍👧"}
                  </span>
                </div>
              </div>
            )}

            {/* 2. MAIN APPLICATION CONTENT - DYNAMIC VIEWS */}
            <div className="flex-1 overflow-y-auto relative p-5">
              
              {/* ==========================================
                  SPLASH / LOADING SCREEN
                  ========================================== */}
              {selectedScreen === "splash" && (
                <div className="h-full flex flex-col justify-between py-12 items-center text-center">
                  <div />
                  <div className="space-y-4">
                    {/* Glowing Mascot Logo */}
                    <div className="w-24 h-24 rounded-[32px] bg-[#A8D5BA] mx-auto flex items-center justify-center text-white text-5xl font-extrabold shadow-md border-4 border-white animate-soft-pulse">
                      G
                    </div>
                    <div>
                      <h1 className="text-3xl font-display font-black text-[#2D3436] tracking-tight">GETS</h1>
                      <p className="text-sm font-semibold text-[#636E72] mt-1">Guided Education for Tailored Success</p>
                    </div>
                    <div className="inline-block bg-[#E8F5E9] px-4 py-1.5 rounded-full border border-[#C8E6C9] text-xs font-semibold text-[#2E7D32]">
                      Filipino Learning Companion
                    </div>
                  </div>

                  <div className="w-full max-w-[250px] space-y-4">
                    <p className="text-[11px] text-[#636E72] font-medium italic">"Every learner gets the support they need."</p>

                    <button
                      onClick={() => {
                        setSelectedScreen("role_select");
                      }}
                      className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-sm text-xs transition-colors cursor-pointer"
                    >
                      Magsimula
                    </button>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SCREEN 1.5: ROLE & LANGUAGE SELECTION (STARTUP CONFIG - 1 PAGE PER ASK)
                  ========================================== */}
              {selectedScreen === "role_select" && (
                <div className="space-y-5 animate-fade-in py-1">
                  
                  {/* Step Progress Bar */}
                  <div className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-wider text-[#FF7F50]">
                    <span>Hakbang {roleSelectStep} ng 3</span>
                    <div className="flex-1 h-1.5 bg-[#E9E7E0] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF7F50] transition-all duration-300" 
                        style={{ width: `${(roleSelectStep / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* STEP 1: SELECT YOUR ROLE */}
                  {roleSelectStep === 1 && (
                    <div className="space-y-6 animate-fade-in py-3 flex flex-col justify-between min-h-[460px]">
                      <div className="text-center space-y-2">
                        <h1 className="text-2xl font-display font-black text-[#0F172A] tracking-tight">
                          Who is using the app?
                        </h1>
                        <p className="text-xs font-semibold text-[#64748B] max-w-[280px] mx-auto leading-relaxed">
                          Select your role to personalize the experience
                        </p>
                      </div>

                      <div className="space-y-3 px-1">
                        {/* Student Card */}
                        <button
                          onClick={() => {
                            setSelectedRole("student");
                            setRoleSelectStep(2);
                          }}
                          className={`w-full p-4 text-left rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 bg-white ${
                            selectedRole === "student"
                              ? "border-[#10B981] shadow-xs ring-2 ring-[#10B981]/10"
                              : "border-[#E2E8F0] hover:border-[#10B981]/40 shadow-3xs"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full bg-[#E6F4EA] text-[#10B981] flex items-center justify-center shrink-0">
                            <User className="w-5.5 h-5.5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-display font-black text-[#0F172A]">
                              Student
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-0.5 font-semibold">
                              Learn and play activities
                            </p>
                          </div>
                        </button>

                        {/* Parent Card */}
                        <button
                          onClick={() => {
                            setSelectedRole("parent");
                            setRoleSelectStep(2);
                          }}
                          className={`w-full p-4 text-left rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 bg-white ${
                            selectedRole === "parent"
                              ? "border-[#F59E0B] shadow-xs ring-2 ring-[#F59E0B]/10"
                              : "border-[#E2E8F0] hover:border-[#F59E0B]/40 shadow-3xs"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center shrink-0">
                            <Users className="w-5.5 h-5.5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-display font-black text-[#0F172A]">
                              Parent
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-0.5 font-semibold">
                              Track progress and manage settings
                            </p>
                          </div>
                        </button>

                        {/* Teacher Card */}
                        <button
                          onClick={() => {
                            setSelectedRole("teacher");
                            setRoleSelectStep(2);
                          }}
                          className={`w-full p-4 text-left rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 bg-white ${
                            selectedRole === "teacher"
                              ? "border-[#6366F1] shadow-xs ring-2 ring-[#6366F1]/10"
                              : "border-[#E2E8F0] hover:border-[#6366F1]/40 shadow-3xs"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full bg-[#E0E7FF] text-[#6366F1] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5.5 h-5.5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-display font-black text-[#0F172A]">
                              Teacher
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-0.5 font-semibold">
                              Manage classes and assignments
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Back Link at the bottom */}
                      <div className="text-center pt-2">
                        <button
                          onClick={() => {
                            setSelectedScreen("splash");
                          }}
                          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SELECT YOUR MOTHER TONGUE / DIALECT */}
                  {roleSelectStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center space-y-1 bg-white/60 p-4 rounded-3xl border border-[#E9E7E0] shadow-3xs">
                        <span className="text-[10px] font-display font-black text-[#FF7F50] uppercase tracking-wider block">
                          Hakbang 2: Wika at Diyalekto
                        </span>
                        <h2 className="text-base font-display font-black text-[#2D3436]">
                          Piliin ang Iyong Wika
                        </h2>
                        <p className="text-[10px] font-semibold text-[#636E72]">
                          We support Philippine regional mother tongues and dialects.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: "tl", flag: "🇵🇭", name: "Taglish / Filipino" },
                          { code: "en", flag: "🇬🇧", name: "English" },
                          { code: "ceb", flag: "🌴", name: "Bisaya (Cebuano)" },
                          { code: "ilo", flag: "🌾", name: "Ilocano" },
                          { code: "hil", flag: "⛵", name: "Hiligaynon" },
                          { code: "bik", flag: "🌶️", name: "Bicolano" },
                          { code: "war", flag: "🐟", name: "Waray-Waray" },
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setAppLanguage(lang.code);
                              setLessonLanguage(lang.code === "en" ? "en" : "tl");
                              setShowOtherDialects(false);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-[11px] font-display font-black transition-all cursor-pointer flex items-center gap-2 ${
                              appLanguage === lang.code && !showOtherDialects
                                ? "border-[#FF7F50] bg-[#FFF3E0]/30 text-[#FF7F50] shadow-2xs"
                                : "border-[#E9E7E0] bg-white text-[#2D3436] hover:border-[#FF7F50]/30"
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="truncate">{lang.name}</span>
                          </button>
                        ))}

                        {/* Others / Iba pa Button */}
                        <button
                          onClick={() => {
                            setShowOtherDialects(true);
                            if (customDialectInput) {
                              setAppLanguage(customDialectInput.toLowerCase());
                            } else {
                              setAppLanguage("oth");
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left text-[11px] font-display font-black transition-all cursor-pointer flex items-center gap-2 ${
                            showOtherDialects
                              ? "border-[#FF7F50] bg-[#FFF3E0]/30 text-[#FF7F50] shadow-2xs"
                              : "border-[#E9E7E0] bg-white text-[#2D3436] hover:border-[#FF7F50]/30"
                          }`}
                        >
                          <span className="text-lg">✨</span>
                          <span className="truncate">Iba pa</span>
                        </button>
                      </div>

                      {/* Dropdown for Other regional dialects */}
                      {showOtherDialects && (
                        <div className="p-3 bg-[#FAF9F5] border border-[#E9E7E0] rounded-2xl space-y-2.5 animate-fade-in">
                          <label className="block text-[9px] font-display font-black text-[#636E72] uppercase tracking-wider">
                            Piliin ang diyalekto:
                          </label>
                          <select
                            value={customDialectInput}
                            onChange={(e) => {
                              const selectedVal = e.target.value;
                              setCustomDialectInput(selectedVal);
                              setAppLanguage(selectedVal.toLowerCase());
                            }}
                            className="w-full p-2 text-xs rounded-lg border border-[#E9E7E0] bg-white font-semibold text-[#2D3436] focus:outline-none focus:border-[#FF7F50]"
                          >
                            <option value="">-- Piliin ang Wika --</option>
                            <option value="pam">Kapampangan (pampanga)</option>
                            <option value="pag">Pangasinense (pangasinan)</option>
                            <option value="cbk">Chavacano (zamboanga)</option>
                            <option value="mrw">Maranao (lanao)</option>
                            <option value="tsg">Tausug (sulu)</option>
                            <option value="mdh">Maguindanaon</option>
                            <option value="krj">Kinaray-a (antique)</option>
                            <option value="ivt">Ivatan (batanes)</option>
                            <option value="sur">Surigaonon</option>
                          </select>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[9px] text-[#636E72] font-semibold">O i-type ang sariling wika:</span>
                            <input
                              type="text"
                              placeholder="Hal: Masbatenyo"
                              value={customDialectInput && !["pam","pag","cbk","mrw","tsg","mdh","krj","ivt","sur"].includes(customDialectInput) ? customDialectInput : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomDialectInput(val);
                                if (val) {
                                  setAppLanguage(val.toLowerCase());
                                }
                              }}
                              className="flex-1 p-1 px-2 text-xs rounded-lg border border-[#E9E7E0] bg-white font-semibold focus:outline-none focus:border-[#FF7F50]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Interactive Localized Welcome Card */}
                      <div className="p-3.5 bg-[#FFF9F2] border-2 border-[#FFE0B2] rounded-2xl text-center space-y-1.5 shadow-2xs">
                        <div className="text-xl">
                          {appLanguage === "tl" && "🇵🇭"}
                          {appLanguage === "en" && "🇬🇧"}
                          {appLanguage === "ceb" && "🌴"}
                          {appLanguage === "ilo" && "🌾"}
                          {appLanguage === "hil" && "⛵"}
                          {appLanguage === "bik" && "🌶️"}
                          {appLanguage === "war" && "🐟"}
                          {!["tl","en","ceb","ilo","hil","bik","war"].includes(appLanguage) && "✨"}
                        </div>
                        <div className="text-[11px] font-display font-black text-[#D35400] tracking-tight">
                          {appLanguage === "tl" && "Kumusta! Handa ka na bang mag-aral?"}
                          {appLanguage === "en" && "Hello! Ready to start learning with GETS?"}
                          {appLanguage === "ceb" && "Maayong adlaw! Andam na ba ka makat-on uban sa GETS?"}
                          {appLanguage === "ilo" && "Naimbag nga adlaw! Nakasaganaka kadin nga agadal kabsat?"}
                          {appLanguage === "hil" && "Maayong adlaw! Handa ka na bala magtuon upod sa GETS?"}
                          {appLanguage === "bik" && "Marhay na aldaw! Handa ka na ba mag-adal kaiba an GETS?"}
                          {appLanguage === "war" && "Maupay nga adlaw! Handa ka na ba mag-aram kaupod an GETS?"}
                          {appLanguage === "pam" && "Mayap a abak! Handa na ka nang magaral?"}
                          {appLanguage === "pag" && "Maong ya agew! Akaparaan ka la ran man-aral?"}
                          {appLanguage === "cbk" && "Buenas dias! Listo ya ba tu de prende con amon?"}
                          {appLanguage === "mrw" && "Kombusta! Handa ka na ba mag-skela?"}
                          {appLanguage === "tsg" && "Maunu-unu kaw! Handa na kaw mag-adji sa baha-baha?"}
                          {appLanguage === "mdh" && "Kumusta! Handa ka den mag-skela?"}
                          {!["tl","en","ceb","ilo","hil","bik","war","pam","pag","cbk","mrw","tsg","mdh"].includes(appLanguage) && "Kumusta! Handa ka na bang mag-aral gamit ang iyong sariling wika?"}
                        </div>
                        <p className="text-[9px] text-[#7F8C8D] font-semibold uppercase tracking-wider">
                          Greeting in: {
                            appLanguage === "tl" ? "Taglish / Filipino" :
                            appLanguage === "en" ? "English" :
                            appLanguage === "ceb" ? "Cebuano / Bisaya" :
                            appLanguage === "ilo" ? "Ilocano" :
                            appLanguage === "hil" ? "Hiligaynon" :
                            appLanguage === "bik" ? "Bicolano" :
                            appLanguage === "war" ? "Waray-Waray" :
                            appLanguage === "pam" ? "Kapampangan" :
                            appLanguage === "pag" ? "Pangasinense" :
                            appLanguage === "cbk" ? "Chavacano" :
                            appLanguage === "mrw" ? "Maranao" :
                            appLanguage === "tsg" ? "Tausug" :
                            appLanguage === "mdh" ? "Maguindanaon" :
                            customDialectInput ? customDialectInput : "Other Mother Tongue"
                          }
                        </p>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex gap-2.5 pt-1">
                        <button
                          onClick={() => {
                            setRoleSelectStep(1);
                          }}
                          className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl transition-all cursor-pointer text-xs border border-[#E9E7E0] flex items-center justify-center gap-1.5 uppercase tracking-wider"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Bumalik</span>
                        </button>

                        <button
                          onClick={() => {
                            setRoleSelectStep(3);
                          }}
                          className="flex-[1.5] bg-[#FF7F50] hover:bg-[#e2693c] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-sm text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider animate-soft-pulse"
                        >
                          <span>Sumunod</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: INTERACTIVE PROFILE CREATION FOR THE SELECTED ROLE */}
                  {roleSelectStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center space-y-1 bg-white/60 p-4 rounded-3xl border border-[#E9E7E0] shadow-3xs">
                        <span className="text-[10px] font-display font-black text-[#FF7F50] uppercase tracking-wider block">
                          Hakbang 3: Gumawa ng Profile
                        </span>
                        <h2 className="text-base font-display font-black text-[#2D3436]">
                          {selectedRole === "student" && "Profile ng Mag-aaral"}
                          {selectedRole === "teacher" && "Profile ng Guro"}
                          {selectedRole === "parent" && "Profile ng Magulang"}
                        </h2>
                        <p className="text-[10px] font-semibold text-[#636E72]">
                          Fill up your profile to customize GETS specifically for you.
                        </p>
                      </div>

                      {selectedRole === "student" && (
                        <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs">
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Pangalan ng Mag-aaral:
                            </label>
                            <input
                              type="text"
                              value={learner.name}
                              onChange={(e) => setLearner(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#FF7F50] text-[#2D3436]"
                              placeholder="Hal: Jasmin"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Piliin ang Learning Style Preference:
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {(["Reading", "Listening", "Watching", "Solving first"] as LearningStyle[]).map((style) => (
                                <button
                                  key={style}
                                  onClick={() => setLearner(prev => ({ ...prev, learningStyle: style }))}
                                  className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold text-center cursor-pointer transition-all flex flex-col justify-center items-center gap-1 ${
                                    learner.learningStyle === style
                                      ? "bg-[#FFF3E0] border-[#FF7F50] text-[#FF7F50] shadow-2xs"
                                      : "bg-white border-[#E9E7E0] text-slate-700 hover:border-[#FF7F50]/40"
                                  }`}
                                >
                                  <span>
                                    {style === "Reading" && "📝 Magbasa"}
                                    {style === "Listening" && "🔊 Makinig"}
                                    {style === "Watching" && "👀 Manood"}
                                    {style === "Solving first" && "🧮 Mag-solve"}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedRole === "teacher" && (
                        <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs">
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Pangalan ng Guro:
                            </label>
                            <input
                              type="text"
                              value={teacherProfile.name}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                              placeholder="Hal: Bb. Santos o Corazon Dela Cruz"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Pangalan ng Paaralan:
                            </label>
                            <input
                              type="text"
                              value={teacherProfile.school}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, school: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                              placeholder="Hal: Rizal National High School"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Grade Level & SPED Specialization Focus:
                            </label>
                            <select
                              value={teacherProfile.specialFocus}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, specialFocus: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold p-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                            >
                              <option value="Mathematics & SPED Inclusion">Grade 7 Mathematics & SPED Inclusion</option>
                              <option value="General Science & Inclusive Learning">Grade 7 General Science & Inclusive Learning</option>
                              <option value="English Literature & Speech Supports">Grade 7 English Literature & Speech Supports</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {selectedRole === "parent" && (
                        <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs">
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Pangalan ng Magulang:
                            </label>
                            <input
                              type="text"
                              value={parentProfile.name}
                              onChange={(e) => setParentProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2ECC71] text-[#2D3436]"
                              placeholder="Hal: Gng. Dela Cruz"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Pangalan ng Anak:
                            </label>
                            <input
                              type="text"
                              value={parentProfile.childName}
                              onChange={(e) => setParentProfile(prev => ({ ...prev, childName: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2ECC71] text-[#2D3436]"
                              placeholder="Hal: Jasmin"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              Relasyon sa Bata:
                            </label>
                            <input
                              type="text"
                              value={parentProfile.relationship}
                              onChange={(e) => setParentProfile(prev => ({ ...prev, relationship: e.target.value }))}
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2ECC71] text-[#2D3436]"
                              placeholder="Hal: Ina"
                            />
                          </div>
                        </div>
                      )}

                      {/* Navigation and Save Buttons */}
                      <div className="flex gap-2.5 pt-1">
                        <button
                          onClick={() => {
                            setRoleSelectStep(2);
                          }}
                          className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-2xl transition-all cursor-pointer text-xs border border-[#E9E7E0] flex items-center justify-center gap-1.5 uppercase tracking-wider"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Bumalik</span>
                        </button>

                        <button
                          onClick={() => {
                            // Set selectedRole first so correct layout renders
                            setSelectedRole(selectedRole);
                            if (selectedRole === "student") {
                              setSelectedScreen("onboarding");
                              setOnboardingStep(1);
                              setAssessmentIndex(0);
                              setShowAssessmentResult(false);
                            } else if (selectedRole === "teacher") {
                              setSelectedScreen("teacher");
                            } else if (selectedRole === "parent") {
                              setSelectedScreen("parent");
                            }
                          }}
                          className={`flex-[1.5] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-sm text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                            selectedRole === "student" ? "bg-[#FF7F50] hover:bg-[#e2693c]" :
                            selectedRole === "teacher" ? "bg-[#2980B9] hover:bg-[#1F618D]" : "bg-[#2ECC71] hover:bg-[#27AE60]"
                          }`}
                        >
                          <span>I-save at Magpatuloy</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ==========================================
                  SCREEN 2: FIRST-LAUNCH PREFERENCE & PROFILE SETUP (2 STEPS)
                  ========================================== */}
              {selectedScreen === "onboarding" && (
                <div className="space-y-5">
                  {/* Step Progress Bar */}
                  <div className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-wider text-[#FF7F50]">
                    <span>Step {onboardingStep} of 2</span>
                    <div className="flex-1 h-2 bg-[#E9E7E0] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF7F50] transition-all duration-300" 
                        style={{ width: `${(onboardingStep / 2) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* STEP 1: PREFERENCE & LEARNING STYLE SCREENING */}
                  {onboardingStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      {!showAssessmentResult ? (
                        <>
                          <div className="flex justify-between items-center bg-white/60 p-3 rounded-2xl border border-[#E9E7E0] shadow-3xs">
                            <div>
                              <span className="text-[10px] font-display font-black text-[#FF7F50] uppercase tracking-wider block">
                                Pagsusuri ng Istilo
                              </span>
                              <h3 className="text-xs font-display font-black text-[#2D3436]">
                                Tanong {assessmentIndex + 1} ng 3
                              </h3>
                            </div>
                            <div className="flex gap-1">
                              {[0, 1, 2].map((idx) => (
                                <div
                                  key={idx}
                                  className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                                    idx === assessmentIndex
                                      ? "bg-[#FF7F50] w-8"
                                      : idx < assessmentIndex
                                      ? "bg-[#2E7D32]"
                                      : "bg-[#E9E7E0]"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Question Card */}
                          <div className="bg-white p-5 rounded-3xl border border-[#E9E7E0] shadow-3xs space-y-3.5">
                            <div>
                              <h2 className="text-base font-display font-extrabold text-[#2D3436] leading-snug">
                                {ASSESSMENT_QUESTIONS[assessmentIndex].questionText}
                              </h2>
                              <p className="text-[11px] font-semibold text-[#636E72] mt-0.5">
                                {ASSESSMENT_QUESTIONS[assessmentIndex].subText}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                              {ASSESSMENT_QUESTIONS[assessmentIndex].options.map((option, opIdx) => (
                                <button
                                  key={opIdx}
                                  onClick={() => {
                                    const newAnswers = [...assessmentAnswers];
                                    newAnswers[assessmentIndex] = option.style;
                                    setAssessmentAnswers(newAnswers);
                                    
                                    if (assessmentIndex < 2) {
                                      setAssessmentIndex(prev => prev + 1);
                                    } else {
                                      // Final question answered! Calculate recommended style
                                      const recStyle = getRecommendedStyle(newAnswers);
                                      setLearner(prev => ({ ...prev, learningStyle: recStyle }));
                                      setShowAssessmentResult(true);
                                    }
                                  }}
                                  className="p-3.5 text-left rounded-2xl border-2 border-[#E9E7E0] hover:border-[#FF7F50]/60 hover:bg-[#FFF3E0]/10 bg-white text-[#333333] transition-all cursor-pointer active:scale-[0.98] group flex items-start gap-3"
                                >
                                  <div className="p-2.5 bg-slate-50 rounded-xl border border-[#E9E7E0] group-hover:border-[#FF7F50]/30 transition-all flex-shrink-0 text-[#636E72] group-hover:text-[#FF7F50]">
                                    {option.icon === "📖" && <BookOpen className="w-5 h-5" />}
                                    {option.icon === "🎧" && <Volume2 className="w-5 h-5" />}
                                    {option.icon === "📺" && <Eye className="w-5 h-5" />}
                                    {option.icon === "🧩" && <Brain className="w-5 h-5" />}
                                  </div>
                                  <div className="pt-0.5">
                                    <div className="text-xs font-display font-bold text-[#2D3436] group-hover:text-[#FF7F50] transition-colors">
                                      {option.text}
                                    </div>
                                    <div className="text-[10px] text-[#636E72] mt-0.5 font-medium">
                                      {option.sub}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Navigation */}
                          {assessmentIndex > 0 && (
                            <button
                              onClick={() => setAssessmentIndex(prev => prev - 1)}
                              className="w-full bg-white hover:bg-[#FDFCF8] border border-[#E9E7E0] text-[#636E72] font-bold py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" /> Bumalik sa nakaraang tanong
                            </button>
                          )}
                        </>
                      ) : (
                        /* Result view */
                        <div className="space-y-4.5 animate-fade-in">
                          <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-4 rounded-3xl text-center space-y-1">
                            <span className="text-[10px] font-display font-black text-[#2E7D32] uppercase tracking-wider block">
                              Pagsusuri Kumpleto! / Screening Done! 🎉
                            </span>
                            <h2 className="text-sm font-display font-black text-[#2D3436]">
                              Natukoy na namin ang iyong Estilo ng Pagkatuto!
                            </h2>
                          </div>

                          {/* Recommended style detail card */}
                          <div className="bg-white p-5 rounded-3xl border border-[#E9E7E0] shadow-3xs text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-[#FFF3E0] border border-[#FFE0B2] mx-auto flex items-center justify-center text-4xl shadow-3xs">
                              {learner.learningStyle === "Reading" && "📖"}
                              {learner.learningStyle === "Listening" && "🎧"}
                              {learner.learningStyle === "Watching" && "📺"}
                              {learner.learningStyle === "Solving first" && "🧩"}
                            </div>

                            <div className="space-y-1.5">
                              <span className="bg-[#FF7F50] text-white text-[10px] font-display font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                Rekomendadong Istilo
                              </span>
                              <h3 className="text-lg font-display font-black text-[#2D3436] pt-1">
                                {learner.learningStyle && STYLE_DETAILS[learner.learningStyle as keyof typeof STYLE_DETAILS].title}
                              </h3>
                              <p className="text-xs font-semibold text-[#636E72] px-2 leading-relaxed">
                                {learner.learningStyle && STYLE_DETAILS[learner.learningStyle as keyof typeof STYLE_DETAILS].desc}
                              </p>
                            </div>

                            <div className="bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E9E7E0] text-left text-xs space-y-1 text-[#2D3436]">
                              <span className="font-display font-black text-[#2E7D32] block">Paano ito makakatulong sa iyo:</span>
                              <p className="text-[11px] font-medium text-[#636E72] leading-snug">
                                {learner.learningStyle && STYLE_DETAILS[learner.learningStyle as keyof typeof STYLE_DETAILS].tips}
                              </p>
                            </div>
                          </div>

                          {/* Option to change manually or accept */}
                          <div className="space-y-2 bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-3xs">
                            <label className="block text-[10px] font-display font-black text-[#636E72] uppercase tracking-wider text-center">
                              Gusto mo ba ng ibang istilo? Piliin dito:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { style: "Reading" as LearningStyle, label: "Reading 📖" },
                                { style: "Listening" as LearningStyle, label: "Listening 🎧" },
                                { style: "Watching" as LearningStyle, label: "Watching 📺" },
                                { style: "Solving first" as LearningStyle, label: "Solving 🧩" }
                              ].map((item) => (
                                <button
                                  key={item.style}
                                  onClick={() => setLearner(prev => ({ ...prev, learningStyle: item.style }))}
                                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-display font-black text-center transition-all cursor-pointer ${
                                    learner.learningStyle === item.style
                                      ? "border-[#FF7F50] bg-[#FFF3E0]/40 text-[#FF7F50]"
                                      : "border-[#E9E7E0] bg-white text-[#636E72] hover:border-[#FF7F50]/30"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setOnboardingStep(2);
                            }}
                            className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-sm text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95"
                          >
                            Napakaganda! Gumawa ng Profile <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: CREATE PROFILE */}
                  {onboardingStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-display font-extrabold text-[#2D3436] leading-snug">
                          Gumawa ng iyong Profile 👤
                        </h2>
                        <p className="text-xs font-semibold text-[#636E72] mt-0.5">
                          Create your profile to start learning!
                        </p>
                      </div>

                      <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-3xs">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-display font-bold text-[#636E72] uppercase tracking-wider">
                            Pangalan ng Mag-aaral
                          </label>
                          <input
                            type="text"
                            value={learner.name}
                            onChange={(e) => setLearner(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ipasok ang pangalan..."
                            className="w-full bg-[#FDFCF8] border-2 border-[#E9E7E0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2D3436] focus:border-[#FF7F50] focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Avatar Grid */}
                        <div className="space-y-2 pt-2">
                          <label className="block text-[11px] font-display font-bold text-[#636E72] uppercase tracking-wider">
                            Pumili ng iyong Karakter
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {["👧", "👦", "🎒", "🦉", "🦁", "🐼", "🦊", "🎨"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => setLearner(prev => ({ ...prev, avatar: emoji }))}
                                className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                                  learner.avatar === emoji
                                    ? "border-[#FF7F50] bg-[#FFF3E0]/40 scale-105"
                                    : "border-[#E9E7E0] bg-white text-[#333333] hover:border-[#FF7F50]/40"
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                        <button
                          onClick={() => setOnboardingStep(1)}
                          className="flex-1 bg-white hover:bg-[#FDFCF8] border border-[#E9E7E0] text-[#636E72] font-bold py-3.5 rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Bumalik
                        </button>

                        <button
                          onClick={() => {
                            if (!learner.name.trim()) {
                              alert("Mangyaring ilagay ang iyong pangalan! (Please enter your name)");
                              return;
                            }
                            setAccessibilityProfile("none"); // Automatically assume standard / normal profile
                            setSelectedScreen("feelings"); // Go to feelings check-in!
                          }}
                          className="flex-1 bg-[#2E7D32] hover:bg-[#256428] text-white font-extrabold py-3.5 rounded-2xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Tapusin ang Setup <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-center text-[#636E72] font-semibold mt-2">
                    Maaari mong baguhin ang accessibility at SPED settings sa Settings tab kahit kailan.
                  </p>
                </div>
              )}

              {/* ==========================================
                  SCREEN 7: MOOD / FEELINGS CHECK-IN
                  ========================================== */}
              {selectedScreen === "feelings" && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center mx-auto border border-[#FFE0B2]">
                    <Smile className="w-6 h-6 text-[#FF9800]" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold text-[#2D3436] leading-snug">
                      Kumusta ang pakiramdam mo today?
                    </h2>
                    <p className="text-xs font-semibold text-[#636E72]">
                      How are you feeling right now, {learner.name}?
                    </p>
                  </div>

                  <p className="text-xs text-[#333333] bg-[#FFF3E0]/60 px-4 py-2.5 rounded-2xl border border-[#FFE0B2] inline-block">
                    Walang maling sagot! I-aakma ko ang tono ng lesson para sa iyo. ❤️
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto">
                    {[
                      { key: "Excited", emoji: "🤩", label: "Excited", desc: "Masigla", color: "bg-[#FFF3E0] border-[#FFE0B2] text-[#E65100]" },
                      { key: "Okay", emoji: "🙂", label: "Okay Lang", desc: "Just alright", color: "bg-[#E1F5FE] border-[#B3E5FC] text-[#546E7A]" },
                      { key: "Tired", emoji: "🥱", label: "Pagod", desc: "Tired / ADHD-friendly", color: "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]" },
                      { key: "Stressed", emoji: "🥺", label: "Medyo Stressed", desc: "Anxious / Autism-friendly", color: "bg-rose-50 border-rose-200 text-rose-900" }
                    ].map((mood) => (
                      <button
                        key={mood.key}
                        onClick={() => {
                          setLearner(prev => {
                            const nextSettings = { ...prev.settings };
                            // Auto adjust layouts based on mood to demonstrate adaptive SPED capabilities
                            if (mood.key === "Tired") {
                              nextSettings.shorterLessons = true; // ADHD-friendly shorter lessons auto enabled
                            } else if (mood.key === "Stressed") {
                              nextSettings.calmMode = true; // Autism-friendly reduced clutter enabled
                            }
                            return {
                              ...prev,
                              moodToday: mood.key as any,
                              settings: nextSettings
                            };
                          });
                          setSelectedScreen("home");
                          setActiveTab("home");
                        }}
                        className={`p-3 rounded-2xl border-2 hover:scale-105 transition-all cursor-pointer ${
                          learner.moodToday === mood.key
                            ? "border-[#2D3436] bg-[#E9E7E0]/50 shadow-xs"
                            : mood.color
                        }`}
                      >
                        <span className="text-3xl block mb-1">{mood.emoji}</span>
                        <div className="text-xs font-display font-extrabold leading-none">{mood.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5 font-medium">{mood.desc}</div>
                      </button>
                    ))}
                  </div>

                  {learner.moodToday && (
                    <div className="p-3 bg-white border border-[#E9E7E0] rounded-2xl text-xs text-[#333333] max-w-[280px] mx-auto shadow-2xs">
                      {learner.moodToday === "Excited" && "🤩 Galing! Mabilis nating malulutas ang Math ngayon!"}
                      {learner.moodToday === "Okay" && "🙂 Salamat sa pagbabahagi. Let's do some relaxed learning!"}
                      {learner.moodToday === "Tired" && "🥱 Okay lang mapagod. Nilagay ko sa SIKSIK (short) lessons ang system natin."}
                      {learner.moodToday === "Stressed" && "🥺 Narito ako para suportahan ka. Gagawa tayo ng tahimik at predictable layout ngayon."}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedScreen("home");
                      setActiveTab("home");
                    }}
                    className="text-xs text-[#FF7F50] font-bold underline hover:text-[#e2693c]"
                  >
                    Skip and go to Home
                  </button>
                </div>
              )}

              {/* ==========================================
                  SCREEN 1: WELCOME / HOME (RETURNING LEARNER)
                  ========================================== */}
              {selectedScreen === "home" && (
                <div className="space-y-5">
                  
                  {/* Student profile summary header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-xl shadow-xs">
                        {learner.avatar}
                      </div>
                      <div>
                        <h3 className="text-[10px] text-[#636E72] font-bold uppercase tracking-wider">
                          {appLanguage === "tl" && "Mabuhay! Welcome Back"}
                          {appLanguage === "en" && "Welcome Back!"}
                          {appLanguage === "ceb" && "Maayong Adlaw! Welcome"}
                          {appLanguage === "ilo" && "Naimbag nga Adlaw! Welcome"}
                          {appLanguage === "hil" && "Maayong Adlaw! Welcome"}
                        </h3>
                        <h2 className="text-lg font-display font-extrabold text-[#2D3436] tracking-tight">
                          {appLanguage === "tl" && `Kumusta, ${learner.name}!`}
                          {appLanguage === "en" && `Hello, ${learner.name}!`}
                          {appLanguage === "ceb" && `Kumusta, ${learner.name}!`}
                          {appLanguage === "ilo" && `Kumusta, ${learner.name}!`}
                          {appLanguage === "hil" && `Kumusta, ${learner.name}!`}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Effort/Puso Points */}
                      <div className="flex items-center gap-1 bg-white border border-[#E9E7E0] px-3 py-1.5 rounded-full text-[#FF7675] font-bold text-xs shadow-xs">
                        <Heart className="w-3.5 h-3.5 fill-[#FF7675] text-[#FF7675]" />
                        <span>{learner.pusoPoints}</span>
                      </div>
                      
                      {/* Accessibility short-toggle */}
                      <button
                        onClick={() => setSelectedScreen("settings")}
                        className="p-1.5 rounded-full bg-white hover:bg-[#FDFCF8] border border-[#E9E7E0] text-[#636E72] shadow-xs cursor-pointer"
                        title="SPED Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* NEXT LESSON / STREAK HERO CARD - Bento theme */}
                  <div className="bg-[#FF7F50] text-white rounded-[32px] p-6 relative overflow-hidden flex flex-col justify-center shadow-md border border-[#FF7F50]">
                    <div className="relative z-10 space-y-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/20 text-white px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-200 fill-current" /> {learner.streak}-Day Streak
                        </span>
                        <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                          NEXT LESSON
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-display font-black leading-tight tracking-tight">
                        {translate(activeSubject.name, activeSubject.nameTagalog)}: {translate(activeSubject.topic, activeSubject.topicTagalog)}
                      </h2>
                      <p className="text-[11px] opacity-90 max-w-[240px] leading-relaxed font-semibold">
                        Ipagpatuloy ang pag-aaral ngayon upang madagdagan ang iyong Puso Points at kaalaman!
                      </p>
                      
                      <button
                        onClick={() => {
                          setSelectedScreen("lesson");
                          setActiveTab("learn");
                        }}
                        className="bg-white text-[#FF7F50] text-xs font-extrabold px-4.5 py-2.5 rounded-2xl shadow-sm hover:scale-[1.03] transition-transform flex items-center gap-1.5 mt-2 w-max cursor-pointer"
                      >
                        Continue Learning <span>→</span>
                      </button>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                  </div>

                  {/* Weekly Goal Bento Card */}
                  <div className="bg-white rounded-3xl p-5 border border-[#E9E7E0] shadow-3xs flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-[6px] border-[#A8D5BA] flex items-center justify-center mb-3">
                      <span className="text-lg font-display font-extrabold text-[#2D3436]">75%</span>
                    </div>
                    <h3 className="text-sm font-display font-bold text-[#2D3436]">Weekly Goal</h3>
                    <p className="text-[11px] text-[#636E72] mt-1 leading-snug font-semibold">
                      3 out of 4 modules done!<br />Ang galing mo, {learner.name}!
                    </p>
                  </div>

                  {/* G7 Filipino Continuation Game Banner */}
                  <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white rounded-[32px] p-5 shadow-sm space-y-3 relative overflow-hidden border border-purple-400">
                    <div className="relative z-10 space-y-1.5">
                      <span className="bg-white/20 text-[8px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase inline-block">
                        🎮 BAGONG LARO
                      </span>
                      <h3 className="text-sm font-display font-black leading-tight">
                        Filipino G7 Continuation Quest ⚔️
                      </h3>
                      <p className="text-[10px] opacity-90 leading-relaxed font-semibold">
                        Lutasin ang mga Bugtong, buuin ang mga Pang-abay na pangungusap, at i-save ang baryo kasama ang ating mga bayani!
                      </p>
                      <button
                        onClick={() => {
                          setSelectedScreen("game");
                          setActiveTab("game");
                        }}
                        className="bg-white text-purple-600 hover:bg-purple-50 text-[10px] font-black px-4 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-103 cursor-pointer inline-flex items-center gap-1.5 mt-1"
                      >
                        Maglaro at Mag-earn ng Points (Play) <span>→</span>
                      </button>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] text-5xl opacity-20 transform rotate-12">
                      ⚔️
                    </div>
                  </div>

                  {/* Subject List title */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-display font-bold text-[#636E72] uppercase tracking-wider">
                        Aralin Ngayong Baitang (Grade 7)
                      </h3>
                      <span className="text-[10px] text-[#FF7F50] font-bold bg-[#FFF3E0] px-2 py-0.5 rounded-full">MATATAG Aligned</span>
                    </div>

                    <div className="space-y-3">
                      {SUBJECTS.map((subject) => {
                        const bStyles = getSubjectBentoStyles(subject.id);
                        return (
                          <div
                            key={subject.id}
                            onClick={() => {
                              setActiveSubject(subject);
                              setSelectedScreen("lesson");
                              setActiveTab("learn");
                            }}
                            className={`p-4 rounded-3xl border ${bStyles.bg} ${bStyles.border} cursor-pointer hover:shadow-xs transition-all flex justify-between items-center`}
                          >
                            <div className="space-y-1 flex-1 pr-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-display font-extrabold uppercase tracking-wide ${bStyles.subtitle}`}>
                                  {translate(subject.name, subject.nameTagalog)}
                                </span>
                              </div>
                              <h4 className="text-xs font-display font-extrabold text-[#2D3436] leading-tight">
                                {translate(subject.topic, subject.topicTagalog)}
                              </h4>
                              
                              {/* Progress Bar */}
                              <div className="space-y-1 pt-1.5">
                                <div className="flex justify-between text-[9px] font-extrabold text-[#636E72]">
                                  <span>PROGRESS: {subject.progress}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${bStyles.progressBg} rounded-full`}
                                    style={{ width: `${subject.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-xs shrink-0 border border-[#E9E7E0]">
                              {bStyles.emoji}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feel-good SPED micro-affirmation box */}
                  <div className="p-3.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-2xl text-xs flex items-start gap-2.5 leading-relaxed font-semibold">
                    <span className="text-lg">💡</span>
                    <div>
                      <span className="font-display font-bold">Jasmin's Comfort Mode:</span> Ang audio read-aloud ay handa para sa iyo. Pindutin lamang ang speaker button sa kahit anong lesson!
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                  SCREEN 3: SUBJECT LESSON (THE CORE SCREEN)
                  ========================================== */}
              {selectedScreen === "lesson" && (
                <div className="space-y-4">
                  {/* Top Lesson Header */}
                  <div className="flex items-center justify-between border-b border-[#E9E7E0] pb-3">
                    <button
                      onClick={() => setSelectedScreen("home")}
                      className="flex items-center gap-1 text-xs text-[#636E72] font-extrabold hover:text-[#2D3436] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Home
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#FF7F50] block">Grade 7 MATATAG Matematika</span>
                      <h2 className="text-xs font-extrabold text-[#2D3436]">Polygons (Maraming-Guhit)</h2>
                    </div>
                    {/* Bilingual Language Switch Toggle */}
                    <button
                      onClick={() => setLessonLanguage(prev => prev === "en" ? "tl" : "en")}
                      className="flex items-center gap-1 text-[10px] font-display font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] py-1 px-2.5 rounded-full hover:bg-amber-100 cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      {lessonLanguage === "tl" ? "Taglish" : "English"}
                    </button>
                  </div>

                  {/* Read-Aloud play controller */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E9E7E0] shadow-2xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={isPlayingAudio ? stopAudioPlayback : startAudioPlayback}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isPlayingAudio ? "bg-rose-500 text-white animate-soft-pulse" : "bg-[#FF7F50] text-white"
                        }`}
                      >
                        {isPlayingAudio ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <div>
                        <div className="text-xs font-display font-bold text-[#2D3436]">
                          {isPlayingAudio ? "Bumabasa Ngayon..." : "Basahin nang Malakas"}
                        </div>
                        <div className="text-[9px] text-[#636E72] font-semibold">
                          {isPlayingAudio ? "Highlighting while reading is active!" : "Audio Read-Aloud Assistant"}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-display font-bold text-[#E65100] bg-[#FFF3E0] px-2.5 py-1 rounded-full border border-[#FFE0B2]">
                      🔊 {lessonLanguage === "tl" ? "Tagalog Voice" : "English Voice"}
                    </div>
                  </div>

                  {/* Lesson Format Selector Pills/Tabs */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-bold text-[#636E72] uppercase tracking-wider block">
                      Choose How to Learn:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 select-none">
                      {[
                        { key: "text_voice", label: "Read & Listen 🔊", icon: "🔊" },
                        { key: "worked_example", label: "Worked Example 🧮", icon: "🧮" },
                        { key: "socratic", label: "Guiding Questions 💡", icon: "💡" },
                        { key: "gamified", label: "Quest Mode ⚔️", icon: "⚔️" },
                        { key: "eli5", label: "Super-Simple 🧸", icon: "🧸" }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => {
                            setLessonFormat(tab.key);
                            fetchLessonContent(tab.key, activeSubject);
                          }}
                          className={`py-1.5 px-3 rounded-full text-xs font-bold border shrink-0 transition-all cursor-pointer ${
                            lessonFormat === tab.key
                              ? "bg-[#FF7F50] border-[#FF7F50] text-white shadow-xs"
                              : "bg-white border-[#E9E7E0] text-[#636E72] hover:bg-[#FDFCF8]"
                          }`}
                        >
                          <span className="mr-1">{tab.icon}</span> {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Core Content Area */}
                  <div className="bg-white rounded-3xl border border-[#E9E7E0] p-4 shadow-2xs relative min-h-[160px]">
                    {isLoadingLesson ? (
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/95 rounded-3xl p-5 z-20">
                        <div className="w-8 h-8 rounded-full border-4 border-[#FF7F50] border-t-transparent animate-spin mb-3" />
                        <p className="text-xs font-display font-extrabold text-[#2D3436]">Tinitimpla ang bagong aralin...</p>
                        <p className="text-[10px] text-[#636E72] mt-1 font-semibold italic">GETS AI is creating a custom simplified layout</p>
                      </div>
                    ) : null}

                    {/* ADHD/Dyslexia Highlight and Lesson Rendering Container */}
                    <div className={`space-y-3 leading-relaxed text-[#333333] ${getTextSizeClass()}`}>
                      
                      {/* Autism Calm Mode removes unnecessary visual flourishes */}
                      {!learner.settings.calmMode && (
                        <div className="w-full flex justify-end">
                          <span className="text-[9px] font-display font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                            ✨ Custom {lessonFormat.toUpperCase()} Mode
                          </span>
                        </div>
                      )}

                      {/* Display content with word highlighting if playing audio */}
                      {isPlayingAudio && currentSpeechWordIndex !== -1 ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-[#FFF3E0]/70 border-l-4 border-[#FF9800] text-xs text-[#333333] italic mb-2 rounded-r-2xl">
                            Makinig at sumunod sa pagbasa sa ibaba:
                          </div>
                          <div className="whitespace-pre-wrap leading-loose">
                            {speechWords.map((word, idx) => {
                              const isCurrent = idx === currentSpeechWordIndex;
                              return (
                                <span
                                  key={idx}
                                  className={`${isCurrent && learner.settings.textHighlighting ? "reading-highlight-word font-bold text-[#2D3436]" : ""} transition-all duration-150 inline-block mr-1.5`}
                                >
                                  {word}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        // Normal markdown format parser display
                        <div className="space-y-3">
                          {lessonContent.split("\n\n").map((para, pIdx) => {
                            if (learner.settings.shorterLessons && pIdx > 2) {
                              // ADHD-friendly shorter micro-lessons restricts long text block
                              return null;
                            }
                            if (para.startsWith("###")) {
                              return (
                                <h3 key={pIdx} className={getHeadingSizeClass(1)}>
                                  <BionicText text={para.replace("###", "")} active={!!learner.settings.bionicReading} />
                                </h3>
                              );
                            }
                            if (para.startsWith("*")) {
                              return (
                                <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-xs text-[#333333]">
                                  {para.split("\n").map((item, iIdx) => (
                                    <li key={iIdx}>
                                      <BionicText text={item.replace("*", "").trim()} active={!!learner.settings.bionicReading} />
                                    </li>
                                  ))}
                                </ul>
                              );
                            }
                            return (
                              <p key={pIdx} className="text-xs leading-relaxed">
                                <BionicText text={para} active={!!learner.settings.bionicReading} />
                              </p>
                            );
                          })}
                        </div>
                      )}

                      {learner.settings.shorterLessons && lessonContent.split("\n\n").length > 3 && (
                        <div className="mt-3 p-3 bg-purple-50 text-purple-950 border border-purple-200 rounded-2xl text-[10px] font-semibold flex justify-between items-center leading-snug">
                          <span>⚡ ADHD micro-lessons is active. Text has been shortened.</span>
                          <button
                            onClick={() => toggleSetting("shorterLessons")}
                            className="underline text-purple-800 font-extrabold cursor-pointer ml-1 shrink-0"
                          >
                            Show Full
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* "Did it Land?" - Custom Decision Diamond from Build Map */}
                  <div className="bg-white rounded-3xl border border-[#E9E7E0] p-4.5 space-y-3 shadow-3xs">
                    {didItLand === null && (
                      <>
                        <div className="text-center">
                          <h4 className="text-xs font-display font-black text-[#2D3436]">
                            Naintindihan mo ba ang aralin, {learner.name}? 🧐
                          </h4>
                          <p className="text-[10px] text-[#636E72] font-semibold mt-0.5">
                            Did this format land for you?
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => {
                              setDidItLand("yes");
                              // Reward 5 extra effort/understanding points!
                              setLearner(prev => ({ ...prev, pusoPoints: prev.pusoPoints + 5 }));
                            }}
                            className="bg-[#E8F5E9] hover:bg-[#c8e6c9]/40 text-[#2E7D32] border-2 border-[#C8E6C9] font-display font-black py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                          >
                            👍 Oo, malinaw na! (+5💖)
                          </button>
                          <button
                            onClick={() => setDidItLand("no")}
                            className="bg-rose-50 hover:bg-rose-100/40 text-rose-900 border-2 border-rose-200 font-display font-black py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                          >
                            🤔 Medyo magulo pa...
                          </button>
                        </div>
                      </>
                    )}

                    {didItLand === "yes" && (
                      <div className="text-center space-y-3">
                        <div className="text-2xl">🎉</div>
                        <div>
                          <h4 className="text-xs font-display font-black text-[#2E7D32]">
                            Kamangha-manghang gawa!
                          </h4>
                          <p className="text-[10px] text-[#636E72] font-semibold mt-0.5">
                            You're ready for the adaptive drill. You earned +5 Puso Points!
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedScreen("quiz");
                            resetQuiz();
                          }}
                          className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          Pagsasanay <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {didItLand === "no" && (
                      <div className="space-y-2.5">
                        <div className="text-center">
                          <h4 className="text-xs font-display font-black text-amber-900 bg-amber-50 py-1 px-3.5 rounded-full border border-amber-200 inline-block">
                            Walang problema, {learner.name}! 💛
                          </h4>
                          <p className="text-[10px] text-[#636E72] font-semibold mt-1">
                            Let's try explaining it a different way. Pick a format below:
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: "worked_example", label: "Worked Example 🧮", color: "border-blue-200 hover:bg-blue-50/30 text-blue-900" },
                            { key: "socratic", label: "Guiding Questions 💡", color: "border-amber-200 hover:bg-amber-50/30 text-amber-950" },
                            { key: "gamified", label: "Quest Mode ⚔️", color: "border-emerald-200 hover:bg-emerald-50/30 text-emerald-900" },
                            { key: "eli5", label: "Super-Simple 🧸", color: "border-purple-200 hover:bg-purple-50/30 text-purple-950" }
                          ].map((fmt) => (
                            <button
                              key={fmt.key}
                              onClick={() => {
                                setLessonFormat(fmt.key);
                                fetchLessonContent(fmt.key, activeSubject);
                              }}
                              className={`p-2 rounded-xl border-2 text-[10px] font-display font-black transition-all cursor-pointer ${fmt.color}`}
                            >
                              {fmt.label}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            // Cycle default formats as fallback
                            const formats = ["text_voice", "worked_example", "socratic", "gamified", "eli5"];
                            const nextIndex = (formats.indexOf(lessonFormat) + 1) % formats.length;
                            setLessonFormat(formats[nextIndex]);
                            fetchLessonContent(formats[nextIndex], activeSubject);
                          }}
                          className="w-full text-center text-[10px] text-[#636E72] underline font-bold mt-1.5 hover:text-[#2D3436]"
                        >
                          Auto-switch format instead
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Informational offline assurance snippet */}
                  <div className="text-[10px] text-center text-[#636E72] font-semibold">
                    Offline mode automatically saves points to sync later.
                  </div>
                </div>
              )}

              {/* ==========================================
                  SCREEN 4: PRACTICE DRILL / ADAPTIVE QUIZ
                  ========================================== */}
              {selectedScreen === "quiz" && (
                <div className="space-y-4">
                  {/* Drill Header */}
                  <div className="flex items-center justify-between border-b border-[#E9E7E0] pb-3">
                    <button
                      onClick={() => setSelectedScreen("lesson")}
                      className="flex items-center gap-1 text-xs text-[#636E72] font-extrabold hover:text-[#2D3436] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Lesson
                    </button>
                    <div>
                      <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#FF7F50] block">Grade 7 MATATAG Pagsasanay</span>
                      <h2 className="text-xs font-extrabold text-[#2D3436]">Polygon Quiz Challenge</h2>
                    </div>
                    {/* Points counter ticks up */}
                    <div className="flex items-center gap-1 bg-white border border-[#E9E7E0] px-2.5 py-1 rounded-full text-[#FF7675] font-extrabold text-[11px] shadow-3xs">
                      <Heart className="w-3.5 h-3.5 fill-[#FF7675] text-[#FF7675]" />
                      <span>{learner.pusoPoints}</span>
                    </div>
                  </div>

                  {/* Progress dots with labels - calm, no-timer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-extrabold text-[#636E72]">
                      Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                    
                    <div className="flex gap-1.5">
                      {QUIZ_QUESTIONS.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-full transition-all ${
                            idx === currentQuizIndex
                              ? "bg-[#FF7F50] ring-2 ring-orange-200"
                              : idx < currentQuizIndex
                              ? "bg-[#4CAF50]"
                              : "bg-[#E9E7E0]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Low pressure effort reward message */}
                  <div className="p-3.5 bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] rounded-2xl text-[11px] leading-relaxed font-semibold">
                    🌟 <span>May Puso Points ka sa bawat sagot!</span> Nakakakuha ka ng +15 pts kapag tama, at +5 pts kapag sumubok ka pa rin. No stress!
                  </div>

                  {/* Question Display */}
                  <div className="bg-white rounded-3xl border border-[#E9E7E0] p-4 shadow-2xs">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-xs font-display font-extrabold text-[#2D3436] leading-snug">
                          <BionicText text={QUIZ_QUESTIONS[currentQuizIndex].question} active={!!learner.settings.bionicReading} />
                        </h3>
                        <p className="text-[11px] text-[#636E72] font-semibold italic mt-1">
                          <BionicText text={QUIZ_QUESTIONS[currentQuizIndex].questionTagalog} active={!!learner.settings.bionicReading} />
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakText(
                          lessonLanguage === "tl" 
                            ? QUIZ_QUESTIONS[currentQuizIndex].questionTagalog 
                            : QUIZ_QUESTIONS[currentQuizIndex].question,
                          lessonLanguage
                        )}
                        className={`p-2 rounded-xl shrink-0 transition-all cursor-pointer ${
                          currentlySpeakingText === (lessonLanguage === "tl" ? QUIZ_QUESTIONS[currentQuizIndex].questionTagalog : QUIZ_QUESTIONS[currentQuizIndex].question)
                            ? "bg-rose-500 text-white animate-soft-pulse"
                            : "bg-[#FFF3E0] hover:bg-amber-100 text-[#E65100] border border-[#FFE0B2]"
                        }`}
                        title="Basahin ang Tanong"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Answer Choices */}
                  <div className="grid grid-cols-1 gap-2">
                    {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                      const isSelected = selectedAnswerIndex === idx;
                      const isCorrect = QUIZ_QUESTIONS[currentQuizIndex].correctAnswerIndex === idx;
                      
                      let cardStyle = "border-[#E9E7E0] bg-white text-[#333333] hover:bg-[#FDFCF8]";
                      if (isSelected) {
                        cardStyle = "border-[#FF7F50] bg-[#FFF3E0]/30 text-[#2D3436] font-semibold";
                      }
                      if (quizSubmitted) {
                        if (isCorrect) {
                          cardStyle = "border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32] font-extrabold";
                        } else if (isSelected) {
                          cardStyle = "border-rose-300 bg-rose-50 text-rose-950 line-through";
                        } else {
                          cardStyle = "border-[#E9E7E0]/40 bg-[#FDFCF8] text-[#636E72] opacity-60";
                        }
                      }

                      const optionEn = opt;
                      const optionTl = QUIZ_QUESTIONS[currentQuizIndex].optionsTagalog[idx];
                      const currentOptionText = lessonLanguage === "tl" ? optionTl : optionEn;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          disabled={quizSubmitted}
                          className={`p-3 text-left rounded-2xl border-2 transition-all text-xs flex items-center justify-between cursor-pointer ${cardStyle}`}
                        >
                          <div className="pr-2 flex-1 flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(currentOptionText, lessonLanguage);
                              }}
                              className={`p-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                                currentlySpeakingText === currentOptionText
                                  ? "bg-rose-500 text-white animate-soft-pulse"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                              title="Basahin ang sagot"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <div>
                              <div className="font-semibold">
                                <BionicText text={opt} active={!!learner.settings.bionicReading} />
                              </div>
                              <div className="text-[10px] opacity-75 italic mt-0.5 font-medium">
                                <BionicText text={optionTl} active={!!learner.settings.bionicReading} />
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600 animate-soft-pulse" />}
                            {isSelected && !quizSubmitted && <div className="w-3.5 h-3.5 rounded-full bg-[#FF7F50]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Explanations Area */}
                  {quizSubmitted ? (
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-3xl space-y-2.5 shadow-2xs">
                      <div className="flex items-center gap-2">
                        {selectedAnswerIndex === QUIZ_QUESTIONS[currentQuizIndex].correctAnswerIndex ? (
                          <div className="bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-[10px] font-display font-black px-2.5 py-1 rounded-full uppercase">
                            ✨ Mahusay! Tumpak (+15 Puso Points!)
                          </div>
                        ) : (
                          <div className="bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] text-[10px] font-display font-black px-2.5 py-1 rounded-full uppercase">
                            💛 Nice try — let's look again (+5 Effort Points!)
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-start gap-3 text-xs text-[#333333] leading-relaxed bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex-1">
                          <p className="font-display font-bold text-slate-700">Paliwanag:</p>
                          <p className="font-medium">
                            <BionicText text={QUIZ_QUESTIONS[currentQuizIndex].explanation} active={!!learner.settings.bionicReading} />
                          </p>
                          <p className="italic text-[#636E72] mt-1 font-medium">
                            <BionicText text={QUIZ_QUESTIONS[currentQuizIndex].explanationTagalog} active={!!learner.settings.bionicReading} />
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(
                            lessonLanguage === "tl" 
                              ? QUIZ_QUESTIONS[currentQuizIndex].explanationTagalog 
                              : QUIZ_QUESTIONS[currentQuizIndex].explanation,
                            lessonLanguage
                          )}
                          className={`p-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                            currentlySpeakingText === (lessonLanguage === "tl" ? QUIZ_QUESTIONS[currentQuizIndex].explanationTagalog : QUIZ_QUESTIONS[currentQuizIndex].explanation)
                              ? "bg-rose-500 text-white animate-soft-pulse"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                          title="Basahin ang Paliwanag"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={nextQuizQuestion}
                        className="w-full bg-[#2D3436] hover:bg-[#333333] text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        {currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? (
                          <>Salamat! Next Question <ChevronRight className="w-4 h-4" /></>
                        ) : (
                          <>Tapusin ang Pagsasanay <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={submitQuizAnswer}
                      disabled={selectedAnswerIndex === null}
                      className={`w-full py-3.5 px-4 rounded-2xl text-xs font-display font-black transition-all cursor-pointer ${
                        selectedAnswerIndex === null
                          ? "bg-[#E9E7E0]/60 text-[#636E72]/60 cursor-not-allowed"
                          : "bg-[#FF7F50] hover:bg-[#e2693c] text-white shadow-sm"
                      }`}
                    >
                      I-SUBMIT ANG SAGOT (Submit Answer)
                    </button>
                  )}
                </div>
              )}

              {/* ==========================================
                  SCREEN 5: REWARDS & GAMIFICATION
                  ========================================== */}
              {selectedScreen === "rewards" && (
                <div className="space-y-5">
                  {/* Top rewards summary header */}
                  <div className="bg-gradient-to-br from-[#FF7F50] via-[#FF6B6B] to-[#FF8E53] text-white rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-display font-black uppercase tracking-wider text-orange-100">Jasmin's Vault</span>
                      <span className="text-[10px] font-display font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase">Level 4 Scholar</span>
                    </div>

                    <div className="flex justify-around items-center py-2">
                      <div className="text-center">
                        <div className="text-3xl font-display font-black flex items-center justify-center gap-1">
                          💖 {learner.pusoPoints}
                        </div>
                        <div className="text-[10px] font-display font-bold text-orange-100 uppercase tracking-wider mt-1">Puso Points (Effort)</div>
                      </div>

                      <div className="w-px h-10 bg-white/20" />

                      <div className="text-center">
                        <div className="text-3xl font-display font-black flex items-center justify-center gap-1">
                          🔥 {learner.streak}d
                        </div>
                        <div className="text-[10px] font-display font-bold text-orange-100 uppercase tracking-wider mt-1">Streak Day</div>
                      </div>
                    </div>
                  </div>

                  {/* MAHIWAGANG SARIMANOK PET HATCHERY & STREAK (Spends Points & Tracks Streak!) */}
                  <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFF3E0] p-4.5 rounded-3xl border-2 border-[#FFE0B2] shadow-3xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">🦚</span>
                        <h3 className="text-xs font-display font-black text-[#2D3436]">Pugad ng Sarimanok (Sarimanok Nest)</h3>
                      </div>
                      <span className="bg-[#FF9800] text-white text-[8px] font-display font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-soft-pulse">
                        Pet Sanctuary
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5D4037] leading-relaxed font-semibold">
                      Gamitin ang iyong Puso Points upang mapisa ang Mahiwagang Itlog ng **Sarimanok**! Ang kanyang anyo at kapangyarihan ay lumalakas kasabay ng iyong tuluy-tuloy na **Pag-aaral Streak**!
                    </p>

                    {petMessage && (
                      <div className="p-2 bg-[#E65100] text-white font-extrabold text-[10px] rounded-xl text-center animate-soft-pulse shadow-3xs">
                        {petMessage}
                      </div>
                    )}

                    {/* MAIN NEST CONTAINER */}
                    <div className="bg-white p-4 rounded-2xl border border-[#FFE0B2] flex flex-col items-center justify-center text-center space-y-3.5 relative overflow-hidden">
                      {/* Interactive Pet Visual based on Stage */}
                      <div className="relative">
                        {/* Background Streak Glow Aura */}
                        <div className={`absolute -inset-4 rounded-full blur-md opacity-30 transition-all duration-500 ${
                          learner.streak >= 12 ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 animate-spin" :
                          learner.streak >= 5 ? "bg-gradient-to-r from-orange-400 to-yellow-400 animate-pulse" : "bg-orange-100"
                        }`} />
                        
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-[#FFFDF5] to-[#FFF8E1] border-2 border-[#FFE0B2] flex flex-col items-center justify-center shadow-2xs">
                          {/* Pet Emojis */}
                          {!sarimanokState.hatched ? (
                            <span className="text-5xl animate-bounce cursor-pointer" onClick={() => incubateEgg(15)}>
                              {sarimanokState.stage === 1 ? "🥚" : "🐣"}
                            </span>
                          ) : (
                            <span className="text-5xl transition-transform duration-300 hover:scale-110">
                              {sarimanokState.stage === 3 ? "🐥" : "🦚"}
                            </span>
                          )}
                          
                          {/* Decorative overlay depending on study streak */}
                          {sarimanokState.hatched && learner.streak >= 10 && (
                            <span className="absolute -top-2 text-base animate-bounce">👑</span>
                          )}
                        </div>
                      </div>

                      {/* Name / Description Tag */}
                      <div className="space-y-1">
                        <div className="text-xs font-display font-black text-[#5D4037]">
                          {!sarimanokState.hatched 
                            ? "Mahiwagang Itlog ng Sarimanok" 
                            : `Si ${sarimanokState.petName} (Level ${sarimanokState.stage - 1} Sarimanok)`}
                        </div>
                        
                        {/* Interactive Warmth / Level Bar */}
                        {!sarimanokState.hatched ? (
                          <div className="w-48 mx-auto space-y-1">
                            <div className="flex justify-between text-[9px] font-black text-[#E65100]">
                              <span>INIT</span>
                              <span>{sarimanokState.warmth}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-[#F4F1EA] rounded-full overflow-hidden border border-[#FFE0B2]">
                              <div 
                                className="h-full bg-gradient-to-r from-[#FF7F50] to-[#FF3D00] transition-all duration-500"
                                style={{ width: `${sarimanokState.warmth}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] font-semibold text-[#636E72]">
                            {sarimanokState.stage === 3 
                              ? "🐣 Baby Sarimanok: Mahilig sa buto ng MATATAG!" 
                              : "🦚 Royal Rainbow Sarimanok! Isang alamat na ibon ng Maranao! ✨"}
                          </div>
                        )}
                      </div>

                      {/* Active Streak Bonus Status */}
                      <div className="bg-[#FAF9F5] py-2 px-3.5 rounded-xl border border-[#E9E7E0] w-full max-w-[260px] text-left space-y-1">
                        <div className="text-[10px] font-display font-black text-[#5D4037] flex items-center gap-1">
                          🔥 Sarimanok Pet Streak: <span className="text-[#E65100]">{learner.streak} Araw</span>
                        </div>
                        <div className="text-[9px] text-[#636E72] font-medium leading-tight">
                          {learner.streak >= 10 
                            ? "🌟 Legend Level: Aktibo ang Rainbow Glow at Golden Crown! (+20% power)" 
                            : learner.streak >= 5 
                            ? "✨ Flame Level: Pinapaligiran ng mainit na orange na aura! (+10% power)"
                            : "🌱 Spark Level: Mag-aral araw-araw para maging multi-colored rainbow ang iyong pet!"}
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-2 w-full">
                        {!sarimanokState.hatched ? (
                          <>
                            <button
                              onClick={() => incubateEgg(20)}
                              disabled={sarimanokState.warmth >= 100}
                              className="flex-1 bg-[#FF7F50] hover:bg-[#e2693c] disabled:bg-slate-200 text-white font-display font-black py-2 rounded-xl text-[10px] cursor-pointer shadow-3xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                            >
                              🔥 Initin (-20💖)
                            </button>

                            {sarimanokState.warmth >= 100 && (
                              <button
                                onClick={hatchSarimanok}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-display font-black py-2 rounded-xl text-[10px] cursor-pointer shadow-md animate-soft-pulse flex items-center justify-center gap-1"
                              >
                                ✨ Mapisa! 🥚
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => feedSarimanok(35)}
                              disabled={sarimanokState.stage >= 4}
                              className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-slate-200 text-white font-display font-black py-2 rounded-xl text-[10px] cursor-pointer shadow-3xs transition-transform active:scale-95 flex items-center justify-center gap-1"
                            >
                              {sarimanokState.stage >= 4 ? "👑 Ganap na Lumaki!" : "🌽 Pakainin (-35💖)"}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Name input box if pet is hatched */}
                      {sarimanokState.hatched && (
                        <div className="w-full pt-1.5 border-t border-[#F4F1EA] flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Pangalanan ang pet..."
                            value={sarimanokState.petName}
                            onChange={(e) => nameSarimanok(e.target.value)}
                            className="flex-1 text-xs px-2.5 py-1.5 border border-[#FFE0B2] rounded-lg bg-[#FAF9F5] font-semibold text-[#2D3436] focus:outline-none focus:border-[#FF7F50]"
                          />
                          <span className="text-[9px] text-[#636E72] font-black uppercase shrink-0">Label Tag 🏷️</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges / Achievements Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-display font-bold text-[#636E72] uppercase tracking-wider">Mga Sagisag (Earned Badges)</h3>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      {BADGES.map((badge) => {
                        const isUnlocked = badge.unlocked || (badge.pointsToUnlock && learner.pusoPoints >= badge.pointsToUnlock);
                        return (
                          <div
                            key={badge.id}
                            className={`p-3 rounded-2xl border-2 flex items-center gap-3.5 transition-all ${
                              isUnlocked ? "bg-white border-[#E9E7E0]" : "bg-[#FDFCF8] border-[#E9E7E0]/40 opacity-70"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shrink-0 ${
                              isUnlocked ? badge.color : "bg-[#E9E7E0] text-[#636E72] border-[#E9E7E0]"
                            }`}>
                              {isUnlocked ? "🏆" : "🔒"}
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="text-xs font-display font-black text-[#2D3436]">
                                {translate(badge.title, badge.titleTagalog)}
                              </h4>
                              <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                                {translate(badge.description, badge.descriptionTagalog)}
                              </p>
                              {!isUnlocked && badge.pointsToUnlock && (
                                <span className="text-[9px] font-display font-bold text-[#E65100] bg-[#FFF3E0] px-2 py-0.5 rounded border border-[#FFE0B2] inline-block mt-1">
                                  Kailangan pa ng {badge.pointsToUnlock - learner.pusoPoints} Puso Points
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* OPT-IN Friendly Leaderboard ranked by consistency and effort */}
                  <div className="bg-white rounded-3xl p-4 border border-[#E9E7E0] shadow-3xs">
                    <h3 className="text-xs font-display font-black text-[#2D3436] mb-2.5 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#FF7F50]" />
                      Lingguhang Kasipagan (Leaderboard)
                    </h3>
                    <div className="space-y-2">
                      {LEADERBOARD.map((user, uIdx) => (
                        <div
                          key={uIdx}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                            user.isSelf ? "bg-[#FFF3E0] border border-[#FFE0B2] font-extrabold text-[#E65100]" : "bg-[#FDFCF8]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#636E72] w-3.5 font-bold">{uIdx + 1}</span>
                            <span>{user.avatar}</span>
                            <span className="font-semibold text-[#2D3436]">{user.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#636E72] font-semibold">{user.streak}d streak</span>
                            <span className="font-display font-black text-[#2D3436]">💖 {user.points}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                  SCREEN 5.5: G7 FILIPINO DYNAMIC GAME
                  ========================================== */}
              {selectedScreen === "game" && (
                <G7FilipinoGame
                  learner={learner}
                  onUpdatePoints={(points) => {
                    setLearner(prev => ({ ...prev, pusoPoints: prev.pusoPoints + points }));
                  }}
                  onBackToDashboard={() => {
                    setSelectedScreen("home");
                    setActiveTab("home");
                  }}
                  selectedChildKey={selectedChildKey}
                  updateParentDashboard={(questId, pointsEarned) => {
                    setChildrenState(prev => {
                      const currentChild = prev[selectedChildKey];
                      if (!currentChild) return prev;
                      
                      const newMsg = {
                        sender: "teacher" as const,
                        text: `Balita: Matagumpay na natapos ni ${currentChild.name} ang continuation game challenge [${questId.replace(/_/g, " ").toUpperCase()}] at nakakuha ng +${pointsEarned} effort points!`,
                        time: "Kani-kanina lang"
                      };
                      
                      return {
                        ...prev,
                        [selectedChildKey]: {
                          ...currentChild,
                          effortPoints: currentChild.effortPoints + pointsEarned,
                          teacherMessages: [newMsg, ...currentChild.teacherMessages]
                        }
                      };
                    });
                  }}
                />
              )}

              {/* ==========================================
                  SCREEN 6: SPED & ACCESSIBILITY SETTINGS
                  ========================================== */}
              {selectedScreen === "settings" && (
                <div className="space-y-4">
                  
                  {/* Academic Portal Active Learning Unit Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#E9E7E0]">
                    <div>
                      <p className="text-[9px] font-display font-black text-slate-500 uppercase tracking-widest leading-none">
                        Academic Portal
                      </p>
                      <h2 className="text-base font-display font-black text-slate-800 leading-none mt-1.5">
                        Active Learning Unit
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {learner.settings.accessibilityProfile === "autism" && (
                        <span className="bg-[#E6FFFA] text-[#0D9488] text-[9px] font-display font-black px-2 py-1 rounded-md border border-[#B2F5EA] uppercase tracking-wider">
                          💚 AUT
                        </span>
                      )}
                      {learner.settings.accessibilityProfile === "adhd" && (
                        <span className="bg-[#FAF5FF] text-[#7E22CE] text-[9px] font-display font-black px-2 py-1 rounded-md border border-[#E9D8FD] uppercase tracking-wider">
                          ⚡ ADHD
                        </span>
                      )}
                      {learner.settings.accessibilityProfile === "dyslexia" && (
                        <span className="bg-[#FFFDF5] text-[#D97706] text-[9px] font-display font-black px-2 py-1 rounded-md border border-[#FEEBC8] uppercase tracking-wider">
                          ✍️ DYS
                        </span>
                      )}
                      {learner.settings.accessibilityProfile === "none" && (
                        <span className="bg-slate-50 text-slate-600 text-[9px] font-display font-black px-2 py-1 rounded-md border border-slate-200 uppercase tracking-wider">
                          🎒 None
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-full bg-[#EBF8FF] border border-slate-300 flex items-center justify-center text-lg shadow-2xs shrink-0">
                        {learner.avatar}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#E65100] bg-[#FFF3E0] p-3 rounded-2xl border border-[#FFE0B2] leading-relaxed font-semibold">
                    Maaari mong baguhin ang mga setting na ito upang maging pinaka-kumportable ang iyong pag-aaral. Ang mga ito ay tulong, hindi pagsubok!
                  </p>

                  {/* Accessibility Profile Selector Card */}
                  <div className="bg-white rounded-3xl p-4.5 border border-[#E9E7E0] shadow-3xs space-y-3">
                    <h3 className="text-xs font-display font-black text-slate-800">
                      Accessibility Profile
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(["none", "adhd", "dyslexia", "autism"] as const).map((pId) => {
                        const isSelected = learner.settings.accessibilityProfile === pId;
                        const labelMap = {
                          none: "None",
                          adhd: "Adhd",
                          dyslexia: "Dyslexia",
                          autism: "Autism",
                        };
                        return (
                          <button
                            key={pId}
                            onClick={() => setAccessibilityProfile(pId)}
                            className={`py-3 px-4 rounded-xl border text-center font-display font-black text-[11px] transition-all cursor-pointer flex items-center justify-center min-h-[46px] ${
                              isSelected
                                ? "bg-[#1E293B] border-[#1E293B] text-white shadow-xs font-bold scale-[1.01]"
                                : "bg-white border-slate-200 hover:bg-[#FAF9F5] text-slate-700 font-semibold"
                            }`}
                          >
                            {labelMap[pId]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parameters Cards List */}
                  <div className="space-y-4">
                    
                    {/* Dyslexia Profile Parameters Card */}
                    <div className="bg-white rounded-3xl p-4 border border-[#E9E7E0] shadow-3xs space-y-3">
                      <h3 className="text-xs font-display font-extrabold text-[#D97706] flex items-center gap-1.5 uppercase tracking-wider">
                        <span>📖</span> Dyslexia Profile Parameters
                      </h3>
                      <div className="divide-y divide-[#E9E7E0]/60 text-xs">
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Bionic Reading Fixations</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.bionicReading} 
                            onChange={() => toggleSetting("bionicReading")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Dyslexic Specific Letter Spacing</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.dyslexicLetterSpacing} 
                            onChange={() => toggleSetting("dyslexicLetterSpacing")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Global Speech Synthesis (TTS)</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.globalTts} 
                            onChange={() => toggleSetting("globalTts")} 
                          />
                        </div>
                        <div className="py-2.5 space-y-1.5 pt-3">
                          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                            <span>TTS Speech Rate</span>
                            <span className="text-slate-700 font-bold">{(learner.settings.ttsRate || 1)}x</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.25" 
                            value={learner.settings.ttsRate || 1}
                            onChange={(e) => updateSettingValue("ttsRate", parseFloat(e.target.value))}
                            className="w-full accent-[#3182CE]" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Autism Profile Parameters Card */}
                    <div className="bg-white rounded-3xl p-4 border border-[#E9E7E0] shadow-3xs space-y-3">
                      <h3 className="text-xs font-display font-extrabold text-[#0D9488] flex items-center gap-1.5 uppercase tracking-wider">
                        <span>💚</span> Autism Profile Parameters
                      </h3>
                      <div className="divide-y divide-[#E9E7E0]/60 text-xs">
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Zen Mode (No audio/flashes)</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.zenMode} 
                            onChange={() => toggleSetting("zenMode")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Literal Unmetaphorical Labels</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.literalLabels} 
                            onChange={() => toggleSetting("literalLabels")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Soothing Low-Contrast Canvas</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.soothingCanvas} 
                            onChange={() => toggleSetting("soothingCanvas")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Sequential Progress Checklist</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.sequentialChecklist} 
                            onChange={() => toggleSetting("sequentialChecklist")} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* ADHD Profile Parameters Card */}
                    <div className="bg-white rounded-3xl p-4 border border-[#E9E7E0] shadow-3xs space-y-3">
                      <h3 className="text-xs font-display font-extrabold text-[#7E22CE] flex items-center gap-1.5 uppercase tracking-wider">
                        <span>✨</span> ADHD Profile Parameters
                      </h3>
                      <div className="divide-y divide-[#E9E7E0]/60 text-xs">
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Auditory Chimes enabled</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.auditoryChimes} 
                            onChange={() => toggleSetting("auditoryChimes")} 
                          />
                        </div>
                        <div className="py-2.5 flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">Visual Dopamine Rewards</span>
                          <CustomCheckbox 
                            checked={!!learner.settings.dopamineRewards} 
                            onChange={() => toggleSetting("dopamineRewards")} 
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-3">

                    {/* Language Selector (Bilingual Choice) */}
                    <div className="p-3.5 bg-[#FFF3E0] border border-[#FFE0B2] rounded-2xl flex flex-col gap-2.5 shadow-3xs">
                      <div className="space-y-0.5">
                        <div className="text-xs font-display font-black text-[#E65100] flex items-center gap-1.5">
                          <Languages className="w-4 h-4" /> Wika ng Aralin (App & Lesson Language)
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Piliin ang iyong wika para sa mga paliwanag at gabay ni GETS.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                        {[
                          { code: "tl", flag: "🇵🇭", name: "Taglish" },
                          { code: "en", flag: "🇬🇧", name: "English" },
                          { code: "ceb", flag: "🌴", name: "Bisaya" },
                          { code: "ilo", flag: "🌾", name: "Ilocano" },
                          { code: "hil", flag: "⛵", name: "Hiligaynon" },
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setAppLanguage(lang.code as any);
                              setLessonLanguage(lang.code === "en" ? "en" : "tl");
                            }}
                            className={`px-2 py-1 text-[10px] font-display font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                              appLanguage === lang.code ? "bg-[#FF7F50] text-white shadow-sm" : "text-[#636E72]"
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dyslexia OpenDyslexic Toggle */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl flex items-center justify-between shadow-3xs">
                      <div className="space-y-0.5 pr-2">
                        <div className="text-xs font-display font-bold text-[#2D3436] flex items-center gap-1.5">
                          OpenDyslexic Font Option
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Palakihin ang espasyo at gawing bottom-heavy ang mga letra para mas madaling mabasa.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("dyslexiaFont")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 cursor-pointer transition-colors ${
                          learner.settings.dyslexiaFont ? "bg-[#FF7F50] justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Read aloud toggle */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl flex items-center justify-between shadow-3xs">
                      <div className="space-y-0.5 pr-2">
                        <div className="text-xs font-display font-bold text-[#2D3436]">
                          Boses na Tagapagturo (Read-Aloud Support)
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Awtomatikong magkaroon ng audio narrator sa bawat bagong lesson.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("readAloud")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 cursor-pointer transition-colors ${
                          learner.settings.readAloud ? "bg-[#FF7F50] justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Text highlight toggle */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl flex items-center justify-between shadow-3xs">
                      <div className="space-y-0.5 pr-2">
                        <div className="text-xs font-display font-bold text-[#2D3436]">
                          Highlighting habang binabasa
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Matingkad na kulay sa bawat salita habang sinasalita ng narrator upang gabayan ang mata.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("textHighlighting")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 cursor-pointer transition-colors ${
                          learner.settings.textHighlighting ? "bg-[#FF7F50] justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Siksik na Aralin (ADHD Shorter Lessons) toggle */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl flex items-center justify-between shadow-3xs">
                      <div className="space-y-0.5 pr-2">
                        <div className="text-xs font-display font-bold text-[#2D3436] flex items-center gap-1.5">
                          Siksik-Aralin (ADHD-friendly Micro-lessons)
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Hatiin sa maiikling talata (bite-sized paragraphs) ang aralin para maiwasan ang pagka-bagot.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("shorterLessons")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 cursor-pointer transition-colors ${
                          learner.settings.shorterLessons ? "bg-[#FF7F50] justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Calm Mode / Predictable Layout (Autism-friendly) */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl flex items-center justify-between shadow-3xs">
                      <div className="space-y-0.5 pr-2">
                        <div className="text-xs font-display font-bold text-[#2D3436]">
                          Tahimik na Kaayusan (Autism Calm Mode)
                        </div>
                        <p className="text-[10px] text-[#636E72] leading-snug font-semibold">
                          Bawasan ang mga makikinang na guhit o kumikislap na animation para sa tahimik na focus.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSetting("calmMode")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 cursor-pointer transition-colors ${
                          learner.settings.calmMode ? "bg-[#FF7F50] justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Text Size Slider */}
                    <div className="p-3.5 bg-white border border-[#E9E7E0] rounded-2xl space-y-2 shadow-3xs">
                      <div className="flex justify-between text-xs font-display font-bold text-[#2D3436]">
                        <span>Laki ng Teksto (Text Size)</span>
                        <span className="text-[#E65100] bg-[#FFF3E0] px-2 py-0.5 rounded font-display font-black uppercase text-[9px] border border-[#FFE0B2]">
                          {learner.settings.textSize.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => changeTextSize(sz)}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              learner.settings.textSize === sz
                                ? "bg-[#2D3436] border-[#2D3436] text-white shadow-xs"
                                : "bg-[#FDFCF8] border-[#E9E7E0] text-[#636E72] hover:bg-[#FAF9F5]"
                            }`}
                          >
                            {sz === "sm" ? "A" : sz === "md" ? "A+" : sz === "lg" ? "A++" : "A+++"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Log out / Switch User Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] text-slate-500 font-semibold">Profile: Jasmin (Student)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSelectedScreen("role_select");
                            setRoleSelectStep(1);
                          }}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-display font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-rose-100 flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Lumabas
                        </button>
                        <button
                          onClick={() => {
                            setSelectedScreen("role_select");
                          }}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Switch Role
                        </button>
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      setSelectedScreen("home");
                      setActiveTab("home");
                    }}
                    className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white font-display font-black py-3.5 rounded-2xl text-xs transition-colors cursor-pointer shadow-3xs"
                  >
                    I-SAVE AT MAGPATULOY (Save and Return)
                  </button>
                </div>
              )}

              {/* ==========================================
                  SCREEN 8: PARENT DASHBOARD WEEKLY SUMMARY (NOT A GRADEBOOK)
                  ========================================== */}
              {selectedScreen === "parent" && (() => {
                const activeChildData = childrenState[selectedChildKey];
                
                // Helper to update state safely
                const updateActiveChildData = (updates: Partial<typeof childrenState["Jasmin"]>) => {
                  setChildrenState(prev => ({
                    ...prev,
                    [selectedChildKey]: {
                      ...prev[selectedChildKey],
                      ...updates
                    }
                  }));
                };

                // Helper to toggle bonding quests
                const toggleBondingQuest = (questId: string) => {
                  const currentQuests = activeChildData.completedBondingQuests || [];
                  let updatedQuests: string[];
                  let pointsDiff = 0;

                  if (currentQuests.includes(questId)) {
                    updatedQuests = currentQuests.filter(q => q !== questId);
                    pointsDiff = -25;
                  } else {
                    updatedQuests = [...currentQuests, questId];
                    pointsDiff = 25;
                  }

                  updateActiveChildData({
                    completedBondingQuests: updatedQuests,
                    effortPoints: Math.max(0, activeChildData.effortPoints + pointsDiff)
                  });
                };

                // Helper to handle sending messages to teacher
                const handleSendTeacherMessage = () => {
                  if (!directMessageText.trim()) return;
                  
                  const parentMsg = {
                    sender: "parent",
                    text: directMessageText,
                    time: "Ngayon"
                  };

                  const updatedMessages = [...activeChildData.teacherMessages, parentMsg];
                  updateActiveChildData({ teacherMessages: updatedMessages });
                  setDirectMessageText("");
                  setIsSendingMessage(true);

                  // Simulate responsive, helpful teacher reply after 1 second
                  setTimeout(() => {
                    let teacherReplyText = `Salamat po sa inyong mensahe! Malaking tulong po kung magagawa ninyo ang aming inirekumendang bonding activity sa bahay. Gabay po ito sa kaniyang klase bukas.`;
                    
                    if (activeChildData.needsProfile === "adhd") {
                      teacherReplyText = `Salamat sa inyong suporta, Gng. Alcantara! Dahil po sa inyong gabay sa bahay, nakikita ko pong mas nakakapag-focus si ${activeChildData.name} sa klase sa pamamagitan ng maiikling gawain. Ituloy lang po natin ang paggabay!`;
                    } else if (activeChildData.needsProfile === "dyslexia") {
                      teacherReplyText = `Maraming salamat po! Malaking tulong po ang pagbasa nang sabay sa gabi gamit ang Dyslexia font ng ating app. Napansin ko pong mas tiwala na si ${activeChildData.name} kapag nagbabasa nang malakas sa klase.`;
                    } else if (activeChildData.needsProfile === "autism") {
                      teacherReplyText = `Salamat po sa pakikipag-ugnayan! Masaya po si ${activeChildData.name} sa klase, lalo na kapag walang ingay sa paligid. Ang sensory calm mode po ay malaking tulong sa kaniyang visual tracking.`;
                    }

                    updateActiveChildData({
                      teacherMessages: [...updatedMessages, { sender: "teacher", text: teacherReplyText, time: "Ngayon" }]
                    });
                    setIsSendingMessage(false);
                  }, 1100);
                };

                // Render App Lock numeric keypad if app lock is active and parent hasn't unlocked
                if (activeChildData.appLockEnabled && !isParentPinUnlocked) {
                  return (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md max-w-sm mx-auto text-center space-y-6 animate-fade-in text-[#2D3436]">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-500">
                        <Lock className="w-8 h-8 text-slate-600" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-display font-black text-slate-800">Magulang Portal: Naka-Lock 🔒</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Ipasok ang iyong 4-digit PIN upang ma-access ang mga setting ng magulang. Pinipigilan nito ang mga mag-aaral na baguhin ang mga limitasyon sa pag-aaral o i-disable ang App Lock.
                        </p>
                      </div>
                      
                      {/* Display Dots representing PIN progress */}
                      <div className="flex justify-center gap-3">
                        {[...Array(4)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                              parentPinInput.length > i 
                                ? "bg-[#2ECC71] border-[#2ECC71] scale-110" 
                                : "bg-slate-50 border-slate-300"
                            }`}
                          />
                        ))}
                      </div>

                      {pinError && (
                        <div className="text-[10px] font-bold text-rose-500 bg-rose-50 py-1 px-3 rounded-lg">
                          {pinError}
                        </div>
                      )}

                      {/* Custom Numeric Keypad */}
                      <div className="grid grid-cols-3 gap-2.5 max-w-[190px] mx-auto">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              if (parentPinInput.length < 4) {
                                setParentPinInput(prev => prev + num);
                                setPinError("");
                              }
                            }}
                            className="w-11 h-11 bg-slate-50 hover:bg-slate-100 active:scale-95 text-xs font-black rounded-full flex items-center justify-center cursor-pointer border border-slate-100"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setParentPinInput("");
                            setPinError("");
                          }}
                          className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            if (parentPinInput.length < 4) {
                              setParentPinInput(prev => prev + "0");
                              setPinError("");
                            }
                          }}
                          className="w-11 h-11 bg-slate-50 hover:bg-slate-100 active:scale-95 text-xs font-black rounded-full flex items-center justify-center cursor-pointer border border-slate-100"
                        >
                          0
                        </button>
                        <button
                          onClick={() => {
                            if (parentPinInput === activeChildData.appLockPin) {
                              setIsParentPinUnlocked(true);
                              setParentPinInput("");
                              setPinError("");
                            } else {
                              setPinError("Maling PIN! Subukan muli.");
                              setParentPinInput("");
                            }
                          }}
                          className="text-[9px] font-black uppercase text-[#2ECC71] hover:text-[#27AE60] cursor-pointer"
                        >
                          Enter
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="text-[9px] text-slate-400 font-bold">
                          💡 Default PIN para kay {activeChildData.name}: <span className="font-black text-slate-600">{activeChildData.appLockPin}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedScreen("role_select");
                            setParentPinInput("");
                            setPinError("");
                          }}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-display font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-slate-200"
                        >
                          Bumalik sa Role Selection
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-5">
                    {/* Parent Profile & Header */}
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#2ECC71] flex items-center justify-center font-bold text-lg">
                          👨‍👩‍👧
                        </div>
                        <div>
                          <h2 className="text-xs font-display font-black text-[#0F172A]">Gabay ni {parentProfile.name}</h2>
                          <p className="text-[9px] text-[#64748B] font-display font-black uppercase tracking-wider">{parentProfile.relationship} Portal</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setIsEditingParentProfile(!isEditingParentProfile)}
                        className="px-2.5 py-1.5 bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/20 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                      >
                        {isEditingParentProfile ? "Done" : "Edit Parent Profile"}
                      </button>
                    </div>

                    {/* Profile Edit Mode */}
                    {isEditingParentProfile ? (
                      <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3 animate-fade-in text-[#2D3436]">
                        <div className="text-xs font-display font-display font-black text-slate-800 uppercase tracking-wider">
                          Configure Parent Profile
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Parent Name</label>
                            <input
                              type="text"
                              value={parentProfile.name}
                              onChange={(e) => setParentProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-white border border-[#E2E8F0] text-xs font-semibold p-2 rounded-lg focus:outline-none focus:border-[#2ECC71]"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Relationship</label>
                            <select
                              value={parentProfile.relationship}
                              onChange={(e) => setParentProfile(prev => ({ ...prev, relationship: e.target.value }))}
                              className="w-full bg-white border border-[#E2E8F0] text-xs font-semibold p-2 rounded-lg focus:outline-none focus:border-[#2ECC71]"
                            >
                              <option value="Nanay">Nanay</option>
                              <option value="Tatay">Tatay</option>
                              <option value="Tito">Tito</option>
                              <option value="Tita">Tita</option>
                              <option value="Guardian">Guardian / Lolo / Lola</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsEditingParentProfile(false)}
                          className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-extrabold text-[9px] py-2 rounded-lg uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                        >
                          I-save ang Profile
                        </button>
                      </div>
                    ) : (
                      /* Child Switcher Pills - Highly visual and reactive */
                      <div className="space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                          <span className="text-[9px] font-display font-black text-slate-400 uppercase tracking-wider mr-1 shrink-0">Child Profile:</span>
                          {(["Jasmin", "Maria", "Mark Joseph"] as const).map((key) => {
                            const child = childrenState[key];
                            const isSelected = selectedChildKey === key;
                            return (
                              <button
                                key={key}
                                onClick={() => {
                                  setSelectedChildKey(key);
                                  setCustomInsightAdvice("");
                                  // Lock setting again when switching kids if PIN is enabled
                                  if (childrenState[key].appLockEnabled) {
                                    setIsParentPinUnlocked(false);
                                  }
                                }}
                                className={`px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-all border rounded-full cursor-pointer shrink-0 ${
                                  isSelected
                                    ? "bg-[#2ECC71] text-white border-[#2ECC71] shadow-2xs font-extrabold scale-102"
                                    : "bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50"
                                }`}
                              >
                                <span>{child.avatar}</span>
                                <span>{child.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Portal Navigation Tabs */}
                    <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
                      {(["dashboard", "audit", "teacher", "settings"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setParentTab(tab)}
                          className={`py-1.5 text-[8px] font-display font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            parentTab === tab
                              ? "bg-white text-[#2ECC71] shadow-3xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {tab === "dashboard" && "Dashboard"}
                          {tab === "audit" && "AI Audit"}
                          {tab === "teacher" && "Teacher Connect"}
                          {tab === "settings" && "Locks & settings"}
                        </button>
                      ))}
                    </div>

                    {/* RENDER ACTIVE PORTAL TAB */}
                    {parentTab === "dashboard" && (
                      <div className="space-y-4.5 animate-fade-in text-[#2D3436]">
                        {/* Self-Growth Focus Notice */}
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-start gap-2.5">
                          <div className="text-emerald-600 text-lg">💡</div>
                          <div>
                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wide block">Gabay ni GETS: Self-Growth Focus</span>
                            <p className="text-[10px] text-emerald-700 leading-relaxed font-semibold">
                              This dashboard focuses strictly on <strong>{activeChildData.name}'s individual progress and learning mastery</strong>. It does not compare them to other kids, encouraging a healthy, pressure-free learning environment.
                            </p>
                          </div>
                        </div>

                        {/* Key Metrics row */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-3xs">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Time Spent</div>
                            <div className="text-sm font-display font-black text-[#2ECC71] mt-1">{activeChildData.timeSpent}</div>
                            <div className="text-[7px] font-extrabold text-emerald-600 mt-0.5 leading-tight">{activeChildData.timeSpentCompare}</div>
                          </div>
                          <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-3xs">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Avg Accuracy</div>
                            <div className="text-sm font-display font-black text-indigo-600 mt-1">{activeChildData.avgScore}</div>
                            <div className="text-[7px] font-extrabold text-indigo-500 mt-0.5 leading-tight">{activeChildData.avgScoreCompare}</div>
                          </div>
                          <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl text-center shadow-3xs">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Effort Score</div>
                            <div className="text-sm font-display font-black text-[#FF7675] mt-1">💖 {activeChildData.effortPoints}</div>
                            <div className="text-[7px] font-extrabold text-rose-500 mt-0.5 leading-tight">{activeChildData.streak}-Day Streak Active</div>
                          </div>
                        </div>

                        {/* Weekly Performance Trends */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3.5 shadow-3xs">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-[#2ECC71]" />
                              Learning Velocity (This Week)
                            </h4>
                            <span className="text-[8px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">Personal Trend</span>
                          </div>
                          
                          <div className="flex justify-between items-end h-20 pt-2 px-1 text-center border-b border-slate-100">
                            {activeChildData.dailyPerformance.map((item, idx) => {
                              const pct = item.score;
                              const barHeight = `${pct}%`;
                              return (
                                <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                                  <div className="w-3 bg-slate-50 rounded-t h-full flex items-end">
                                    <div 
                                      className="w-full bg-[#2ECC71] rounded-t transition-all duration-500 group-hover:bg-[#27AE60]" 
                                      style={{ height: barHeight }}
                                    />
                                  </div>
                                  <span className="text-[8px] text-slate-400 mt-1.5 font-bold uppercase">{item.day}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Competency Mastery Timeline (Curriculum Progress) */}
                        <div className="space-y-3 bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-3xs">
                          <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Academic Progress</span>
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide">
                              Grade 7 MATATAG Competency Timeline
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {activeChildData.subjects.map((sub, sIdx) => (
                              <div key={sIdx} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-xs font-bold text-[#0F172A]">{sub.name}</span>
                                    <p className="text-[9px] text-slate-400 font-semibold">
                                      Active Topic: <span className="font-bold text-slate-600">{sub.topic}</span>
                                    </p>
                                  </div>
                                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                    sub.status === "Strong"
                                      ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                                      : sub.status === "Improving"
                                      ? "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]"
                                      : "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
                                  }`}>
                                    {sub.statusTagalog} ({sub.progress}%)
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      sub.status === "Strong" 
                                        ? "bg-[#2ECC71]" 
                                        : sub.status === "Improving" 
                                        ? "bg-indigo-500" 
                                        : "bg-orange-400"
                                    }`}
                                    style={{ width: `${sub.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Parent-Child Bonding Activities (Checklist) */}
                        <div className="bg-[#FFF9F2] border border-[#FFE1C2] rounded-3xl p-4.5 space-y-3.5 shadow-3xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Heart className="w-4 h-4 text-orange-500" />
                              <h4 className="text-xs font-display font-black text-orange-800 uppercase tracking-wide">
                                Suggested Parent-Child Bonding Activities
                              </h4>
                            </div>
                            <p className="text-[10px] text-orange-700 font-semibold leading-relaxed">
                              Kumpletuhin ang mga masasayang aktibidad na ito sa bahay kasama ang anak upang patatagin ang pag-unawa at mag-earn ng <strong>+25 Bonus Puso Points</strong>!
                            </p>
                          </div>

                          <div className="space-y-3">
                            {/* Quest 1 */}
                            <div 
                              onClick={() => toggleBondingQuest("bq1")}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                activeChildData.completedBondingQuests?.includes("bq1")
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-orange-100 text-slate-700 hover:border-orange-300"
                              }`}
                            >
                              <div className="pt-0.5">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  activeChildData.completedBondingQuests?.includes("bq1")
                                    ? "bg-[#2ECC71] border-[#2ECC71] text-white"
                                    : "border-slate-300 bg-white"
                                }`}>
                                  {activeChildData.completedBondingQuests?.includes("bq1") && <Check className="w-3 h-3 stroke-[4]" />}
                                </div>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Filipino Literature • Alamat</span>
                                <div className="text-xs font-bold leading-tight">✨ Bugtungan sa Hapunan (Riddle Night)</div>
                                <p className="text-[10px] leading-relaxed font-semibold text-slate-500 mt-0.5">
                                  Magbahagi ng isang tradisyunal na Filipino riddle (bugtong) habang naghahapunan. Tanungin ang anak kung paano nito inilalarawan ang kapaligiran.
                                </p>
                              </div>
                            </div>

                            {/* Quest 2 */}
                            <div 
                              onClick={() => toggleBondingQuest("bq2")}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                activeChildData.completedBondingQuests?.includes("bq2")
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-orange-100 text-slate-700 hover:border-orange-300"
                              }`}
                            >
                              <div className="pt-0.5">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  activeChildData.completedBondingQuests?.includes("bq2")
                                    ? "bg-[#2ECC71] border-[#2ECC71] text-white"
                                    : "border-slate-300 bg-white"
                                }`}>
                                  {activeChildData.completedBondingQuests?.includes("bq2") && <Check className="w-3 h-3 stroke-[4]" />}
                                </div>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Grammar • Pang-abay</span>
                                <div className="text-xs font-bold leading-tight">🦸‍♂️ Pang-abay na Superhero Challenge</div>
                                <p className="text-[10px] leading-relaxed font-semibold text-slate-500 mt-0.5">
                                  Ipalarawan sa anak ang galaw ng kaniyang paboritong superhero gamit ang pang-abay (hal. "mabilis lumipad", "tapat lumaban").
                                </p>
                              </div>
                            </div>

                            {/* Quest 3 */}
                            <div 
                              onClick={() => toggleBondingQuest("bq3")}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                activeChildData.completedBondingQuests?.includes("bq3")
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-white border-orange-100 text-slate-700 hover:border-orange-300"
                              }`}
                            >
                              <div className="pt-0.5">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  activeChildData.completedBondingQuests?.includes("bq3")
                                    ? "bg-[#2ECC71] border-[#2ECC71] text-white"
                                    : "border-slate-300 bg-white"
                                }`}>
                                  {activeChildData.completedBondingQuests?.includes("bq3") && <Check className="w-3 h-3 stroke-[4]" />}
                                </div>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Writing • Talaarawan</span>
                                <div className="text-xs font-bold leading-tight">📖 Pagsulat ng Maikling Talaarawan</div>
                                <p className="text-[10px] leading-relaxed font-semibold text-slate-500 mt-0.5">
                                  Tulong-tulong na isulat ang 3 pangungusap tungkol sa masayang alaala ng pamilya ngayong araw gamit ang "Una, Kasunod, at Sa huli".
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bonding activities stats counter */}
                          <div className="flex justify-between items-center bg-white/70 py-2 px-3.5 rounded-xl border border-orange-200/40">
                            <span className="text-[10px] font-black text-orange-800">Completed Quests: {(activeChildData.completedBondingQuests || []).length} / 3</span>
                            <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {(activeChildData.completedBondingQuests || []).length === 3 ? "🏆 Mother-Child Bond Perfected!" : "⭐ Keep Bonding!"}
                            </span>
                          </div>
                        </div>

                        {/* ORIGINAL Dynamic Custom AI Generator Box */}
                        <div className="bg-[#FFF8F0] border border-[#FFE0B2] p-4 rounded-3xl space-y-3 shadow-3xs">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#E65100]" />
                            <h4 className="text-xs font-display font-black text-[#E65100] uppercase tracking-wide">
                              Ask GETS AI for Custom Tip (Gemini AI API)
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {activeChildData.insights.map((insight) => (
                              <div key={insight.id} className="bg-white p-3 rounded-xl border border-orange-100/50 space-y-1">
                                <span className="text-[8px] font-extrabold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                                  {insight.category}
                                </span>
                                <div className="text-xs font-bold text-slate-800">{insight.title}</div>
                                <p className="text-[10px] leading-relaxed font-semibold text-slate-600">
                                  {insight.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3.5 border-t border-orange-200/50 space-y-3">
                            <div className="bg-[#FFF] border border-orange-100 p-3 rounded-xl space-y-2.5">
                              <span className="text-[9px] font-black text-[#E65100] uppercase tracking-wider block">
                                Generate Custom Homework Activity with Gemini API:
                              </span>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Filipino Skill</label>
                                  <select
                                    value={customInsightSubject}
                                    onChange={(e) => setCustomInsightSubject(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-[10px] font-semibold p-1.5 rounded-lg focus:outline-none focus:border-[#2ECC71]"
                                  >
                                    <option value="Panitikan">Panitikan (Literature)</option>
                                    <option value="Wika">Wika (Grammar)</option>
                                    <option value="Pagbasa">Pagbasa (Reading)</option>
                                    <option value="Pagsulat">Pagsulat (Writing)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Custom Topic</label>
                                  <input 
                                    type="text"
                                    value={customInsightTopic}
                                    onChange={(e) => setCustomInsightTopic(e.target.value)}
                                    placeholder="e.g. Pang-abay, Sanaysay"
                                    className="w-full bg-slate-50 border border-slate-200 text-[10px] font-semibold p-1.5 rounded-lg focus:outline-none focus:border-[#2ECC71]"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={generateParentAdvice}
                                disabled={isGeneratingCustomInsight || !customInsightTopic}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[9px] py-2 rounded-xl uppercase tracking-wider transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                {isGeneratingCustomInsight ? (
                                  <>
                                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Generating Advice...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Ask GETS AI for Custom Tip</span>
                                  </>
                                )}
                              </button>

                              {customInsightAdvice && (
                                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl space-y-1 animate-fade-in mt-2">
                                  <div className="text-[9px] font-black uppercase text-[#2ECC71] flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#2ECC71]" />
                                    Personalized Advice Generated:
                                  </div>
                                  <p className="text-[10px] font-semibold leading-relaxed">
                                    {customInsightAdvice}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {parentTab === "audit" && (
                      <div className="space-y-4.5 animate-fade-in text-[#2D3436]">
                        {/* Audit explanation and safety check */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-3xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-indigo-500" />
                              Student AI Conversation Logs
                            </h4>
                            <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                              Safety Active
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            Maaari mong siyasatin ang mga naging pag-uusap ni {activeChildData.name} sa kaniyang AI tutor na si GETS. Ginagarantiyahan nitong ligtas at alinsunod sa MATATAG Curriculum ang lahat ng kaniyang binabasa.
                          </p>
                        </div>

                        {/* Log search bar */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={chatSearchQuery}
                            onChange={(e) => setChatSearchQuery(e.target.value)}
                            placeholder="I-filter ang chat history (e.g. Polygon, Alamat)..."
                            className="w-full bg-white border border-slate-200 pl-8.5 pr-4 py-2 text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#2ECC71]"
                          />
                        </div>

                        {/* Audit chat logs visualization */}
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          {(() => {
                            // Merge student's actual active getsChatLog with some helpful preloaded curriculum queries so they can see logs right away
                            const simulatedChildLogs: Record<string, typeof getsChatLog> = {
                              "Jasmin": [
                                { sender: "user", text: "Ano po ba ang pagkakaiba ng Mito at Alamat sa ating panitikan?" },
                                { sender: "gets", text: "Magandang tanong, Jasmin! Ang Mito (Myth) ay tungkol sa mga diyos at kung paano nilikha ang buong mundo. Ang Alamat (Legend) naman ay tungkol sa pinagmulan ng mga partikular na bagay o prutas, tulad ng Alamat ng Pinya, at nagtuturo ng magandang aral." },
                                { sender: "user", text: "Salamat po! Paano naman po ginagamit ang pang-abay na pamanahon?" },
                                { sender: "gets", text: "Ang Pang-abay na Pamanahon ay nagsasaad kung kailan ginawa ang kilos. Halimbawa: 'Kami ay naglaro ng bugtungan *kanina*.' Ang salitang 'kanina' ang pang-abay na pamanahon!" }
                              ],
                              "Maria": [
                                { sender: "user", text: "Bakit po may guhit sa ilalim ng text kapag nagbabasa ako?" },
                                { sender: "gets", text: "Hello Maria! Ang guhit na iyon ay ang ating 'Line Reader' helper. Dinisenyo ito para mas madaling matunton ng iyong mata ang binabasang linya nang hindi nalilito. Nakakatulong ito sa madaling pag-unawa!" },
                                { sender: "user", text: "Ang galing po! Paano po malalaman kung ano ang pormal na wika?" },
                                { sender: "gets", text: "Ang pormal na wika ay ginagamit natin sa paaralan o kapag kausap ang guro at nakatatanda (hal. 'Kumusta po kayo?'). Ang hindi pormal o balbal naman ay ginagamit natin sa kalaro (hal. 'Oat, ngetpa')." }
                              ],
                              "Mark Joseph": [
                                { sender: "user", text: "Paano po malalaman kung Regular Hexagon ang isang polygon?" },
                                { sender: "gets", text: "Magandang hapon, Mark Joseph! Ang hexagon ay may anim (6) na gilid. Upang matawag itong 'Regular Hexagon', dapat ay pantay ang haba ng lahat ng 6 na gilid, at magkakasukat ang lahat ng kaniyang panloob na anggulo." },
                                { sender: "user", text: "Ano po ang ugnayang Mutualism sa aming Science?" },
                                { sender: "gets", text: "Sa Mutualism, parehong nakikinabang ang dalawang organismo! Halimbawa ang bubuyog at bulaklak. Nakakakuha ng pagkain ang bubuyog, at natutulungan naman nito ang bulaklak sa pollination." }
                              ]
                            };

                            // Combine live getsChatLog (if student has chatted during this session) with simulated historical logs
                            // Ignore the default "Welcome" message to filter real user interactions
                            const activeLiveChats = getsChatLog.filter(m => m.text !== "Mabuhay! Ako si GETS, ang iyong AI Study Buddy para sa Grade 7 Filipino/MATATAG program. Sabihin sa akin kung mayroon kang hindi maintindihan sa klase!");
                            const baselineLogs = simulatedChildLogs[selectedChildKey] || [];
                            const combinedLogs = [...activeLiveChats, ...baselineLogs];
                            
                            const filteredLogs = combinedLogs.filter(m => 
                              m.text.toLowerCase().includes(chatSearchQuery.toLowerCase())
                            );

                            if (filteredLogs.length === 0) {
                              return (
                                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-semibold text-[10px]">
                                  Walang nahanap na tugma sa chat audit logs.
                                </div>
                              );
                            }

                            return filteredLogs.map((chat, cIdx) => (
                              <div 
                                key={cIdx} 
                                className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                                  chat.sender === "user" 
                                    ? "bg-slate-50 border-slate-100 text-slate-800" 
                                    : "bg-indigo-50/40 border-indigo-100 text-slate-800"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                    chat.sender === "user" 
                                      ? "bg-slate-200 text-slate-700" 
                                      : "bg-indigo-100 text-indigo-700"
                                  }`}>
                                    {chat.sender === "user" ? `${activeChildData.name} (Student)` : "GETS Assistant (AI)"}
                                  </span>
                                  <span className="text-[7px] text-slate-400 font-bold">Sinuri ng Magulang</span>
                                </div>
                                <p className="leading-relaxed font-semibold">
                                  {chat.text}
                                </p>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {parentTab === "teacher" && (
                      <div className="space-y-4.5 animate-fade-in text-[#2D3436]">
                        {/* Performance updates from school */}
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-3 shadow-3xs">
                          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Users className="w-4 h-4 text-[#2ECC71]" />
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide">
                              Puna mula sa Silid-Aralan (Teacher's Report)
                            </h4>
                          </div>

                          <div className="space-y-2.5">
                            {/* Great performance */}
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1">
                              <span className="text-[8px] font-black text-emerald-700 uppercase tracking-wider block">👍 Ano ang Ginagawang Mahusay sa Eskwela</span>
                              <p className="text-[10px] font-semibold leading-relaxed text-emerald-800">
                                {selectedChildKey === "Jasmin" && "Si Jasmin ay napaka-aktibo sa talakayan tungkol sa mga Alamat at Epiko. Ipinapakita rin niya ang kahusayan sa pakikipagtulungan sa kaniyang mga kaklase sa talakayan ng Geometry (Polygons)."}
                                {selectedChildKey === "Maria" && "Si Maria ay napaka-galang at maingat makinig sa klase. Ang kaniyang mga gawa sa pagsusuri ng mga Ponemang Suprasegmental ay may matataas na marka."}
                                {selectedChildKey === "Mark Joseph" && "Si Mark Joseph ay may pambihirang lohika sa matematika at agham! Napakabilis niyang makatapos ng pagsasanay tungkol sa ugnayang mutualism at ecological balance."}
                              </p>
                            </div>

                            {/* Areas of focus */}
                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-2xl space-y-1">
                              <span className="text-[8px] font-black text-orange-700 uppercase tracking-wider block">⚠️ Ano ang Kailangang Gabayan sa Tahanan</span>
                              <p className="text-[10px] font-semibold leading-relaxed text-orange-800">
                                {selectedChildKey === "Jasmin" && "Medyo nahihirapan po siya sa pagsulat ng maikling talaarawan. Kailangan pa pong gabayan sa tamang paggamit ng mga Pang-ugnay na Panahon (una, pagkatapos)."}
                                {selectedChildKey === "Maria" && "Nangangailangan pa ng kaunting bilis sa pagbasa ng mahahabang talata. Mainam kung sasanayin siya gamit ang Dyslexia font at reader guide sa gabi."}
                                {selectedChildKey === "Mark Joseph" && "Dahil napakabilis niyang matuto, nagiging madali siyang ma-distract kapag walang bagong hamon. Subukang bigyan siya ng Enrichment challenges sa app."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Direct Messenger to Teacher */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-3xs">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Ugnayang Guro at Magulang</span>
                              <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide">
                                Mensahero kay Bb. Corazon Dela Cruz
                              </h4>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-soft-pulse" title="Teacher Active Online" />
                          </div>

                          {/* Chat Box History */}
                          <div className="space-y-2.5 max-h-[180px] overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                            {activeChildData.teacherMessages.map((msg, mIdx) => (
                              <div 
                                key={mIdx} 
                                className={`flex flex-col max-w-[85%] ${
                                  msg.sender === "parent" ? "ml-auto items-end" : "mr-auto items-start"
                                }`}
                              >
                                <span className="text-[7px] text-slate-400 font-bold mb-0.5">{msg.sender === "parent" ? "Ikaw" : "Bb. Corazon (Teacher)"} • {msg.time}</span>
                                <div className={`p-2.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                  msg.sender === "parent"
                                    ? "bg-[#2ECC71] text-white rounded-tr-none"
                                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-3xs"
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={directMessageText}
                              onChange={(e) => setDirectMessageText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleSendTeacherMessage(); }}
                              placeholder="Magtanong o mag-iwan ng mensahe sa Guro..."
                              className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold rounded-xl focus:outline-none focus:border-[#2ECC71]"
                            />
                            <button
                              onClick={handleSendTeacherMessage}
                              disabled={isSendingMessage || !directMessageText.trim()}
                              className="p-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-slate-200 text-white rounded-xl transition-all shadow-3xs cursor-pointer flex items-center justify-center"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {parentTab === "settings" && (
                      <div className="space-y-4 animate-fade-in text-[#2D3436]">
                        {/* Parental Access Control and Locks */}
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-4 shadow-3xs">
                          <div className="space-y-0.5 border-b border-slate-100 pb-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Access Control & Lockouts</span>
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-rose-500" />
                              Parental App Lock & Study Hours
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {/* App Lock Switch */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <div>
                                <span className="text-xs font-bold text-[#0F172A] block">Enable Portal App Lock</span>
                                <span className="text-[8px] text-slate-400 font-semibold leading-tight">Nangangailangan ng PIN upang makapasok sa parent portal</span>
                              </div>
                              <input 
                                type="checkbox"
                                checked={activeChildData.appLockEnabled}
                                onChange={(e) => {
                                  updateActiveChildData({ appLockEnabled: e.target.checked });
                                  setIsParentPinUnlocked(false);
                                }}
                                className="w-4 h-4 text-[#2ECC71] rounded focus:ring-[#2ECC71] accent-[#2ECC71] cursor-pointer"
                              />
                            </div>

                            {/* PIN configuration - conditional */}
                            {activeChildData.appLockEnabled && (
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between animate-fade-in">
                                <div>
                                  <span className="text-xs font-bold text-[#0F172A] block">Set Custom 4-Digit PIN</span>
                                  <span className="text-[8px] text-slate-400 font-semibold">Kasalukuyang ginagamit: <span className="font-bold text-slate-600">{activeChildData.appLockPin}</span></span>
                                </div>
                                <input
                                  type="text"
                                  maxLength={4}
                                  value={activeChildData.appLockPin}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                    if (val.length <= 4) {
                                      updateActiveChildData({ appLockPin: val });
                                    }
                                  }}
                                  className="w-16 bg-white border border-slate-200 text-center font-black p-1.5 rounded-lg text-xs"
                                />
                              </div>
                            )}

                            {/* Study hour goals and screen time goals */}
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-700">Minimum Study Goal (Daily)</span>
                                  <span className="font-black text-[#2ECC71]">{activeChildData.studyHoursLimit} mins</span>
                                </div>
                                <input
                                  type="range"
                                  min={15}
                                  max={120}
                                  step={5}
                                  value={activeChildData.studyHoursLimit}
                                  onChange={(e) => updateActiveChildData({ studyHoursLimit: parseInt(e.target.value) })}
                                  className="w-full accent-[#2ECC71] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-700">Maximum Screen Time Limit</span>
                                  <span className="font-black text-rose-500">{activeChildData.screenTimeLimit} mins</span>
                                </div>
                                <input
                                  type="range"
                                  min={30}
                                  max={180}
                                  step={15}
                                  value={activeChildData.screenTimeLimit}
                                  onChange={(e) => updateActiveChildData({ screenTimeLimit: parseInt(e.target.value) })}
                                  className="w-full accent-rose-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Special Focus Accommodations & Diagnosed check */}
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-4 shadow-3xs">
                          <div className="space-y-0.5 border-b border-slate-100 pb-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Student Accommodation Profiles</span>
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-emerald-500" />
                              Customized Neurodivergent Theme Needs
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">Focus Profile</label>
                                <select
                                  value={activeChildData.needsProfile}
                                  onChange={(e) => updateActiveChildData({ needsProfile: e.target.value as any })}
                                  className="w-full bg-slate-50 border border-slate-200 text-[10px] font-black p-2 rounded-xl focus:outline-none"
                                >
                                  <option value="general">Balanced (Neurotypical)</option>
                                  <option value="adhd">ADHD Active Profile</option>
                                  <option value="autism">Autism Sensory Profile</option>
                                  <option value="dyslexia">Dyslexia Reading Profile</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">Is Child Diagnosed?</label>
                                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                                  <button
                                    onClick={() => updateActiveChildData({ isDiagnosed: true })}
                                    className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                      activeChildData.isDiagnosed 
                                        ? "bg-white text-slate-800 shadow-3xs" 
                                        : "text-slate-500"
                                    }`}
                                  >
                                    Oo
                                  </button>
                                  <button
                                    onClick={() => updateActiveChildData({ isDiagnosed: false })}
                                    className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                      !activeChildData.isDiagnosed 
                                        ? "bg-white text-slate-800 shadow-3xs" 
                                        : "text-slate-500"
                                    }`}
                                  >
                                    Hindi
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* ADVANTAGE CALLOUT BOX based on selection */}
                            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-2.5 text-[#2D3436]">
                              <span className="text-base">💡</span>
                              <div>
                                <span className="text-[8px] font-black text-indigo-700 uppercase tracking-wider block">
                                  {activeChildData.needsProfile === "adhd" && "ADHD Focus Profile Advantage:"}
                                  {activeChildData.needsProfile === "dyslexia" && "Dyslexia Reading Profile Advantage:"}
                                  {activeChildData.needsProfile === "autism" && "Autism Sensory Profile Advantage:"}
                                  {activeChildData.needsProfile === "general" && "Balanced Standard Focus Advantage:"}
                                </span>
                                <p className="text-[9.5px] leading-relaxed font-semibold text-slate-600 mt-0.5">
                                  {activeChildData.needsProfile === "adhd" && "Inaayos ang student learning screen upang hatiin ang aralin sa maiikling sub-blocks at nagdaragdag ng mas mabilis na cycle ng rewards. Binabawasan nito ang focus-fatigue at pinatataas ang lesson completion rate ng hanggang 30%!"}
                                  {activeChildData.needsProfile === "dyslexia" && "Awtomatikong binabago ang font ng aralin sa OpenDyslexic (bottom-weighted spacing) at nagdaragdag ng line-reader highlights. Pinadadali nito ang visual tracking ng mga letra at naiiwasan ang pagkalito sa pagbabasa."}
                                  {activeChildData.needsProfile === "autism" && "Gumagamit ng sensory calm theme na may malalambot na kulay (muted tones), walang mabibilis o kumukurap na mga animation, at pinatatahimik ang lahat ng malalakas o biglaang audio cues upang maiwasan ang sensory overload."}
                                  {activeChildData.needsProfile === "general" && "Nagbibigay ng balanseng multimodal format (pagsasama ng text, visual graphs, at active solving). Mainam ito sa pangkalahatang pag-aaral na nagpapalakas ng lohika at visual recall."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Language Mother Tongue controls */}
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-3 shadow-3xs">
                          <div className="space-y-0.5 border-b border-slate-100 pb-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Language Customization</span>
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <Languages className="w-3.5 h-3.5 text-slate-500" />
                              Mother Tongue & Language Lock
                            </h4>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider">Default Language for Student View</label>
                            <select
                              value={activeChildData.controlledLanguage}
                              onChange={(e) => updateActiveChildData({ controlledLanguage: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 text-[10px] font-black p-2 rounded-xl focus:outline-none"
                            >
                              <option value="tl">Bilingual Tagalog / English (Default)</option>
                              <option value="ceb">Cebuano / Bisaya (Mother Tongue)</option>
                              <option value="en">English Only (International Standard)</option>
                            </select>
                            <span className="text-[8px] text-slate-400 font-bold block leading-relaxed mt-0.5">
                              💡 Ang pagbabago rito ay magla-lock sa wikang gagamitin ng anak sa kaniyang interface upang masanay siya sa mother tongue o wikang itinuturo sa kanilang paaralan.
                            </span>
                          </div>
                        </div>

                        {/* Offline Caching Sync status */}
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-4 shadow-3xs">
                          <div className="space-y-0.5 border-b border-slate-100 pb-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Offline sync engine</span>
                            <h4 className="text-xs font-display font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
                              <Wifi className="w-3.5 h-3.5 text-indigo-500" />
                              Offline Lesson Syncing (Zero-Data Prep)
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <div>
                                <span className="text-xs font-bold text-[#0F172A] block">Auto-Cache Curriculum</span>
                                <span className="text-[8px] text-slate-400 font-semibold leading-tight">Pre-caches all MATATAG units in browser DB for offline school use</span>
                              </div>
                              <input 
                                type="checkbox"
                                checked={activeChildData.offlineSyncEnabled}
                                onChange={(e) => updateActiveChildData({ offlineSyncEnabled: e.target.checked })}
                                className="w-4 h-4 text-[#2ECC71] rounded focus:ring-[#2ECC71] accent-[#2ECC71] cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="flex items-center gap-2.5 text-slate-600">
                                <Wifi className="w-4 h-4 text-[#2ECC71]" />
                                <div>
                                  <span className="text-[10px] font-black text-slate-700 block">Offline Cache Status</span>
                                  <span className="text-[8px] text-slate-400 font-semibold">{activeChildData.offlineSyncEnabled ? `${activeChildData.cachedLessonsCount} Modules Saved (100%)` : "Disabled"}</span>
                                </div>
                              </div>

                              {activeChildData.offlineSyncEnabled && (
                                <button
                                  onClick={() => {
                                    setIsSyncingOffline(true);
                                    setTimeout(() => {
                                      setIsSyncingOffline(false);
                                      updateActiveChildData({ cachedLessonsCount: activeChildData.cachedLessonsCount + 2 });
                                    }, 1200);
                                  }}
                                  disabled={isSyncingOffline}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[8px] uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-indigo-100"
                                >
                                  {isSyncingOffline ? (
                                    <>
                                      <RotateCw className="w-2.5 h-2.5 animate-spin" />
                                      <span>Syncing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <RotateCw className="w-2.5 h-2.5" />
                                      <span>Sync Now</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informative helper note */}
                    <p className="text-[9px] text-center text-slate-400 font-bold leading-relaxed">
                      This parent view does not collect comparative grades to keep learning healthy, focus-friendly, and completely pressure-free.
                    </p>

                    {/* Switch Account action for Parent */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedScreen("role_select");
                        }}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5 shadow-3xs"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        Palitan ang Tungkulin
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ==========================================
                  SCREEN 9: OFFLINE BANNER AND SYNC STATE
                  ========================================== */}
              {selectedScreen === "offline" && (
                <div className="h-full flex flex-col justify-between py-12 items-center text-center">
                  <div />
                  
                  <div className="space-y-4 max-w-[260px] mx-auto">
                    <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto border-2 border-rose-200">
                      <WifiOff className="w-8 h-8 text-rose-500 animate-soft-pulse" />
                    </div>

                    <h2 className="text-xl font-display font-black text-[#2D3436]">
                      Walang Internet Connection
                    </h2>
                    
                    <p className="text-xs font-display font-bold text-[#636E72] leading-snug">
                      Huwag mag-alala! Ang pag-aaral mo ay patuloy pa rin.
                    </p>

                    <div className="p-3.5 bg-[#FFF3E0] rounded-2xl border border-[#FFE0B2] text-xs text-[#333333] leading-relaxed text-left font-semibold">
                      🛡️ <span>Offline Sync at Work:</span> Ang lahat ng nakuhang Puso Points at mga natapos na pagsasanay ay ligtas na naka-imbak sa iyong telepono. Kusang sasabay (auto-sync) ito pag-uwi mo o kapag nagkaroon muli ng signal!
                    </div>
                  </div>

                  <div className="w-full max-w-[250px] space-y-3">
                    <button
                      onClick={() => {
                        // Toggle back online to simulate sync behavior
                        setLearner(prev => ({ ...prev, offlineMode: false }));
                        setSelectedScreen("home");
                      }}
                      className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white font-display font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      Muling Kumonekta (Reconnect)
                    </button>

                    <button
                      onClick={() => {
                        setSelectedScreen("home");
                      }}
                      className="text-xs text-[#636E72] font-display font-black hover:underline cursor-pointer"
                    >
                      Magpatuloy sa pag-aaral Offline
                    </button>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SCREEN 10: TEACHER CO-PILOT DASHBOARD
                  ========================================== */}
              {selectedScreen === "teacher" && (
                <div className="space-y-4 py-2 animate-fade-in">
                  {/* Teacher Profile Card with Edit Capability */}
                  <div className="bg-[#2980B9] text-white p-4 rounded-3xl shadow-md border-b-4 border-[#1F618D] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                    
                    {isEditingTeacherProfile ? (
                      <div className="relative z-10 space-y-3 bg-white/10 p-3 rounded-2xl border border-white/20 animate-fade-in text-white">
                        <div className="text-xs font-display font-black uppercase tracking-wider text-sky-200">
                          Edit Profile Info
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[8px] font-bold text-sky-100 uppercase tracking-wider mb-0.5">Teacher Name</label>
                            <input
                              type="text"
                              value={teacherProfile.name}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-[#1F618D] border border-white/20 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white focus:outline-none focus:border-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-sky-100 uppercase tracking-wider mb-0.5">School Name</label>
                            <input
                              type="text"
                              value={teacherProfile.school}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, school: e.target.value }))}
                              className="w-full bg-[#1F618D] border border-white/20 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white focus:outline-none focus:border-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-sky-100 uppercase tracking-wider mb-0.5">Specialization / Focus</label>
                            <input
                              type="text"
                              value={teacherProfile.specialFocus}
                              onChange={(e) => setTeacherProfile(prev => ({ ...prev, specialFocus: e.target.value }))}
                              className="w-full bg-[#1F618D] border border-white/20 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white focus:outline-none focus:border-white"
                            />
                          </div>
                          
                          {/* SPED / General Ed Toggle */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                            <div>
                              <span className="block text-[9px] font-bold text-white uppercase tracking-wider leading-none">Classroom Mode</span>
                              <span className="text-[8px] text-sky-100 font-semibold block mt-0.5">Class contains SPED / special needs students</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setHasSpedStudents(!hasSpedStudents)}
                              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                                hasSpedStudents ? "bg-emerald-500 flex justify-end" : "bg-sky-900 flex justify-start"
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsEditingTeacherProfile(false)}
                          className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-extrabold text-[9px] py-1.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                        >
                          I-save ang Profile
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white text-[#2980B9] flex items-center justify-center border-2 border-white shadow-sm font-black shrink-0">
                            <GraduationCap className="w-6 h-6 text-[#2980B9]" />
                          </div>
                          <div>
                            <h2 className="text-sm font-display font-black tracking-tight leading-none">
                              {teacherProfile.name}
                            </h2>
                            <p className="text-[10px] text-sky-100 font-bold mt-1">
                              {teacherProfile.school}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className="inline-block bg-[#1F618D] text-white text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border border-[#1b5175]">
                                {teacherProfile.specialFocus}
                              </span>
                              <span className={`inline-block text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                                hasSpedStudents 
                                  ? "bg-amber-500/20 text-amber-200 border-amber-500/30" 
                                  : "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
                              }`}>
                                {hasSpedStudents ? (
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-2.5 h-2.5 text-amber-300 fill-amber-300" /> Inclusive (With SPED)
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-2.5 h-2.5 text-emerald-300" /> Gen-Ed (No SPED)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsEditingTeacherProfile(true)}
                          className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[8px] font-black uppercase tracking-wider border border-white/10 transition-all cursor-pointer shadow-3xs"
                        >
                          Ayusin / Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200 shadow-3xs">
                    <button
                      onClick={() => setTeacherTab("dashboard")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[9px] font-display font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        teacherTab === "dashboard"
                          ? "bg-[#2980B9] text-white shadow-xs"
                          : "text-[#636E72] hover:bg-slate-200 hover:text-[#2D3436]"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Class Dashboard
                    </button>
                    <button
                      onClick={() => setTeacherTab("copilot")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[9px] font-display font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        teacherTab === "copilot"
                          ? "bg-[#2980B9] text-white shadow-xs"
                          : "text-[#636E72] hover:bg-slate-200 hover:text-[#2D3436]"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      GETS AI Assistant
                    </button>
                    <button
                      onClick={() => setTeacherTab("classes")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[9px] font-display font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        teacherTab === "classes"
                          ? "bg-[#2980B9] text-white shadow-xs"
                          : "text-[#636E72] hover:bg-slate-200 hover:text-[#2D3436]"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Classes & Modules
                    </button>
                  </div>

                  {/* CONDITIONAL RENDER BY SELECTED TAB */}
                  {teacherTab === "copilot" ? (
                    <>
                      {/* Sub-tab switcher inside GETS AI Assistant workspace to separate configuration and material output */}
                      {teacherGeneratedContent && (
                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200 shadow-3xs w-full">
                          <button
                            onClick={() => setCopilotSubTab("config")}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-display font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              copilotSubTab === "config"
                                ? "bg-white text-[#2980B9] shadow-2xs border border-slate-200/40"
                                : "text-[#636E72] hover:bg-slate-200"
                            }`}
                          >
                            <Sliders className="w-3 h-3" />
                            Configure & Generate
                          </button>
                          <button
                            onClick={() => setCopilotSubTab("workspace")}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-display font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              copilotSubTab === "workspace"
                                ? "bg-white text-[#2980B9] shadow-2xs border border-slate-200/40"
                                : "text-[#636E72] hover:bg-slate-200"
                            }`}
                          >
                            <FileText className="w-3 h-3" />
                            Review Workspace
                          </button>
                        </div>
                      )}

                      {/* Assistant Configurator Section */}
                      {(copilotSubTab === "config" || !teacherGeneratedContent) && (
                        <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3.5">
                          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Sparkles className="w-4 h-4 text-[#2980B9] animate-pulse" />
                            <h3 className="text-xs font-display font-black text-[#2D3436] uppercase tracking-wider">
                              GETS AI Assistant Workspace
                            </h3>
                          </div>

                          {/* Subject Selector */}
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5">
                              1. Select Subject (Grade 7)
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: "math", label: "Math", topic: "Polygons", icon: Calculator },
                                { id: "science", label: "Science", topic: "Ecological Relationships", icon: FlaskConical },
                                { id: "english", label: "English", topic: "Philippine Literary Genres", icon: BookOpen }
                              ].map((sub) => {
                                const IconComp = sub.icon;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setTeacherSubject(sub.id);
                                      setTeacherTopic(sub.topic);
                                    }}
                                    className={`py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                                      teacherSubject === sub.id
                                        ? "bg-sky-50 text-[#2980B9] border-[#2980B9] shadow-2xs"
                                        : "bg-[#FAF9F5] text-[#636E72] border-[#E9E7E0] hover:bg-slate-50"
                                    }`}
                                  >
                                    <IconComp className="w-3.5 h-3.5" />
                                    {sub.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Topic Input Box */}
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1">
                              2. Topic / Focus (Curriculum Aligned)
                            </label>
                            <input
                              type="text"
                              value={teacherTopic}
                              onChange={(e) => setTeacherTopic(e.target.value)}
                              placeholder={
                                teacherSubject === "math"
                                  ? "e.g., Polygons & Vertices"
                                  : teacherSubject === "science"
                                  ? "e.g., Mutualism vs Parasitism"
                                  : "e.g., Pre-colonial Epics"
                              }
                              className="w-full bg-[#FAF9F5] text-xs font-semibold px-3 py-2 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                            />
                          </div>

                          {/* Asset Type Selector */}
                          <div>
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider mb-1.5 flex justify-between items-center">
                              <span>3. AI Material to Generate</span>
                              <span className="text-[7px] text-[#2980B9] font-black uppercase tracking-wide bg-sky-50 px-1.5 py-0.5 rounded">
                                {hasSpedStudents ? "SPED-Friendly Mode" : "General-Ed Mode"}
                              </span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "lesson_plan", label: "Lesson Plan", icon: FileText },
                                { id: "practice_drills", label: "Practice Drills", icon: Sliders },
                                { id: "quiz_keys", label: "Quiz & Key", icon: Award },
                                { 
                                  id: "diff_struggling", 
                                  label: hasSpedStudents ? "Support (Struggling)" : "Remedial / Foundation",
                                  icon: Heart
                                },
                                { 
                                  id: "diff_advanced", 
                                  label: hasSpedStudents ? "Challenge (Advanced)" : "Enrichment / Extension",
                                  icon: Zap
                                },
                                { id: "parent_bulletin", label: "Parent Bulletin", icon: Users }
                              ].map((asset) => {
                                const IconComp = asset.icon;
                                return (
                                  <button
                                    key={asset.id}
                                    onClick={() => setTeacherAssetType(asset.id)}
                                    className={`py-1.5 px-2.5 rounded-lg text-[9px] font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                                      teacherAssetType === asset.id
                                        ? "bg-sky-50 text-[#2980B9] border-[#2980B9] shadow-2xs"
                                        : "bg-[#FAF9F5] text-[#636E72] border-[#E9E7E0] hover:bg-slate-50"
                                    }`}
                                  >
                                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${teacherAssetType === asset.id ? "text-[#2980B9]" : "text-slate-400"}`} />
                                    <span className="truncate">{asset.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* GETS AI Assistant Custom Instructions & Suggestions */}
                          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E9E7E0] space-y-2">
                            <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider leading-none">
                              Quick Suggestions / Custom Directions
                            </label>
                            <p className="text-[8px] text-slate-400 font-semibold leading-none">
                              Click any suggestion to instantly append, or type your own instructions.
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {[
                                { label: "Bilingual (Taglish)", prompt: "Translate the explanations to natural bilingual Taglish.", icon: Languages },
                                { label: "More local examples", prompt: "Add more real-world examples set in Filipino context.", icon: Search },
                                { label: "Add class game", prompt: "Incorporate a 10-minute active learning game for the whole class.", icon: Sparkles },
                                { label: "Simplify wording", prompt: "Keep vocabulary simple and easy to understand.", icon: Smile },
                                { label: "Add homework", prompt: "Add a short, creative zero-cost homework assignment.", icon: FileText }
                              ].map((sug, sugIdx) => {
                                const SugIcon = sug.icon;
                                return (
                                  <button
                                    key={sugIdx}
                                    type="button"
                                    onClick={() => {
                                      setCustomInstruction(prev => prev ? `${prev} ${sug.prompt}` : sug.prompt);
                                    }}
                                    className="bg-white hover:bg-slate-100 text-slate-700 border border-[#E9E7E0] py-1 px-2 rounded-lg text-[8px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                                  >
                                    <SugIcon className="w-2.5 h-2.5 text-slate-400" />
                                    {sug.label}
                                  </button>
                                );
                              })}
                            </div>

                            <textarea
                              value={customInstruction}
                              onChange={(e) => setCustomInstruction(e.target.value)}
                              placeholder="e.g., Make it 3 paragraphs long, translate technical terms to Tagalog, etc."
                              rows={2}
                              className="w-full bg-white text-xs font-semibold p-2 rounded-xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                            />
                            {customInstruction && (
                              <button
                                type="button"
                                onClick={() => setCustomInstruction("")}
                                className="text-[8px] font-black uppercase text-red-500 hover:underline flex items-center gap-0.5 leading-none"
                              >
                                Clear custom instructions
                              </button>
                            )}
                          </div>

                    {/* Generate Button */}
                    <button
                      onClick={() => generateTeacherAsset(teacherSubject, teacherAssetType, teacherTopic)}
                      disabled={isTeacherLoading}
                      className="w-full bg-[#2980B9] hover:bg-[#21618C] text-white font-display font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-2xs mt-2"
                    >
                      {isTeacherLoading ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          Generating DepEd Materials...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate with GETS AI Assistant
                        </>
                      )}
                    </button>
                  </div>
                )}

                  {/* Workspace Sub-Tab Content */}
                  {copilotSubTab === "workspace" && (
                    <>
                      {/* Status Banner / Feedback */}
                      {teacherApproved && (
                        <div className="bg-[#E8F8F5] border border-[#A2D9CE] text-[#117864] px-3.5 py-3 rounded-2xl flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#117864] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider">Approved & Pushed!</div>
                            <p className="text-[9px] font-semibold mt-0.5 leading-snug">
                              This material has been deployed to the learner dashboard for <strong>Jasmin</strong> and is synced with the parent notification bulletin.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Generation Workspace Result View */}
                      <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3.5 relative min-h-[160px]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-[#2980B9]" />
                            <h4 className="text-xs font-display font-black text-[#2D3436] uppercase tracking-wider">
                              Review & Edit Workspace
                            </h4>
                          </div>
                          
                          {teacherGeneratedContent && !isTeacherLoading && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  if (isTeacherEditing) {
                                    setTeacherGeneratedContent(teacherEditedText);
                                    setIsTeacherEditing(false);
                                  } else {
                                    setTeacherEditedText(teacherGeneratedContent);
                                    setIsTeacherEditing(true);
                                  }
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-lg text-[9px] font-bold cursor-pointer flex items-center gap-1 border border-slate-200 transition-colors"
                              >
                                {isTeacherEditing ? (
                                  <>
                                    <Save className="w-3 h-3" />
                                    Save
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-3 h-3" />
                                    Edit
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(teacherGeneratedContent);
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded-lg cursor-pointer border border-slate-200 transition-colors"
                                title="Copy Markdown"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {isTeacherLoading ? (
                          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2.5">
                            <div className="w-8 h-8 rounded-full border-4 border-[#2980B9]/20 border-t-[#2980B9] animate-spin" />
                            <div className="text-[10px] text-[#636E72] font-black uppercase tracking-wider animate-pulse">
                              {teacherAssetType === "lesson_plan" && "Writing inclusive lesson plan..."}
                              {teacherAssetType === "practice_drills" && "Drafting graded classroom practice..."}
                              {teacherAssetType === "quiz_keys" && "Creating 5-item quiz with answer keys..."}
                              {teacherAssetType === "diff_struggling" && "Refining support for special needs..."}
                              {teacherAssetType === "diff_advanced" && "Designing advanced enrichment challenge..."}
                              {teacherAssetType === "parent_bulletin" && "Formulating parent newsletter bulletin..."}
                            </div>
                            <p className="text-[9px] text-slate-400 font-semibold max-w-[240px] leading-relaxed">
                              Checking DepEd MATATAG Grade 7 guidelines & preparing bilingual text block...
                            </p>
                          </div>
                        ) : teacherGeneratedContent ? (
                          <div className="space-y-3">
                            {isTeacherEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={teacherEditedText}
                                  onChange={(e) => setTeacherEditedText(e.target.value)}
                                  rows={10}
                                  className="w-full bg-[#FAF9F5] text-xs font-mono p-3 rounded-2xl border border-[#E9E7E0] focus:outline-none focus:ring-1 focus:ring-[#2980B9] text-[#2D3436]"
                                />
                                <p className="text-[9px] text-[#636E72] font-semibold leading-relaxed">
                                  💡 You are directly editing the assistant generated content. Press <strong>Save</strong> above to apply.
                                </p>
                              </div>
                            ) : (
                              <div className="prose max-w-none text-xs text-[#2D3436] leading-relaxed font-sans max-h-[300px] overflow-y-auto pr-1">
                                {renderTeacherContent(teacherGeneratedContent)}
                              </div>
                            )}

                            {!isTeacherEditing && (
                              <>
                                <div className="bg-[#EDF2F7] p-3 rounded-2xl border border-slate-200 space-y-2.5 mt-2 text-[#2D3436]">
                                  <div className="flex items-center gap-1 text-[#2980B9]">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-display font-black uppercase tracking-wide">
                                      Smart Refine / Tweak with GETS Assistant
                                    </span>
                                  </div>
                                  <p className="text-[8px] text-slate-500 font-semibold leading-none">
                                    Request changes or click a suggestion to instantly refine this asset:
                                  </p>
                                  <div className="flex gap-1 flex-wrap">
                                    {[
                                      "Shorten this by 30%",
                                      "Add a 3-question short game",
                                      "Translate procedure to Tagalog",
                                      "Use sports examples",
                                      "Add parent advice summary"
                                    ].map((item, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setRefinementPrompt(item)}
                                        className="bg-white hover:bg-slate-50 text-[8px] font-bold text-slate-600 px-2 py-0.5 rounded border border-slate-300 transition-colors cursor-pointer"
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={refinementPrompt}
                                      onChange={(e) => setRefinementPrompt(e.target.value)}
                                      placeholder="e.g., Make the intro fun, simplify the exercises..."
                                      className="flex-1 bg-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none text-slate-800"
                                    />
                                    <button
                                      type="button"
                                      onClick={handleRefineAsset}
                                      disabled={!refinementPrompt.trim() || isTeacherLoading}
                                      className="bg-[#2980B9] hover:bg-[#21618C] text-white text-[9px] font-black px-3 rounded-lg uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                                    >
                                      <Sparkles className="w-3 h-3" />
                                      Refine
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2.5 border-t border-slate-100">
                                  <button
                                    onClick={() => {
                                      setTeacherApproved(true);
                                      // Sync lesson content if approved
                                      if (teacherAssetType === "lesson_plan" && teacherSubject === "math") {
                                        setLessonContent(teacherGeneratedContent);
                                      }

                                      // Automatically assign to the class corresponding to this subject, or activeClassId
                                      const classForSubject = teacherClasses.find(c => c.subject === teacherSubject) || teacherClasses.find(c => c.id === activeClassId) || teacherClasses[0];
                                      if (classForSubject) {
                                        const firstMod = teacherModules.find(m => m.classId === classForSubject.id);
                                        if (firstMod) {
                                          setTeacherModules(prev => prev.map(m => {
                                            if (m.id === firstMod.id) {
                                              const assetTitle = `MATATAG ${teacherAssetType.toUpperCase().replace("_", " ")}: ${teacherTopic || "Properties of Polygons"}`;
                                              const alreadyHas = m.assets.some(a => a.title === assetTitle);
                                              if (alreadyHas) return m;
                                              return {
                                                ...m,
                                                assets: [
                                                  ...m.assets,
                                                  {
                                                    type: teacherAssetType,
                                                    title: assetTitle,
                                                    content: teacherGeneratedContent
                                                  }
                                                ]
                                              };
                                            }
                                            return m;
                                          }));
                                        }
                                      }
                                    }}
                                    className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-display font-black py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs uppercase tracking-wider"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve & Push to Student Module
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <h5 className="text-[11px] font-display font-black text-slate-700 uppercase tracking-wider">
                              Ready for Classroom Design
                            </h5>
                            <p className="text-[9px] text-slate-500 font-semibold max-w-[250px] mx-auto leading-relaxed">
                              Your workspace is empty. Select a subject and click <strong>Generate with GETS AI Assistant</strong> to assemble curriculum assets.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Informative footer */}
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-[9px] text-[#636E72] leading-relaxed font-semibold">
                        <Shield className="w-3.5 h-3.5 text-slate-400 inline mr-1 shrink-0" /> <strong>Curriculum Guardian:</strong> GETS AI serves as your assistant. Every lesson, practice drill, and parent bulletin must be reviewed, edited, and approved by you (the teacher) before being dispatched to Grade 7 learners.
                      </div>
                    </>
                  )}
                </>
              ) : teacherTab === "classes" ? (
                /* ==========================================
                   TEACHER CLASSES & MODULES ORGANIZER TAB
                   ========================================== */
                <div className="space-y-4 animate-fade-in py-1 text-slate-800">
                  {/* Class Selection & Management */}
                  <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <Users className="w-4 h-4 text-[#2980B9]" />
                        <h3 className="text-xs font-display font-black uppercase tracking-wider">
                          Active Classes
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddClass(!showAddClass)}
                        className="bg-sky-50 hover:bg-sky-100 text-[#2980B9] px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 border border-sky-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Add Class
                      </button>
                    </div>

                    {showAddClass && (
                      <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E9E7E0] space-y-2.5 animate-fade-in">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">Add New MATATAG Class</span>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Class Name</label>
                            <input
                              type="text"
                              placeholder="e.g., Grade 7 - Orchid"
                              value={newClassName}
                              onChange={(e) => setNewClassName(e.target.value)}
                              className="w-full bg-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Subject Track</label>
                            <select
                              value={newClassSubject}
                              onChange={(e) => setNewClassSubject(e.target.value)}
                              className="w-full bg-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none"
                            >
                              <option value="math">Mathematics</option>
                              <option value="science">Science</option>
                              <option value="english">English</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (!newClassName.trim()) return;
                              const newId = `class-${Date.now()}`;
                              setTeacherClasses(prev => [
                                ...prev,
                                { id: newId, name: newClassName.trim(), subject: newClassSubject, topic: "Introductions" }
                              ]);
                              setActiveClassId(newId);
                              setNewClassName("");
                              setShowAddClass(false);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black py-1.5 px-3 rounded-lg uppercase tracking-wide cursor-pointer transition-colors"
                          >
                            Add Class
                          </button>
                          <button
                            onClick={() => setShowAddClass(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] font-bold py-1.5 px-2.5 rounded-lg uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {teacherClasses.map((cls) => {
                        const isActive = activeClassId === cls.id;
                        const subjectLabel = cls.subject === "math" ? "Math" : cls.subject === "science" ? "Science" : "English";
                        return (
                          <div
                            key={cls.id}
                            onClick={() => setActiveClassId(cls.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isActive 
                                ? "bg-sky-50/70 border-[#2980B9]" 
                                : "bg-[#FAF9F5]/50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <h4 className="text-xs font-display font-black text-slate-900 leading-none">
                                {cls.name}
                              </h4>
                              <p className="text-[9px] text-[#636E72] font-semibold mt-1 flex items-center gap-1.5">
                                <span>Subject: <strong>{subjectLabel}</strong></span>
                                <span className="text-slate-300">•</span>
                                <span>Topic: <strong>{cls.topic}</strong></span>
                              </p>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                              isActive ? "bg-[#2980B9] text-white border-transparent" : "bg-white text-slate-500 border-slate-200"
                            }`}>
                              {isActive ? "Selected" : "Select"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Modules for the selected Class */}
                  <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <BookOpen className="w-4 h-4 text-[#2980B9]" />
                        <h3 className="text-xs font-display font-black uppercase tracking-wider">
                          Learning Modules
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddModule(!showAddModule)}
                        className="bg-sky-50 hover:bg-sky-100 text-[#2980B9] px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 border border-sky-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Add Module
                      </button>
                    </div>

                    {showAddModule && (
                      <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E9E7E0] space-y-2.5 animate-fade-in">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">Add Module to {teacherClasses.find(c => c.id === activeClassId)?.name}</span>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Module Title</label>
                            <input
                              type="text"
                              placeholder="e.g., Module 3: Types of Angles"
                              value={newModuleName}
                              onChange={(e) => setNewModuleName(e.target.value)}
                              className="w-full bg-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Module Description</label>
                            <textarea
                              placeholder="e.g., Introduces supplementary and complementary angles..."
                              value={newModuleDesc}
                              onChange={(e) => setNewModuleDesc(e.target.value)}
                              rows={2}
                              className="w-full bg-white text-xs font-semibold p-2 rounded-lg border border-slate-300 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (!newModuleName.trim()) return;
                              const newId = `module-${Date.now()}`;
                              setTeacherModules(prev => [
                                ...prev,
                                {
                                  id: newId,
                                  name: newModuleName.trim(),
                                  classId: activeClassId,
                                  description: newModuleDesc.trim() || "No description provided.",
                                  assets: []
                                }
                              ]);
                              setNewModuleName("");
                              setNewModuleDesc("");
                              setShowAddModule(false);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black py-1.5 px-3 rounded-lg uppercase tracking-wide cursor-pointer transition-colors"
                          >
                            Add Module
                          </button>
                          <button
                            onClick={() => setShowAddModule(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] font-bold py-1.5 px-2.5 rounded-lg uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3.5">
                      {teacherModules.filter(m => m.classId === activeClassId).length === 0 ? (
                        <div className="py-6 text-center text-slate-400">
                          <BookOpen className="w-8 h-8 mx-auto stroke-1 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider block">No Modules Created</span>
                          <p className="text-[8px] max-w-[200px] mx-auto mt-0.5 leading-normal">
                            Create your first module for this class using the "Add Module" button above.
                          </p>
                        </div>
                      ) : (
                        teacherModules.filter(m => m.classId === activeClassId).map((mod) => (
                          <div key={mod.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-[11px] font-display font-black text-[#2D3436]">
                                  {mod.name}
                                </h5>
                                <p className="text-[9px] text-[#636E72] font-semibold mt-0.5">
                                  {mod.description}
                                </p>
                              </div>
                              <span className="text-[8px] bg-[#EAF2F8] text-[#2980B9] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-sky-100">
                                {mod.assets.length} {mod.assets.length === 1 ? "Asset" : "Assets"}
                              </span>
                            </div>

                            {/* Assets Pushed list */}
                            <div className="space-y-1 pt-1.5 border-t border-slate-200/60">
                              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Pushed AI Lessons & Assets</span>
                              
                              {mod.assets.length === 0 ? (
                                <p className="text-[8px] text-slate-400 font-bold leading-normal italic py-1">
                                  No assets stored inside this module. Use the "GETS AI Assistant" tab to generate and push inclusive lesson plans, drills, or quizzes here!
                                </p>
                              ) : (
                                <div className="space-y-1">
                                  {mod.assets.map((ast, astIdx) => (
                                    <div key={astIdx} className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center text-[#2980B9]">
                                          {ast.type === "lesson_plan" ? (
                                            <FileText className="w-3 h-3" />
                                          ) : ast.type === "practice_drills" ? (
                                            <Sliders className="w-3 h-3" />
                                          ) : (
                                            <Award className="w-3 h-3" />
                                          )}
                                        </div>
                                        <div>
                                          <span className="text-[9px] font-black text-slate-800 block leading-tight">{ast.title}</span>
                                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">{ast.type.replace("_", " ")}</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setTeacherGeneratedContent(ast.content);
                                          setTeacherTab("copilot");
                                        }}
                                        className="bg-sky-50 hover:bg-sky-100 text-[#2980B9] border border-sky-100 text-[8px] font-black uppercase px-2 py-1 rounded-lg cursor-pointer transition-colors"
                                      >
                                        Inspect / Edit
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ==========================================
                   TEACHER DASHBOARD TAB (CLASSROOM ANALYTICS)
                   ========================================== */
                <div className="space-y-4 animate-fade-in py-1">
                  {selectedDashboardStudent === null ? (
                    <>
                      {/* Analytics Summary Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-3.5 rounded-2xl border border-[#E9E7E0] shadow-3xs flex items-center gap-2.5">
                          <div className="p-2 bg-sky-50 text-[#2980B9] rounded-xl border border-sky-100">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-display font-black text-[#2D3436]">32</div>
                            <div className="text-[8px] text-[#636E72] font-black uppercase tracking-wider">Learners (Grade 7)</div>
                          </div>
                        </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E9E7E0] shadow-3xs flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-[#2ECC71] rounded-xl border border-emerald-100">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-display font-black text-[#2D3436]">84%</div>
                        <div className="text-[8px] text-[#636E72] font-black uppercase tracking-wider">Avg Mastery</div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E9E7E0] shadow-3xs flex items-center gap-2.5">
                      <div className="p-2 bg-amber-50 text-[#F1C40F] rounded-xl border border-amber-100">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-display font-black text-[#2D3436]">4 Active</div>
                        <div className="text-[8px] text-[#636E72] font-black uppercase tracking-wider">SPED Configs</div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E9E7E0] shadow-3xs flex items-center gap-2.5">
                      <div className="p-2 bg-rose-50 text-[#E74C3C] rounded-xl border border-rose-100">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-display font-black text-[#2D3436]">28 / 32</div>
                        <div className="text-[8px] text-[#636E72] font-black uppercase tracking-wider">Parent Synced</div>
                      </div>
                    </div>
                  </div>

                  {/* Student Directory Panel */}
                  <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#2980B9]" />
                        <h3 className="text-xs font-display font-black text-[#2D3436] uppercase tracking-wider">
                          Grade 7-Sampaguita Directory
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {[
                        {
                          name: "Jasmin",
                          avatar: "👧",
                          style: "ADHD / Visual",
                          mastery: 88,
                          streak: 12,
                          points: 410,
                          isReal: true
                        },
                        {
                          name: "Mark Joseph",
                          avatar: "👦",
                          style: "Dyscalculia / Kinesthetic",
                          mastery: 72,
                          streak: 6,
                          points: 180,
                          isReal: false
                        },
                        {
                          name: "Maria Clara",
                          avatar: "👧",
                          style: "Gifted / Auditory",
                          mastery: 96,
                          streak: 15,
                          points: 590,
                          isReal: false
                        },
                        {
                          name: "Gabriel",
                          avatar: "👦",
                          style: "Hearing Impaired / Visual",
                          mastery: 82,
                          streak: 8,
                          points: 240,
                          isReal: false
                        }
                      ].map((st) => {
                        const isSelected = selectedDashboardStudent === st.name;
                        return (
                          <button
                            key={st.name}
                            onClick={() => setSelectedDashboardStudent(st.name)}
                            className={`w-full p-2.5 text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#FFF3E0]/15 border-[#FF7F50] ring-1 ring-[#FF7F50]/15"
                                : "bg-white border-[#E9E7E0] hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base p-1 bg-[#FAF9F5] border border-[#E9E7E0] rounded-lg shrink-0">{st.avatar}</span>
                              <div>
                                <h4 className="text-[11px] font-display font-black text-[#2D3436] flex items-center gap-1.5 leading-none">
                                  {st.name}
                                  {st.isReal && (
                                    <span className="text-[7px] bg-[#FFF3E0] text-[#E65100] px-1.5 py-0.5 rounded-xs font-black uppercase">
                                      Active
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[8px] text-[#636E72] font-semibold block mt-0.5 leading-none">{st.style}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-display font-black text-[#2D3436]">{st.mastery}%</div>
                              <span className="text-[7px] text-slate-400 font-bold uppercase leading-none">Mastery</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Back button and quick picker */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedDashboardStudent(null)}
                        className="flex items-center gap-1 text-[10px] font-black text-[#2980B9] hover:text-[#1F618D] uppercase tracking-wider bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Directory
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {["Jasmin", "Mark Joseph", "Maria Clara", "Gabriel"].map(nm => (
                          <button
                            key={nm}
                            onClick={() => setSelectedDashboardStudent(nm)}
                            className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border transition-colors ${
                              selectedDashboardStudent === nm 
                                ? "bg-[#2980B9] text-white border-transparent"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {nm.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Student Inspection Card */}
                  <div className="bg-white p-4 rounded-3xl border border-[#E9E7E0] shadow-2xs space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-[#2980B9]" />
                        <h3 className="text-xs font-display font-black text-[#2D3436] uppercase tracking-wider">
                          {selectedDashboardStudent}'s Plan & Diagnosis
                        </h3>
                      </div>
                      <span className="text-[8px] bg-sky-50 text-[#2980B9] border border-sky-100 px-2 py-0.5 rounded-full uppercase font-black">
                        Interactive Plan
                      </span>
                    </div>

                    {/* Screening insights info block */}
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="text-[9px] font-black uppercase tracking-wider text-[#636E72] flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-[#2980B9]" />
                        Cognitive Screening Summary
                      </div>
                      <p className="text-[10px] text-[#333333] font-semibold mt-1 leading-relaxed">
                        {selectedDashboardStudent === "Jasmin" && "Requires highly-visual, game-like rewards (Puso Points). Displays ADHD/micro-attention patterns. Responsive to text-guideline rulers and spoken Taglish-bilingual narration."}
                        {selectedDashboardStudent === "Mark Joseph" && "Exhibits dyscalculia traits. Hard to parse raw equations. Excels with spatial and flowered items tracking count. Best when math drills utilize concrete objects."}
                        {selectedDashboardStudent === "Maria Clara" && "Bilingual gifted scholar with accelerated speech recognition outputs. Requires advanced DepEd MATATAG enrichment lessons with deep literature questions."}
                        {selectedDashboardStudent === "Gabriel" && "Hearing impaired visual scholar. Relies 100% on highlighted typography and clean color contrast panels. Font size should be set to Large."}
                      </p>
                    </div>

                    {/* Dynamic Accommodations Control panel */}
                    <div className="space-y-2.5">
                      <label className="block text-[9px] font-black text-[#636E72] uppercase tracking-wider">
                        Active Accommodations (Auto-Syncs Settings)
                      </label>

                      <div className="space-y-1.5">
                        {/* Toggle 1: Dyslexia Friendly font */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] font-display font-black text-[#2D3436] block">Dyslexia-Friendly Typography</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Applies a clean, high-readability weighted typeface.</span>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedDashboardStudent) {
                                setStudentSettings(prev => {
                                  const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                  return {
                                    ...prev,
                                    [selectedDashboardStudent]: { ...cur, dyslexiaFont: !cur.dyslexiaFont }
                                  };
                                });
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              (selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.dyslexiaFont)
                                ? "bg-[#2980B9] flex justify-end"
                                : "bg-slate-200 flex justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>

                        {/* Toggle 2: Bilingual Read Aloud */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] font-display font-black text-[#2D3436] block">Bilingual Audio Read-Aloud</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Synthesizes explanation voices with word highlights.</span>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedDashboardStudent) {
                                setStudentSettings(prev => {
                                  const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                  return {
                                    ...prev,
                                    [selectedDashboardStudent]: { ...cur, readAloud: !cur.readAloud }
                                  };
                                });
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              (selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.readAloud)
                                ? "bg-[#2980B9] flex justify-end"
                                : "bg-slate-200 flex justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>

                        {/* Toggle 3: Text Highlighting guide */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] font-display font-black text-[#2D3436] block">Visual Highlight Guidelines</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Adds focused rulers and high-contrast block tracking.</span>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedDashboardStudent) {
                                setStudentSettings(prev => {
                                  const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                  return {
                                    ...prev,
                                    [selectedDashboardStudent]: { ...cur, textHighlighting: !cur.textHighlighting }
                                  };
                                });
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              (selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.textHighlighting)
                                ? "bg-[#2980B9] flex justify-end"
                                : "bg-slate-200 flex justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>

                        {/* Toggle 4: Shorter lessons */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] font-display font-black text-[#2D3436] block">Micro-Lesson Intervals (ADHD support)</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Paces curriculum into 2-minute bite-sized parts.</span>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedDashboardStudent) {
                                setStudentSettings(prev => {
                                  const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                  return {
                                    ...prev,
                                    [selectedDashboardStudent]: { ...cur, shorterLessons: !cur.shorterLessons }
                                  };
                                });
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              (selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.shorterLessons)
                                ? "bg-[#2980B9] flex justify-end"
                                : "bg-slate-200 flex justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>

                        {/* Toggle 5: Calm Focused mode UI */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] font-display font-black text-[#2D3436] block">Calm Focused Screen Mode</span>
                            <span className="text-[8px] text-slate-400 font-bold block">Hides background sparkles and reduces motion effects.</span>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedDashboardStudent) {
                                setStudentSettings(prev => {
                                  const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                  return {
                                    ...prev,
                                    [selectedDashboardStudent]: { ...cur, calmMode: !cur.calmMode }
                                  };
                                });
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                              (selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.calmMode)
                                ? "bg-[#2980B9] flex justify-end"
                                : "bg-slate-200 flex justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>
                        </div>

                        {/* Text Size Slider/Selector */}
                        <div className="p-2.5 rounded-xl border border-[#E9E7E0] bg-[#FAF9F5]/50 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-display font-black text-[#2D3436]">Screen Text Scale</span>
                            <span className="text-[8px] font-black uppercase text-[#2980B9]">
                              {selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.textSize}
                            </span>
                          </div>
                          <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
                            {["sm", "md", "lg"].map((sz) => {
                              const isActive = selectedDashboardStudent && studentSettings[selectedDashboardStudent]?.textSize === sz;
                              return (
                                <button
                                  key={sz}
                                  onClick={() => {
                                    if (selectedDashboardStudent) {
                                      setStudentSettings(prev => {
                                        const cur = prev[selectedDashboardStudent] || { dyslexiaFont: false, readAloud: false, textHighlighting: false, shorterLessons: false, calmMode: false, textSize: "md" };
                                        return {
                                          ...prev,
                                          [selectedDashboardStudent]: { ...cur, textSize: sz as any }
                                        };
                                      });
                                    }
                                  }}
                                  className={`flex-1 text-[9px] font-display font-black py-1 rounded-md capitalize transition-all cursor-pointer ${
                                    isActive ? "bg-[#2980B9] text-white shadow-xs" : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Informative footer */}
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-[9px] text-[#636E72] leading-relaxed font-semibold">
                    <Sliders className="w-3.5 h-3.5 text-[#2980B9] inline mr-1 shrink-0" /> <strong>Accommodations Engine:</strong> Adjusting controls above instantly propagates settings to the student's active session, adapting typography, read-aloud cues, and sensory focus rules in real-time.
                  </div>
                </>
              )}
            </div>
          )}

              {/* Switch Account action for Teacher */}
              <div className="pt-3.5 border-t border-slate-100 flex flex-col items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedScreen("role_select");
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Switch Role
                </button>
              </div>
            </div>
          )}
        </div>

            {/* 3. MOCK PHONE BOTTOM NAVIGATION BAR */}
            {selectedScreen !== "splash" && selectedScreen !== "role_select" && selectedScreen !== "onboarding" && selectedScreen !== "teacher" && selectedScreen !== "parent" && (
              <div className="h-16 bg-[#FAF9F5] border-t border-[#E9E7E0] px-6 flex justify-between items-center text-center select-none z-30 shrink-0">
                
                <button
                  onClick={() => {
                    setSelectedScreen("home");
                    setActiveTab("home");
                  }}
                  className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    activeTab === "home" && selectedScreen !== "parent" && selectedScreen !== "settings"
                      ? "text-[#FF7F50] scale-105"
                      : "text-[#636E72] hover:text-[#2D3436]"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-display font-black uppercase tracking-wide">Home</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedScreen("lesson");
                    setActiveTab("learn");
                  }}
                  className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    activeTab === "learn"
                      ? "text-[#FF7F50] scale-105"
                      : "text-[#636E72] hover:text-[#2D3436]"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-[10px] font-display font-black uppercase tracking-wide">Learn</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedScreen("game");
                    setActiveTab("game");
                  }}
                  className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    activeTab === "game" || selectedScreen === "game"
                      ? "text-[#FF7F50] scale-105"
                      : "text-[#636E72] hover:text-[#2D3436]"
                  }`}
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span className="text-[10px] font-display font-black uppercase tracking-wide">Laro</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedScreen("rewards");
                    setActiveTab("rewards");
                  }}
                  className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    activeTab === "rewards"
                      ? "text-[#FF7F50] scale-105"
                      : "text-[#636E72] hover:text-[#2D3436]"
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span className="text-[10px] font-display font-black uppercase tracking-wide">Rewards</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedScreen("settings");
                    setActiveTab("profile");
                  }}
                  className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    activeTab === "profile" || selectedScreen === "settings"
                      ? "text-[#FF7F50] scale-105"
                      : "text-[#636E72] hover:text-[#2D3436]"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px] font-display font-black uppercase tracking-wide">SPED</span>
                </button>

              </div>
            )}

            {/* GETS AI Tutor Floating Mascot Bubble */}
            {selectedScreen !== "splash" && selectedScreen !== "role_select" && selectedScreen !== "onboarding" && (
              <button
                onClick={() => setIsGetsChatOpen(true)}
                className="absolute bottom-20 right-4 w-12 h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-40 cursor-pointer hover:scale-110 transition-transform active:scale-95 group animate-bounce"
                title="Ask GETS AI Tutor"
                id="gets-floating-bubble"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF7F50] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  GETS
                </span>
              </button>
            )}

            {/* GETS AI Chat Panel Overlay */}
            {isGetsChatOpen && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col justify-between p-4 rounded-[38px] transition-all font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E9E7E0] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-lg shadow-3xs">
                      🎓
                    </div>
                    <div>
                      <div className="text-xs font-display font-black text-[#2D3436] flex items-center gap-1">
                        GETS AI Tutor <span className="bg-[#2E7D32] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
                      </div>
                      <p className="text-[9px] text-[#636E72] font-semibold">
                        MATATAG Companion • Grade 7
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsGetsChatOpen(false);
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 text-[#636E72] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Message log area */}
                <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                  {getsChatLog.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[8px] font-bold text-[#636E72] mb-0.5 uppercase tracking-wider px-1">
                        {msg.sender === "user" ? "Jasmin" : "🎓 GETS AI"}
                      </span>
                      <div className={`flex items-end gap-1.5 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div
                          className={`rounded-2xl p-3 text-xs leading-relaxed font-medium shadow-3xs ${
                            msg.sender === "user"
                              ? "bg-[#FF7F50] text-white rounded-tr-none"
                              : "bg-[#F4F1EA] text-[#2D3436] rounded-tl-none border border-[#E9E7E0]"
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.sender === "gets" && (
                          <button
                            type="button"
                            onClick={() => speakText(msg.text, "tl")}
                            className={`p-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                              currentlySpeakingText === msg.text
                                ? "bg-rose-500 text-white animate-soft-pulse"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                            }`}
                            title="Basahin nang Malakas / Read Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isGetsLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-[#636E72] font-semibold italic pl-1">
                      <span className="animate-spin text-[#2E7D32]">🔄</span> Nag-iisip si GETS...
                    </div>
                  )}
                </div>

                {/* Suggestion tags for current subject */}
                <div className="pb-2 border-t border-[#E9E7E0] pt-2.5">
                  <span className="text-[8px] font-black text-[#636E72] uppercase tracking-wider block mb-1.5">
                    💡 Mabilis na Tanong (Quick Inquiries):
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {activeSubject.id === "math" && (
                      <>
                        <button
                          onClick={() => handleSendGetsQuery("Ano ang polygon?")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          ❓ Ano ang polygon?
                        </button>
                        <button
                          onClick={() => handleSendGetsQuery("Bakit hindi polygon ang bilog?")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          🍕 Bakit hindi polygon ang bilog?
                        </button>
                        <button
                          onClick={() => handleSendGetsQuery("Worked example of Decagon")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          📝 Worked example
                        </button>
                      </>
                    )}
                    {activeSubject.id === "science" && (
                      <>
                        <button
                          onClick={() => handleSendGetsQuery("Ano ang Mutualism?")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          🤝 Ano ang Mutualism?
                        </button>
                        <button
                          onClick={() => handleSendGetsQuery("Ano ang Parasitism?")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          🦟 Ano ang Parasitism?
                        </button>
                      </>
                    )}
                    {activeSubject.id === "english" && (
                      <>
                        <button
                          onClick={() => handleSendGetsQuery("What is a Philippine Epic?")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          🗡️ What is an Epic?
                        </button>
                        <button
                          onClick={() => handleSendGetsQuery("Difference between Myth and Legend")}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          🍍 Myth vs Legend
                        </button>
                      </>
                    )}
                    {activeSubject.id !== "math" && activeSubject.id !== "science" && activeSubject.id !== "english" && (
                      <>
                        <button
                          onClick={() => handleSendGetsQuery(`Explain Grade 7 ${activeSubject.name}`)}
                          className="bg-white hover:bg-slate-50 border border-[#E9E7E0] text-[9px] font-bold text-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                        >
                          📖 Explain current topic
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Input area */}
                <div className="flex gap-1.5 items-center pt-2 border-t border-[#E9E7E0]">
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isSpeechListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32]"
                    }`}
                    title={isSpeechListening ? "Listening..." : "Speak question"}
                  >
                    {isSpeechListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={getsQuery}
                      onChange={(e) => setGetsQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendGetsQuery(getsQuery);
                      }}
                      placeholder={
                        isSpeechListening
                          ? "Nakinig si GETS... Magsalita na"
                          : "Magtanong kay GETS..."
                      }
                      className="w-full text-xs font-semibold bg-[#F4F1EA] border border-[#E9E7E0] rounded-xl py-2.5 pl-3.5 pr-8 text-[#2D3436] placeholder-[#636E72] focus:outline-none focus:ring-1 focus:ring-[#FF7F50] focus:bg-white"
                      disabled={isSpeechListening}
                    />
                    <button
                      onClick={() => handleSendGetsQuery(getsQuery)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#FF7F50] hover:text-[#e2693c] cursor-pointer"
                      disabled={!getsQuery.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Listening visual feedback bar */}
                {isSpeechListening && (
                  <div className="text-[10px] text-center font-display font-black text-rose-500 animate-pulse mt-1.5 bg-rose-50 py-1 rounded-lg">
                    🔴 NAKIKINIG: Magsalita na po sa microphone...
                  </div>
                )}
              </div>
            )}

          </div>

          {/* HOME BUTTON CHASSIS BAR */}
          <div className="h-5 w-full flex items-center justify-center bg-[#F4F1EA]">
            <div className="w-28 h-1 bg-[#2D3436] rounded-full opacity-60" />
          </div>

        </div>
      </div>
      
    </div>
  );
}
