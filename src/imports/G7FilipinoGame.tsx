import React, { useState, useEffect } from "react";
import {
  Swords,
  Heart,
  Sparkles,
  Trophy,
  ArrowLeft,
  Play,
  Volume2,
  VolumeX,
  Award,
  BookOpen,
  HelpCircle,
  Zap,
  CheckCircle,
  ArrowRight,
  User,
  Star,
  RefreshCw,
  Flame
} from "lucide-react";
import { LearnerState } from "../types";

// --- Custom Web Audio API Synthesizer ---
// Generates beautiful retro game sounds without needing external mp3 files.
const playSound = (type: "correct" | "wrong" | "victory" | "hit" | "click") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "correct") {
      // Happy major chord arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.15);
      });
    } else if (type === "hit") {
      // Noise/explosion-like sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "wrong") {
      // Low buzzer
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "victory") {
      // Epic melody
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.2);
      });
    }
  } catch (e) {
    console.warn("Web Audio not allowed or failed to play:", e);
  }
};

// --- Game Interfaces ---
export interface G7FilipinoGameProps {
  learner: LearnerState;
  onUpdatePoints: (pointsToAdd: number) => void;
  onBackToDashboard: () => void;
  selectedChildKey: string;
  updateParentDashboard: (questId: string, pointsEarned: number) => void;
}

// --- Riddle Arena Bugtong Data ---
interface BugtongRiddle {
  id: string;
  riddle: string;
  options: string[];
  correctIdx: number;
  hint: string;
  explanation: string;
}

const BUGTONG_RIDDLES: BugtongRiddle[] = [
  {
    id: "r1",
    riddle: "Isang butil ng palay, sakop ang buong bahay. 🏠",
    options: ["Bigas", "Ilaw (Kandila/Bumbilya)", "Bubong", "Unan"],
    correctIdx: 1,
    hint: "Nagbibigay ito ng liwanag kapag madilim ang paligid.",
    explanation: "Mahusay! Ang ilaw (bumbilya o kandila) ay mistulang maliit na butil ng palay ngunit kayang punuin ng liwanag ang buong kuwarto!"
  },
  {
    id: "r2",
    riddle: "Bumili ako ng alipin, mas mataas pa sa akin. 🎩",
    options: ["Payong", "Sumbrero", "Sapatos", "Hagdan"],
    correctIdx: 1,
    hint: "Isinusuot mo ito sa iyong ulo para maprotektahan ka sa araw.",
    explanation: "Tumpak! Ang sumbrero ay isinusuot sa tuktok ng ulo, kaya kahit 'alipin' mo (binili mo), mas mataas pa rin ito sa iyo!"
  },
  {
    id: "r3",
    riddle: "Dala mo, dala ka; dala ka ng iyong dala. 👟",
    options: ["Sapatos (o Tsinelas)", "Bag", "Bisikleta", "Pera"],
    correctIdx: 0,
    hint: "Ito ang pumoprotekta sa iyong talampakan habang naglalakad.",
    explanation: "Napakagaling! Ang sapatos o tsinelas ay dinadala mo (suot mo), ngunit sila rin ang nagdadala sa iyo saan ka man magpunta!"
  },
  {
    id: "r4",
    riddle: "May pakpak walang balahibo, may mukha walang mata. 🪁",
    options: ["Paruparo", "Eroplano", "Saranggola", "Guryon"],
    correctIdx: 2,
    hint: "Nilalaro ito sa malawak na bukid gamit ang tali at hangin.",
    explanation: "Aba, napakahusay! Ang saranggola ay may pakpak (para lumipad) ngunit walang balahibo, at may mukha (ang disenyo nito) kahit walang totoong mga mata!"
  },
  {
    id: "r5",
    riddle: "Walang dila, walang bibig, ngunit nagbibigay ng matunog na tinig. 🔔",
    options: ["Kampana / Batingaw", "Radyo", "Gitara", "Sipol"],
    correctIdx: 0,
    hint: "Madalas itong marinig sa simbahan o paaralan kapag oras na.",
    explanation: "Tumpak! Ang kampana ay walang sariling dila o bibig ngunit gumagawa ng napakalakas na tunog kapag niyanig!"
  }
];

// --- Grammar Cards Data ---
interface GrammarStage {
  question: string;
  instruction: string;
  correctOrder: string[];
  cards: string[];
}

const GRAMMAR_STAGES: GrammarStage[] = [
  {
    question: "Paano tumakbo si Juan Dalisay?",
    instruction: "Gamitin ang Pang-abay na Pamaraan (Mabilis)",
    correctOrder: ["Si Juan Dalisay ay", "mabilis na", "tumakbo sa bukid."],
    cards: ["mabilis na", "tumakbo sa bukid.", "Si Juan Dalisay ay"]
  },
  {
    question: "Kailan isinulat ang magandang alamat?",
    instruction: "Gamitin ang Pang-abay na Pamanahon (Kaninang umaga)",
    correctOrder: ["Kaninang umaga,", "isinulat ni Maria", "ang bagong alamat."],
    cards: ["ang bagong alamat.", "isinulat ni Maria", "Kaninang umaga,"]
  },
  {
    question: "Saan nag-aral ng bugtungan ang magkaibigan?",
    instruction: "Gamitin ang Pang-abay na Panlunan (Sa silid-aklatan)",
    correctOrder: ["Nag-aral ang magkaibigan", "ng mga bugtong", "sa silid-aklatan."],
    cards: ["sa silid-aklatan.", "Nag-aral ang magkaibigan", "ng mga bugtong"]
  }
];

// --- Speed Sprint (Bilis-Isip Challenge) Data ---
interface SprintQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  translation: string;
}

const SPRINT_QUESTIONS: SprintQuestion[] = [
  {
    question: "Ano ang kahulugan ng 'Ponemang Suprasegmental'?",
    options: ["Tono, diin, at antala", "Pangngalan at Panghalip", "Alamat ng bayan", "Mabilis na pagbasa"],
    correctIdx: 0,
    translation: "What is the meaning of 'Suprasegmental Phoneme'?"
  },
  {
    question: "Alin ang angkop na Pang-abay na Pamaraan?",
    options: ["Dahan-dahang lumakad si Maria", "Bukas darating si Tatay", "Sa paaralan sila nag-aral", "Una, pangalawa, at ikatlo"],
    correctIdx: 0,
    translation: "Which is the correct Adverb of Manner?"
  },
  {
    question: "Ano ang kasingkahulugan ng 'Pumailanlang'?",
    options: ["Lumipad pataas", "Bumaba nang mabilis", "Tumakbo nang matulin", "Sumigaw nang malakas"],
    correctIdx: 0,
    translation: "What is the synonym of 'Pumailanlang'?"
  },
  {
    question: "Saan madalas nagaganap ang isang Alamat?",
    options: ["Sinaunang lugar / Simula ng bagay", "Sa hinaharap (Future)", "Sa ibang planeta", "Sa laboratoryo"],
    correctIdx: 0,
    translation: "Where does a Legend usually take place?"
  },
  {
    question: "Ano ang layunin ng isang Epiko?",
    options: ["Ikuwento ang kabayanihan ng bayani", "Magturo ng luto", "Magbigay ng balita sa radyo", "Mag-advertise ng gamot"],
    correctIdx: 0,
    translation: "What is the purpose of an Epic?"
  }
];

export const G7FilipinoGame: React.FC<G7FilipinoGameProps> = ({
  learner,
  onUpdatePoints,
  onBackToDashboard,
  selectedChildKey,
  updateParentDashboard
}) => {
  // Game Setup States
  const [activeMode, setActiveMode] = useState<"menu" | "riddle" | "grammar" | "story" | "sprint" | "rest">("menu");
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Speed Sprint States
  const [currentSprintIdx, setCurrentSprintIdx] = useState(0);
  const [sprintTimeLeft, setSprintTimeLeft] = useState(10);
  const [selectedSprintAnswer, setSelectedSprintAnswer] = useState<number | null>(null);
  const [sprintFinished, setSprintFinished] = useState(false);

  // Rest upon Multiple Mistakes (Breathing break) States
  const [restTimeLeft, setRestTimeLeft] = useState(15);
  const [restBreathingState, setRestBreathingState] = useState<"Langhap (Inhale)" | "Bugso (Exhale)">("Langhap (Inhale)");
  const [restTab, setRestTab] = useState<"breathing" | "popit" | "poetry" | "doodles">("breathing");
  
  // Pop It Sensory State (5x5 grid)
  const [popItGrid, setPopItGrid] = useState<boolean[]>(Array(25).fill(false));
  
  // Magnet Poetry State
  const [placedTiles, setPlacedTiles] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // Doodle Canvas State
  const [selectedDoodleColor, setSelectedDoodleColor] = useState<string>("#3B82F6");

  // Speed Sprint Timer Effect
  useEffect(() => {
    let timer: any;
    if (activeMode === "sprint" && !gameFinished && !sprintFinished && selectedSprintAnswer === null) {
      timer = setInterval(() => {
        setSprintTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSprintAnswer(-1); // out of time
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeMode, gameFinished, sprintFinished, selectedSprintAnswer, currentSprintIdx]);

  // Rest Timer Effect
  useEffect(() => {
    let timer: any;
    if (activeMode === "rest") {
      timer = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeMode]);

  // Breathing Loop Effect
  useEffect(() => {
    let interval: any;
    if (activeMode === "rest") {
      interval = setInterval(() => {
        setRestBreathingState(prev => prev === "Langhap (Inhale)" ? "Bugso (Exhale)" : "Langhap (Inhale)");
      }, 4000); // 4 seconds inhale, 4 seconds exhale
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeMode]);

  // Riddle Mode States
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [selectedRiddleAnswer, setSelectedRiddleAnswer] = useState<number | null>(null);
  const [showRiddleExplanation, setShowRiddleExplanation] = useState(false);
  const [showRiddleHint, setShowRiddleHint] = useState(false);
  const [monsterHp, setMonsterHp] = useState(100);
  const [monsterState, setMonsterState] = useState<"idle" | "hit" | "attack">("idle");

  // Grammar Mode States
  const [currentGrammarIdx, setCurrentGrammarIdx] = useState(0);
  const [assembledSentence, setAssembledSentence] = useState<string[]>([]);
  const [grammarSuccess, setGrammarSuccess] = useState<boolean | null>(null);
  const [heroAttackAnim, setHeroAttackAnim] = useState(false);

  // Story Mode States
  const [storyStage, setStoryStage] = useState(1);
  const [storyLogs, setStoryLogs] = useState<string[]>([
    "Nagsimula ang pakikipagsapalaran ni Maria sa Barangay Katutubo upang hanapin ang nawawalang gintong manga."
  ]);

  // Spoken Text-to-Speech Helper
  const speakText = (text: string) => {
    if (!learner.settings.readAloud) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "tl-PH";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  };

  const triggerClick = () => {
    if (soundEnabled) playSound("click");
  };

  // --- Reset/Restart Game ---
  const resetGame = () => {
    setHearts(3);
    setScore(0);
    setGameFinished(false);
    setCurrentRiddleIdx(0);
    setSelectedRiddleAnswer(null);
    setShowRiddleExplanation(false);
    setShowRiddleHint(false);
    setMonsterHp(100);
    setCurrentGrammarIdx(0);
    setAssembledSentence([]);
    setGrammarSuccess(null);
    setStoryStage(1);
    setStoryLogs([
      "Nagsimula ang pakikipagsapalaran ni Maria sa Barangay Katutubo upang hanapin ang nawawalang gintong manga."
    ]);
    
    // Reset Sprint
    setCurrentSprintIdx(0);
    setSprintTimeLeft(10);
    setSelectedSprintAnswer(null);
    setSprintFinished(false);
    setRestTimeLeft(15);
    setRestTab("breathing");
    setPopItGrid(Array(25).fill(false));
    setPlacedTiles([]);
    setDraggingId(null);
  };

  // --- Handle Answer for Speed Sprint Mode ---
  const handleSprintAnswer = (optIdx: number) => {
    if (selectedSprintAnswer !== null) return;
    setSelectedSprintAnswer(optIdx);
    const activeQuestion = SPRINT_QUESTIONS[currentSprintIdx];
    
    if (optIdx === activeQuestion.correctIdx) {
      if (soundEnabled) playSound("correct");
      // Calculate speed-based bonus points
      const timeBonus = Math.max(1, Math.floor(sprintTimeLeft / 2));
      const pointsWon = 15 + timeBonus;
      setScore(prev => prev + 1);
      onUpdatePoints(pointsWon);
      speakText(`Mahusay! Plus ${pointsWon} points.`);
    } else {
      if (soundEnabled) playSound("wrong");
      setHearts(prev => {
        const nextHearts = Math.max(0, prev - 1);
        if (nextHearts === 0) {
          // Trigger REST mode upon multiple mistakes!
          setTimeout(() => {
            setActiveMode("rest");
            setRestTimeLeft(15);
            speakText("Pahinga muna tayo. Huminga nang malalim upang marelax ang iyong isip.");
          }, 800);
        }
        return nextHearts;
      });
      speakText("Naku, mali ang sagot. Subukan muli.");
    }
  };

  const nextSprintQuestion = () => {
    triggerClick();
    if (currentSprintIdx < SPRINT_QUESTIONS.length - 1 && hearts > 0) {
      setCurrentSprintIdx(prev => prev + 1);
      setSelectedSprintAnswer(null);
      setSprintTimeLeft(10);
    } else {
      setGameFinished(true);
      if (hearts > 0) {
        if (soundEnabled) playSound("victory");
        onUpdatePoints(50);
        updateParentDashboard("game_sprint_quest", 50);
        speakText("Salamat sa paglalaro ng Bilis-Isip! Ikaw ay nagtagumpay!");
      }
    }
  };

  // Helper to handle mistake/heart reduction and trigger SPED rest mode
  const decreaseHeart = () => {
    setHearts(prev => {
      const nextHearts = Math.max(0, prev - 1);
      if (nextHearts === 0) {
        setTimeout(() => {
          setActiveMode("rest");
          setRestTimeLeft(15);
          speakText("Pahinga muna tayo. Huminga nang malalim upang mag-relax.");
        }, 1200);
      }
      return nextHearts;
    });
  };

  // --- Handle Answer for Riddle Mode ---
  const handleRiddleAnswer = (optIdx: number) => {
    if (showRiddleExplanation) return;
    setSelectedRiddleAnswer(optIdx);
    const activeRiddle = BUGTONG_RIDDLES[currentRiddleIdx];
    
    if (optIdx === activeRiddle.correctIdx) {
      // Correct!
      if (soundEnabled) playSound("correct");
      setScore(prev => prev + 1);
      setMonsterState("hit");
      setMonsterHp(prev => Math.max(0, prev - 20));
      speakText("Mahusay! Tama ang iyong sagot.");
      
      setTimeout(() => {
        setMonsterState("idle");
      }, 500);
    } else {
      // Incorrect
      if (soundEnabled) playSound("wrong");
      decreaseHeart();
      setMonsterState("attack");
      speakText("Naku, mali ang sagot. Subukan muli.");

      setTimeout(() => {
        setMonsterState("idle");
      }, 700);
    }
    
    setShowRiddleExplanation(true);
  };

  const nextRiddle = () => {
    triggerClick();
    if (currentRiddleIdx < BUGTONG_RIDDLES.length - 1 && hearts > 0) {
      setCurrentRiddleIdx(prev => prev + 1);
      setSelectedRiddleAnswer(null);
      setShowRiddleExplanation(false);
      setShowRiddleHint(false);
    } else {
      // Game ended
      setGameFinished(true);
      if (hearts > 0) {
        if (soundEnabled) playSound("victory");
        // Award points!
        onUpdatePoints(50);
        updateParentDashboard("game_riddle_quest", 50);
        speakText("Salamat sa paglalaro! Ikaw ay nagtagumpay!");
      } else {
        if (soundEnabled) playSound("wrong");
        speakText("Subukan nating muli ang laro upang maging mas mahusay.");
      }
    }
  };

  // --- Handle Card Click for Grammar Mode ---
  const handleCardClick = (card: string) => {
    triggerClick();
    if (assembledSentence.includes(card)) {
      setAssembledSentence(prev => prev.filter(c => c !== card));
    } else {
      setAssembledSentence(prev => [...prev, card]);
    }
    setGrammarSuccess(null);
  };

  const checkGrammarOrder = () => {
    const currentStage = GRAMMAR_STAGES[currentGrammarIdx];
    const isCorrect = JSON.stringify(assembledSentence) === JSON.stringify(currentStage.correctOrder);
    
    if (isCorrect) {
      if (soundEnabled) playSound("correct");
      setGrammarSuccess(true);
      setHeroAttackAnim(true);
      setScore(prev => prev + 1);
      speakText("Napakagaling! Tama ang ayos ng mga salita.");

      setTimeout(() => {
        setHeroAttackAnim(false);
      }, 1000);
    } else {
      if (soundEnabled) playSound("wrong");
      setGrammarSuccess(false);
      decreaseHeart();
      speakText("May mali sa ayos. Ayusin nating muli.");
    }
  };

  const nextGrammarStage = () => {
    triggerClick();
    if (currentGrammarIdx < GRAMMAR_STAGES.length - 1 && hearts > 0) {
      setCurrentGrammarIdx(prev => prev + 1);
      setAssembledSentence([]);
      setGrammarSuccess(null);
    } else {
      setGameFinished(true);
      if (hearts > 0) {
        if (soundEnabled) playSound("victory");
        onUpdatePoints(50);
        updateParentDashboard("game_grammar_quest", 50);
      }
    }
  };

  // --- Handle Story Mode Decisions ---
  const handleStoryChoice = (choiceText: string, outcomeText: string, isCorrectOption: boolean) => {
    triggerClick();
    setStoryLogs(prev => [...prev, `Maria: "${choiceText}"`, outcomeText]);
    
    if (isCorrectOption) {
      if (soundEnabled) playSound("correct");
      setScore(prev => prev + 1);
    } else {
      if (soundEnabled) playSound("wrong");
      decreaseHeart();
    }

    if (storyStage < 3 && hearts > 0) {
      setStoryStage(prev => prev + 1);
    } else {
      setGameFinished(true);
      if (hearts > 0) {
        if (soundEnabled) playSound("victory");
        onUpdatePoints(50);
        updateParentDashboard("game_story_quest", 50);
      }
    }
  };

  return (
    <div className={`p-4 space-y-4 max-w-md mx-auto ${learner.settings.dyslexiaFont ? "font-comic-dyslexic" : "font-sans"} text-[#2D3436]`}>
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between bg-white border border-[#E9E7E0] p-3 rounded-2xl shadow-3xs">
        <button
          onClick={() => {
            triggerClick();
            if (activeMode !== "menu") {
              setActiveMode("menu");
              resetGame();
            } else {
              onBackToDashboard();
            }
          }}
          className="flex items-center gap-1 text-xs font-display font-black text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeMode === "menu" ? "Dashboard" : "Laro Menu"}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound("click");
            }}
            className={`p-2 rounded-xl transition-all border ${
              soundEnabled ? "bg-[#FF7F50]/15 border-[#FF7F50]/30 text-[#FF7F50]" : "bg-slate-100 border-slate-200 text-slate-400"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Points indicator */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl font-display font-black text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{learner.pusoPoints} pts</span>
          </div>
        </div>
      </div>

      {/* RENDER STAGES */}

      {/* 1. MAIN MENU SCREEN */}
      {activeMode === "menu" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#9C27B0] via-[#E040FB] to-[#FF4081] p-5 rounded-3xl text-white space-y-2 text-center shadow-xs">
            <Swords className="w-12 h-12 text-white mx-auto animate-bounce" />
            <h2 className="text-lg font-display font-black tracking-tight">GETS G7 Filipino Laro ⚔️</h2>
            <p className="text-[10px] text-purple-100 font-semibold leading-relaxed">
              Pumasok sa kapana-panabik na mga hamon upang patatagin ang iyong kaalaman sa Grade 7 Filipino MATATAG Curriculum at mag-earn ng maraming <strong>Puso Points</strong>!
            </p>
          </div>

          <div className="space-y-3">
            {/* Game Mode 1: Bugtong Riddle Battle */}
            <div 
              onClick={() => {
                triggerClick();
                setActiveMode("riddle");
                resetGame();
                speakText("Maligayang pagdating sa Bugtungan sa Gubat! Lutasin ang mga bugtong upang matalo ang Sawang Gubat.");
              }}
              className="bg-white border border-[#E9E7E0] hover:border-[#FF7F50]/40 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-101 cursor-pointer shadow-3xs"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl">
                🐉
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">PRE-COLONIAL LITERATURE</span>
                <h4 className="text-sm font-display font-black text-[#2D3436]">🌿 Bugtungan sa Gubat</h4>
                <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                  Lutasin ang mga tradisyunal na Filipino Riddles upang mapataas ang iyong kaalaman sa panitikan!
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FF7F50]" />
            </div>

            {/* Game Mode 2: Pang-abay Superhero Builder */}
            <div 
              onClick={() => {
                triggerClick();
                setActiveMode("grammar");
                resetGame();
                speakText("Ito ang Pang-abay Superhero Arena! Ayusin ang mga salita upang umatake ang ating bayani.");
              }}
              className="bg-white border border-[#E9E7E0] hover:border-[#FF7F50]/40 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-101 cursor-pointer shadow-3xs"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl">
                🦸‍♂️
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">WIKA AT BALARILA (GRAMMAR)</span>
                <h4 className="text-sm font-display font-black text-[#2D3436]">⚡ Pang-abay Superhero Arena</h4>
                <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                  Ayusin ang pangungusap gamit ang Pang-abay na Pamaraan, Pamanahon, at Panlunan upang matalo ang maling spelling!
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FF7F50]" />
            </div>

            {/* Game Mode 3: Alamat Story Quest */}
            <div 
              onClick={() => {
                triggerClick();
                setActiveMode("story");
                resetGame();
                speakText("Pumasok sa Alamat ni Maria. Isang pagpapasya at pakikipagsapalaran na may dyslexia-friendly fonts.");
              }}
              className="bg-white border border-[#E9E7E0] hover:border-[#FF7F50]/40 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-101 cursor-pointer shadow-3xs"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl">
                📖
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-rose-600">DYSLEXIA-FRIENDLY ADVENTURE</span>
                <h4 className="text-sm font-display font-black text-[#2D3436]">📖 Ang Alamat ni Maria</h4>
                <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                  Gumawa ng mahahalagang desisyon at sumagot sa mga katanungan tungkol sa epiko upang gabayan ang kuwento!
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FF7F50]" />
            </div>

            {/* Game Mode 4: Bilis-Isip Speed Sprint Challenge */}
            <div 
              onClick={() => {
                triggerClick();
                setActiveMode("sprint");
                resetGame();
                speakText("Maligayang pagdating sa Bilis-Isip Speed Sprint! Sagutin ang bawat tanong bago maubos ang sampung segundo!");
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 border border-orange-400 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-101 cursor-pointer shadow-sm text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-orange-100">TIMER-BASED SPRINT</span>
                <h4 className="text-sm font-display font-black">⚡ Bilis-Isip Speed Sprint</h4>
                <p className="text-[9px] text-orange-50 font-semibold leading-normal">
                  Mas mabilis na sagot, mas mataas na Puso Points! May 10 segundo ka bawat tanong!
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* 2. RIDDLE GAME MODE */}
      {activeMode === "riddle" && !gameFinished && (() => {
        const riddle = BUGTONG_RIDDLES[currentRiddleIdx];
        return (
          <div className="space-y-4 animate-fade-in">
            {/* Status indicators */}
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-150 ${
                      hearts > i ? "text-[#FF4081] fill-[#FF4081] scale-110" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase text-[#FF7F50]">
                Riddle {currentRiddleIdx + 1} of {BUGTONG_RIDDLES.length}
              </span>
            </div>

            {/* Arena/Combat Scene */}
            <div className="bg-gradient-to-b from-teal-900 to-[#10172A] rounded-2xl p-4 min-h-[140px] flex flex-col justify-between border border-slate-700 relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-bold text-teal-400 border border-teal-500/30">
                <span>👹 Sawang Gubat HP:</span>
                <span className="font-mono font-black text-white">{monsterHp}%</span>
              </div>

              {/* Monster Visual */}
              <div className="flex justify-around items-center pt-4">
                {/* Hero */}
                <div className="text-center relative">
                  <div className="text-4xl filter drop-shadow-md animate-bounce">{learner.avatar}</div>
                  <div className="text-[8px] font-bold text-white uppercase tracking-wider bg-[#FF7F50] px-1.5 rounded-full inline-block mt-1">{learner.name}</div>
                </div>

                {/* Combat FX */}
                <div className="text-lg font-black text-amber-400">
                  {monsterState === "hit" && "💥 -20 HP"}
                  {monsterState === "attack" && "⚡ ATACK!"}
                </div>

                {/* Monster */}
                <div className="text-center relative">
                  <div className={`text-4xl filter drop-shadow-md transition-all duration-150 ${
                    monsterState === "hit" ? "scale-75 brightness-75 rotate-12" :
                    monsterState === "attack" ? "scale-110 translate-x-[-15px]" : "animate-pulse"
                  }`}>
                    🐉
                  </div>
                  <div className="text-[8px] font-bold text-white uppercase tracking-wider bg-emerald-600 px-1.5 rounded-full inline-block mt-1">Sawang Gubat</div>
                </div>
              </div>

              {/* Monster HP Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
                <div className="h-full bg-teal-400 transition-all duration-300" style={{ width: `${monsterHp}%` }} />
              </div>
            </div>

            {/* Riddle Question Card */}
            <div className="bg-white border border-[#E9E7E0] rounded-2xl p-4 space-y-3.5 shadow-3xs">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase text-[#FF7F50] tracking-widest block">BUGTONG QUEST</span>
                  <h3 className="text-sm font-bold leading-relaxed">{riddle.riddle}</h3>
                </div>
                {learner.settings.readAloud && (
                  <button
                    onClick={() => speakText(`Ang bugtong ay: ${riddle.riddle}`)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Option Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {riddle.options.map((option, idx) => {
                  const isSelected = selectedRiddleAnswer === idx;
                  const isCorrect = idx === riddle.correctIdx;
                  let btnStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                  
                  if (showRiddleExplanation) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-50 border-rose-300 text-rose-800";
                    } else {
                      btnStyle = "bg-slate-50 border-slate-100 opacity-60";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-500/25";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        triggerClick();
                        handleRiddleAnswer(idx);
                      }}
                      disabled={showRiddleExplanation}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Hint Trigger */}
              {!showRiddleExplanation && (
                <div className="pt-1.5">
                  {showRiddleHint ? (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[10px] font-semibold text-amber-800 flex items-start gap-1.5">
                      <span>💡</span>
                      <span><strong>Pahiwatig (Hint):</strong> {riddle.hint}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        triggerClick();
                        setShowRiddleHint(true);
                      }}
                      className="text-[10px] font-black text-[#FF7F50] hover:underline"
                    >
                      Pindutin para sa Hint (💡)
                    </button>
                  )}
                </div>
              )}

              {/* Explanation section */}
              {showRiddleExplanation && (
                <div className="bg-[#FAF9F5] border border-[#E9E7E0] p-3 rounded-xl space-y-2 text-[#2D3436] animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                    <span>💡 Paliwanag:</span>
                  </div>
                  <p className="text-[10px] font-semibold leading-relaxed text-slate-600">
                    {riddle.explanation}
                  </p>
                  <button
                    onClick={nextRiddle}
                    className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white py-2 px-3 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Ipagpatuloy (Continue)
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 3. GRAMMAR GAME MODE */}
      {activeMode === "grammar" && !gameFinished && (() => {
        const stage = GRAMMAR_STAGES[currentGrammarIdx];
        return (
          <div className="space-y-4 animate-fade-in">
            {/* Health / Progress indicators */}
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-150 ${
                      hearts > i ? "text-[#FF4081] fill-[#FF4081]" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase text-[#FF7F50]">
                Stage {currentGrammarIdx + 1} of {GRAMMAR_STAGES.length}
              </span>
            </div>

            {/* Superhero Attack Arena visual */}
            <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-2xl p-4 h-24 flex justify-between items-center border border-slate-700 relative overflow-hidden">
              <div className={`text-4xl transition-transform duration-500 ${
                heroAttackAnim ? "translate-x-32 scale-110 skew-x-12" : ""
              }`}>
                🦸‍♂️
              </div>

              <div className="text-xs font-black text-yellow-400 uppercase tracking-widest animate-pulse">
                {heroAttackAnim && "✨ PANG-ABAY ATTACK! ✨"}
              </div>

              <div className="text-4xl">
                👹
              </div>
            </div>

            {/* Assembled Sentence Area */}
            <div className="bg-white border border-[#E9E7E0] rounded-2xl p-4 space-y-4 shadow-3xs">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase text-[#FF7F50] tracking-widest block">SUPERHERO BUILDER</span>
                <h3 className="text-xs font-black text-slate-500 uppercase">{stage.question}</h3>
                <p className="text-[10px] text-slate-400 font-semibold italic">{stage.instruction}</p>
              </div>

              {/* Assembled display block */}
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-3 min-h-[50px] flex flex-wrap gap-1.5 items-center">
                {assembledSentence.length === 0 ? (
                  <span className="text-[10px] text-slate-400 font-semibold italic">Pindutin ang mga card sa ibaba para bumuo ng pangungusap...</span>
                ) : (
                  assembledSentence.map((word, wIdx) => (
                    <span 
                      key={wIdx} 
                      onClick={() => handleCardClick(word)}
                      className="bg-[#FF7F50] text-white py-1 px-2.5 rounded-lg text-xs font-bold shadow-3xs cursor-pointer flex items-center gap-1"
                    >
                      <span>{word}</span>
                    </span>
                  ))
                )}
              </div>

              {/* Card Selection pieces */}
              <div className="space-y-1.5">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">MGA PIRASO (CARDS)</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {stage.cards.map((word, cIdx) => {
                    const isSelected = assembledSentence.includes(word);
                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleCardClick(word)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-slate-100 border-slate-300 text-slate-400 opacity-50 scale-95" 
                            : "bg-white border-indigo-200 text-[#2D3436] hover:bg-indigo-50/20 hover:border-indigo-300"
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submission Controls */}
              <div className="pt-2">
                {grammarSuccess === null ? (
                  <button
                    onClick={checkGrammarOrder}
                    disabled={assembledSentence.length !== stage.correctOrder.length}
                    className={`w-full py-2.5 text-xs font-display font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      assembledSentence.length === stage.correctOrder.length
                        ? "bg-[#FF7F50] hover:bg-[#e2693c] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    🚀 Atakehin ang Spelling Monster! (Verify)
                  </button>
                ) : grammarSuccess ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[10px] font-bold text-emerald-800">
                      🎉 Mahusay! Naitama mo ang Pang-abay na Pamaraan at matagumpay na nakatira ang ating Superhero!
                    </div>
                    <button
                      onClick={nextGrammarStage}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-display font-black uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      Ipagpatuloy (Next Stage)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[10px] font-bold text-rose-800">
                      ❌ Naku! Hindi tumugma ang pagkakasunod-sunod. Subukan muli nating ayusin ang pangungusap.
                    </div>
                    <button
                      onClick={() => setAssembledSentence([])}
                      className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      I-RESET ANG MGA CARD
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. STORY QUEST MODE */}
      {activeMode === "story" && !gameFinished && (() => {
        return (
          <div className="space-y-4 animate-fade-in">
            {/* Header progress */}
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-150 ${
                      hearts > i ? "text-[#FF4081] fill-[#FF4081]" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase text-rose-500">
                Kabanata (Chapter) {storyStage} of 3
              </span>
            </div>

            {/* Adventure Logs screen */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 h-44 overflow-y-auto space-y-2 shadow-inner scrollbar-thin">
              {storyLogs.map((log, idx) => {
                const isSystem = !log.startsWith("Maria:");
                return (
                  <div 
                    key={idx} 
                    className={`text-[10px] leading-relaxed p-2 rounded-xl border ${
                      isSystem 
                        ? "bg-white border-slate-100 text-slate-600 font-medium" 
                        : "bg-rose-50/50 border-rose-100 text-rose-800 font-black"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>

            {/* Story Choices Card */}
            <div className="bg-white border border-[#E9E7E0] rounded-2xl p-4 space-y-3.5 shadow-3xs">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest block">ALAMAT QUEST</span>
                <h3 className="text-xs font-black text-slate-700 uppercase">
                  {storyStage === 1 && "Kabanata 1: Ang Bulong ng Lolo Tasyo"}
                  {storyStage === 2 && "Kabanata 2: Ang Sangandaan sa Sawang Gubat"}
                  {storyStage === 3 && "Kabanata 3: Ang Bantay ng Gintong Manga"}
                </h3>
              </div>

              {/* Display prompt message based on current stage */}
              <div className="text-[11px] font-semibold leading-relaxed text-slate-600 bg-[#FAF9F5] p-3 rounded-xl border border-slate-100">
                {storyStage === 1 && "Nakarating si Maria sa paanan ng bundok. Nakasalubong niya si Lolo Tasyo na nagbabantay ng lagusan. Nagtanong si Lolo Tasyo: 'Upang makapasok, sabihin sa akin: Ano ang tawag sa panitikan na naglalaman ng pinagmulan ng mga bagay-bagay?'"}
                {storyStage === 2 && "Nakarating si Maria sa sangandaan. Isang matandang babae ang humihingi ng tulong upang buhatin ang kaniyang kahoy. May dalawa kang pagpipilian:"}
                {storyStage === 3 && "Narito na ang gintong manga, ngunit binabantayan ito ng isang Tikbalang. Kailangan mo siyang talunin gamit ang kaniyang kahinaan: Isang bugtong!"}
              </div>

              {/* Stage choices buttons */}
              <div className="space-y-2">
                {storyStage === 1 && (
                  <>
                    <button
                      onClick={() => handleStoryChoice(
                        "Ito ay ang Alamat!", 
                        "Natuwa si Lolo Tasyo! 'Tumpak, anak! Ang Alamat ay nagkukuwento ng pinagmulan ng mga bagay-bagay. Maaari ka nang dumaan.'", 
                        true
                      )}
                      className="w-full text-left p-3 rounded-xl border border-rose-100 hover:bg-rose-50/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      🌱 "Ang Alamat po, Lolo!"
                    </button>
                    <button
                      onClick={() => handleStoryChoice(
                        "Ito ay Balita po.", 
                        "Napailing si Lolo Tasyo: 'Naku, hindi balita ang nagpapaliwanag ng alamat. Bawasan natin ang iyong lakas, subukan muli.'", 
                        false
                      )}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      📰 "Ang Balita po."
                    </button>
                  </>
                )}

                {storyStage === 2 && (
                  <>
                    <button
                      onClick={() => handleStoryChoice(
                        "Tutulungan ko po ang matanda.", 
                        "Magiting na tinulungan ni Maria ang matanda! Sa kaniyang pasasalamat, binigyan siya ng matanda ng gintong susi at sulo na magagamit sa Sawang Gubat. Galing!", 
                        true
                      )}
                      className="w-full text-left p-3 rounded-xl border border-rose-100 hover:bg-rose-50/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      👵 "Tutulungan ko po kayo." (Awa at Pagtulong)
                    </button>
                    <button
                      onClick={() => handleStoryChoice(
                        "Magmamadali ako at lampasan siya.", 
                        "Nagpatuloy si Maria ngunit nadulas siya sa maputik na daan dahil sa pagmamadali nang walang tulong o gabay. Nabawasan ang puso.", 
                        false
                      )}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      🏃‍♂️ "Pasensya na po, kailangan kong magmadali."
                    </button>
                  </>
                )}

                {storyStage === 3 && (
                  <>
                    <button
                      onClick={() => handleStoryChoice(
                        "Sabihin ang bugtong ng 'Saranggola'.", 
                        "Nalito at napaisip ang Tikbalang sa iyong malikhaing bugtong! Sa kaniyang pagkalito, nagawa mong makuha ang gintong manga nang payapa. Matagumpay ang iyong pakikipagsapalaran!", 
                        true
                      )}
                      className="w-full text-left p-3 rounded-xl border border-rose-100 hover:bg-rose-50/20 text-xs font-bold transition-all cursor-pointer"
                    >
                      🪁 "May pakpak walang balahibo..." (Riddle attack)
                    </button>
                    <button
                      onClick={() => handleStoryChoice(
                        "Subukang lumaban gamit ang lakas.", 
                        "Napakalakas ng Tikbalang kaya nabawasan ang iyong lakas. Mas maganda kung gagamit ng katalinuhan kaysa dahas.", 
                        false
                      )}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      ⚔️ Subukang lumaban gamit ang lakas.
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4.5: BILIS-ISIP SPEED SPRINT MODE */}
      {activeMode === "sprint" && !gameFinished && (() => {
        const questionObj = SPRINT_QUESTIONS[currentSprintIdx];
        return (
          <div className="space-y-4 animate-fade-in">
            {/* Sprint Stats Bar */}
            <div className="flex justify-between items-center bg-[#FFE8D6] p-3 rounded-2xl border border-[#FBC490]">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-150 ${
                      hearts > i ? "text-[#FF4081] fill-[#FF4081] scale-110" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              {/* Time Remaining Indicator */}
              <div className="flex items-center gap-1 bg-white border border-[#FBC490] px-2.5 py-1 rounded-full text-[11px] font-black">
                <Flame className={`w-4 h-4 ${sprintTimeLeft <= 3 ? "text-red-500 animate-bounce" : "text-orange-500"}`} />
                <span className={sprintTimeLeft <= 3 ? "text-red-600 animate-soft-pulse font-extrabold" : "text-slate-700"}>
                  {sprintTimeLeft}s
                </span>
              </div>

              <span className="text-[9px] font-black uppercase text-orange-600">
                Sprint {currentSprintIdx + 1} of {SPRINT_QUESTIONS.length}
              </span>
            </div>

            {/* Timer visual progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  sprintTimeLeft <= 3 ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-amber-500"
                }`}
                style={{ width: `${(sprintTimeLeft / 10) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-3xl p-5 shadow-3xs space-y-2">
              <span className="bg-orange-100 text-orange-700 text-[8px] font-black px-2.5 py-1 rounded-full uppercase inline-block">
                Mabilisang Tanong / Quick Question ⚡
              </span>
              <h3 className="text-sm font-display font-black text-slate-800 leading-snug">
                {questionObj.question}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold italic">
                {questionObj.translation}
              </p>
            </div>

            {/* Choices list */}
            <div className="space-y-2">
              {questionObj.options.map((opt, idx) => {
                const isSelected = selectedSprintAnswer === idx;
                const isCorrect = questionObj.correctIdx === idx;
                
                let btnStyle = "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50/10";
                if (selectedSprintAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-400 bg-emerald-50 text-emerald-800 font-extrabold";
                  } else if (isSelected) {
                    btnStyle = "border-red-300 bg-red-50 text-red-800 font-extrabold line-through";
                  } else {
                    btnStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedSprintAnswer !== null}
                    onClick={() => handleSprintAnswer(idx)}
                    className={`w-full p-3.5 text-left rounded-2xl border-2 transition-all text-xs font-semibold cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {selectedSprintAnswer !== null && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation / Progress box */}
            {selectedSprintAnswer !== null && (
              <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-3 shadow-3xs animate-fade-in">
                <div className="flex items-center gap-2">
                  {selectedSprintAnswer === questionObj.correctIdx ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
                      🎉 TAMPAK (+{15 + Math.max(1, Math.floor(sprintTimeLeft / 2))} Puso Points!)
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
                      😢 Nice try! Kailangang maging listo
                    </span>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Ang tamang sagot ay <strong>{questionObj.options[questionObj.correctIdx]}</strong>. May dagdag na puntos para sa mas mabilis na pag-click!
                </p>

                <button
                  onClick={nextSprintQuestion}
                  className="w-full bg-[#2D3436] hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-display font-black uppercase tracking-wide transition-colors cursor-pointer"
                >
                  {currentSprintIdx < SPRINT_QUESTIONS.length - 1 ? (
                    <span className="flex items-center justify-center gap-1">
                      Susunod na Tanong <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    "Tapusin ang Sprint Challenge 🏆"
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4.6: ORAS NG PAHINGA (REST & RECOVERY ZONE) */}
      {activeMode === "rest" && (
        <div className="space-y-4 py-4 animate-fade-in max-w-md mx-auto">
          {/* Calming Header */}
          <div className="bg-gradient-to-br from-indigo-50 to-teal-50 border border-indigo-100 rounded-3xl p-4 text-center space-y-1">
            <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              💤 ORAS NG PAHINGA AT RELAXATION
            </span>
            <h2 className="text-sm font-display font-black text-indigo-950">
              Huminto at Mag-relax, {learner.name || "Jasmin"} 🌸
            </h2>
            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
              Pumili ng relaxation toy sa ibaba upang ma-refresh ang iyong isip bago sumubok muli. Walang pressure!
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => { triggerClick(); setRestTab("breathing"); }}
              className={`py-2 text-[10px] font-display font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                restTab === "breathing" ? "bg-white text-indigo-700 shadow-xs border border-indigo-100" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>💨</span>
              <span>Hininga</span>
            </button>
            <button
              onClick={() => { triggerClick(); setRestTab("popit"); }}
              className={`py-2 text-[10px] font-display font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                restTab === "popit" ? "bg-white text-indigo-700 shadow-xs border border-indigo-100" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🔴</span>
              <span>Pop It</span>
            </button>
            <button
              onClick={() => { triggerClick(); setRestTab("poetry"); }}
              className={`py-2 text-[10px] font-display font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                restTab === "poetry" ? "bg-white text-indigo-700 shadow-xs border border-indigo-100" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>✍️</span>
              <span>Tula</span>
            </button>
            <button
              onClick={() => { triggerClick(); setRestTab("doodles"); }}
              className={`py-2 text-[10px] font-display font-black rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                restTab === "doodles" ? "bg-white text-indigo-700 shadow-xs border border-indigo-100" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🎨</span>
              <span>Guhit</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="bg-white border border-slate-200 p-4 rounded-3xl min-h-[280px] flex flex-col justify-between shadow-2xs">
            
            {/* TAB 1: BREATHING */}
            {restTab === "breathing" && (
              <div className="space-y-4 flex flex-col items-center text-center py-2">
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                  Sumunod sa pag-pulse ng bilog: Lumanghap kapag lumalaki, at huminga nang palabas kapag lumiliit.
                </p>
                
                <div className="relative flex items-center justify-center w-36 h-36">
                  {/* Outer Pulsing Glow */}
                  <div 
                    className={`absolute inset-0 rounded-full bg-teal-200/40 border border-teal-300/20 transition-all duration-4000 ease-in-out ${
                      restBreathingState === "Langhap (Inhale)" ? "scale-110 opacity-70" : "scale-75 opacity-25"
                    }`}
                  />
                  {/* Middle Pulsing Ring */}
                  <div 
                    className={`absolute w-28 h-28 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-400 border border-indigo-300/40 transition-all duration-4000 ease-in-out flex flex-col items-center justify-center text-center shadow-md ${
                      restBreathingState === "Langhap (Inhale)" ? "scale-105" : "scale-80"
                    }`}
                  >
                    <span className="text-[10px] text-white font-black uppercase tracking-wider drop-shadow-xs">
                      {restBreathingState}
                    </span>
                    <span className="text-[8px] text-teal-50 font-bold opacity-80 mt-0.5">
                      {restBreathingState === "Langhap (Inhale)" ? "Inhale..." : "Exhale..."}
                    </span>
                  </div>

                  {/* Central Clock Counter */}
                  <div className="absolute bottom-[-15px] bg-white border border-indigo-200 shadow-xs px-3 py-1 rounded-full text-indigo-800 font-black text-xs">
                    {restTimeLeft > 0 ? `Pahinga: ${restTimeLeft}s` : "Kaya mo na ulit! ✨"}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: POP IT */}
            {restTab === "popit" && (
              <div className="space-y-3 flex flex-col items-center">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[10px] text-slate-500 font-bold">
                    Pindutin ang mga bilog para mai-pop sila!
                  </p>
                  <button
                    onClick={() => { triggerClick(); setPopItGrid(Array(25).fill(false)); }}
                    className="text-[9px] font-display font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    Reset 🔄
                  </button>
                </div>

                {/* Pop it grid */}
                <div className="grid grid-cols-5 gap-2.5 p-3.5 bg-gradient-to-tr from-amber-100 via-rose-100 to-indigo-100 border border-slate-200 rounded-2xl shadow-3xs">
                  {popItGrid.map((popped, idx) => {
                    const row = Math.floor(idx / 5);
                    const colors = [
                      "bg-rose-400 hover:bg-rose-500",
                      "bg-amber-400 hover:bg-amber-500",
                      "bg-emerald-400 hover:bg-emerald-500",
                      "bg-blue-400 hover:bg-blue-500",
                      "bg-purple-400 hover:bg-purple-500",
                    ];
                    const activeColor = colors[row] || colors[0];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (soundEnabled) playSound("click");
                          setPopItGrid(prev => {
                            const n = [...prev];
                            n[idx] = !n[idx];
                            return n;
                          });
                        }}
                        className={`w-9 h-9 rounded-full transition-all duration-150 relative shrink-0 cursor-pointer ${
                          popped
                            ? "bg-slate-300 border-2 border-slate-400 shadow-inner scale-90"
                            : `${activeColor} border-t border-white/40 shadow-md hover:scale-105 active:scale-95`
                        }`}
                      >
                        {popped ? (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500">
                            •
                          </div>
                        ) : (
                          <div className="absolute top-0.5 left-1 w-2.5 h-2.5 bg-white/30 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MAGNET POETRY */}
            {restTab === "poetry" && (
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[10px] text-slate-500 font-bold">
                    Pindutin ang mga salita para idagdag sa board, pagkatapos ay i-drag ito!
                  </p>
                  <button
                    onClick={() => { triggerClick(); setPlacedTiles([]); }}
                    className="text-[9px] font-display font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    Burahin Lahat 🗑️
                  </button>
                </div>

                {/* Poetry Board */}
                <div
                  onMouseMove={(e) => {
                    if (!draggingId) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left - 25;
                    const y = e.clientY - rect.top - 12;
                    setPlacedTiles(prev => prev.map(t => t.id === draggingId ? { ...t, x: Math.max(0, Math.min(rect.width - 60, x)), y: Math.max(0, Math.min(rect.height - 25, y)) } : t));
                  }}
                  onTouchMove={(e) => {
                    if (!draggingId || e.touches.length === 0) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = touch.clientX - rect.left - 25;
                    const y = touch.clientY - rect.top - 12;
                    setPlacedTiles(prev => prev.map(t => t.id === draggingId ? { ...t, x: Math.max(0, Math.min(rect.width - 60, x)), y: Math.max(0, Math.min(rect.height - 25, y)) } : t));
                  }}
                  onMouseUp={() => setDraggingId(null)}
                  onTouchEnd={() => setDraggingId(null)}
                  className="relative w-full h-44 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden select-none"
                >
                  {placedTiles.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-bold italic text-center p-4 leading-relaxed">
                      Walang salita sa board. Pindutin ang mga salita sa ibaba para magsimula!
                    </div>
                  )}

                  {placedTiles.map((tile) => (
                    <div
                      key={tile.id}
                      onMouseDown={(e) => { e.preventDefault(); setDraggingId(tile.id); }}
                      onTouchStart={(e) => { setDraggingId(tile.id); }}
                      style={{ left: tile.x, top: tile.y }}
                      className="absolute px-2 py-1 bg-white border border-slate-400 shadow-xs rounded-md text-[9px] font-bold text-slate-800 cursor-move flex items-center gap-1 hover:border-indigo-400 active:scale-105 select-none transition-transform"
                    >
                      <span>{tile.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedTiles(prev => prev.filter(t => t.id !== tile.id));
                        }}
                        className="text-[8px] text-rose-500 hover:text-rose-700 font-bold px-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Word Pool */}
                <div className="w-full max-h-16 overflow-y-auto border border-slate-200 bg-slate-50 rounded-xl p-1.5 flex flex-wrap gap-1">
                  {[
                    "alamat", "epiko", "bayan", "mabuti", "maganda", "isip", "kapayapaan", "bata", "puso", "makata", 
                    "diwa", "wika", "pag-ibig", "lakas", "dunong", "matatag", "guro", "aralin", "ulap", "ilog", 
                    "dagat", "bulaklak", "bayani", "lahi", "buhay"
                  ].map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        if (soundEnabled) playSound("click");
                        setPlacedTiles(prev => [
                          ...prev,
                          {
                            id: Math.random().toString(),
                            text: word,
                            x: 15 + (prev.length * 8) % 150,
                            y: 15 + (prev.length * 12) % 80
                          }
                        ]);
                      }}
                      className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[8px] font-bold tracking-wide cursor-pointer"
                    >
                      + {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: DOODLES CANVAS */}
            {restTab === "doodles" && (() => {
              const canvasRefLocal = React.useRef<HTMLCanvasElement | null>(null);
              const [isDrawingLocal, setIsDrawingLocal] = useState(false);

              const clearLocalCanvas = () => {
                if (soundEnabled) playSound("click");
                const canvas = canvasRefLocal.current;
                if (canvas) {
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }
              };

              return (
                <div className="space-y-2 flex flex-col h-full">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-1.5">
                      {["#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#1E293B"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedDoodleColor(color)}
                          style={{ backgroundColor: color }}
                          className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                            selectedDoodleColor === color ? "scale-125 ring-2 ring-indigo-500/50" : "opacity-80"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={clearLocalCanvas}
                      className="text-[9px] font-display font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      Burahin 🗑️
                    </button>
                  </div>

                  {/* Draw Canvas */}
                  <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner w-full h-44 relative">
                    <canvas
                      ref={canvasRefLocal}
                      onMouseDown={(e) => {
                        setIsDrawingLocal(true);
                        const canvas = canvasRefLocal.current;
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect();
                          const ctx = canvas.getContext("2d");
                          if (ctx) {
                            ctx.beginPath();
                            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                          }
                        }
                      }}
                      onMouseMove={(e) => {
                        if (!isDrawingLocal) return;
                        const canvas = canvasRefLocal.current;
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect();
                          const ctx = canvas.getContext("2d");
                          if (ctx) {
                            ctx.lineWidth = 3;
                            ctx.lineCap = "round";
                            ctx.strokeStyle = selectedDoodleColor;
                            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                            ctx.stroke();
                          }
                        }
                      }}
                      onMouseUp={() => setIsDrawingLocal(false)}
                      onMouseLeave={() => setIsDrawingLocal(false)}
                      onTouchStart={(e) => {
                        setIsDrawingLocal(true);
                        const canvas = canvasRefLocal.current;
                        if (canvas && e.touches.length > 0) {
                          const rect = canvas.getBoundingClientRect();
                          const touch = e.touches[0];
                          const ctx = canvas.getContext("2d");
                          if (ctx) {
                            ctx.beginPath();
                            ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
                          }
                        }
                      }}
                      onTouchMove={(e) => {
                        if (!isDrawingLocal || e.touches.length === 0) return;
                        const canvas = canvasRefLocal.current;
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect();
                          const touch = e.touches[0];
                          const ctx = canvas.getContext("2d");
                          if (ctx) {
                            ctx.lineWidth = 3;
                            ctx.lineCap = "round";
                            ctx.strokeStyle = selectedDoodleColor;
                            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                            ctx.stroke();
                          }
                        }
                      }}
                      onTouchEnd={() => setIsDrawingLocal(false)}
                      className="w-full h-full cursor-crosshair touch-none"
                      width={380}
                      height={176}
                    />
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Tips block */}
          <div className="bg-[#FAF9F5] rounded-2xl p-3 border border-[#E9E7E0] text-left">
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest block">
              💡 Tip para sa iyong isip
            </span>
            <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
              Ang pagkakamali ay bahagi ng tagumpay! Piliin ang Pop It o Doodle para maibsan ang pagod. Kapag handa ka na, i-click ang Handa na Ako sa ibaba.
            </p>
          </div>

          {/* Action buttons (Retry is locked until countdown is finished) */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              disabled={restTimeLeft > 0}
              onClick={() => {
                triggerClick();
                resetGame();
                setActiveMode("menu");
              }}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all shadow-2xs ${
                restTimeLeft > 0
                  ? "bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white cursor-pointer"
              }`}
            >
              {restTimeLeft > 0 ? `Mag-relax muna upang Maglaro (${restTimeLeft}s)` : "Handa na Ako! (Retry) 🎮"}
            </button>
            <button
              onClick={() => {
                triggerClick();
                resetGame();
                setActiveMode("menu");
              }}
              className="w-full bg-white hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-colors border border-slate-200 cursor-pointer"
            >
              Bumalik sa Menu 🏠
            </button>
          </div>
        </div>
      )}

      {/* 5. VICTORY / GAMEOVER SCREEN */}
      {gameFinished && (
        <div className="space-y-4 text-center animate-fade-in py-5">
          {hearts > 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4">
              <Trophy className="w-14 h-14 text-amber-500 mx-auto animate-bounce" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">MISSION ACCOMPLISHED</span>
                <h2 className="text-base font-display font-black text-emerald-900">🎉 Matagumpay na Nakumpleto!</h2>
                <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
                  Mahusay ang iyong ipinakita, {learner.name}! Matagumpay mong nalutas ang mga pagsubok sa G7 Filipino Game Companion.
                </p>
              </div>

              {/* Scoring breakdown box */}
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">SCORE</div>
                  <div className="text-base font-black text-[#FF7F50]">{score} / 3</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">BONUS PUSO</div>
                  <div className="text-base font-black text-amber-500">+50 Points</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerClick();
                    onBackToDashboard();
                  }}
                  className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white py-3 px-4 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                >
                  Bumalik sa Dashboard 🏠
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl space-y-4">
              <RefreshCw className="w-14 h-14 text-rose-500 mx-auto animate-spin" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">GAME OVER</span>
                <h2 className="text-base font-display font-black text-rose-900">🥺 Subukan Nating Muli</h2>
                <p className="text-[10px] text-rose-700 font-semibold leading-relaxed">
                  Naubusan ka ng mga Puso! Huwag mag-alala, ang pagkakamali ay bahagi ng pagkatuto. Subukan nating muli upang makuha ang mga puntos!
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    triggerClick();
                    resetGame();
                    setGameFinished(false);
                  }}
                  className="w-full bg-[#FF7F50] hover:bg-[#e2693c] text-white py-3 px-4 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                >
                  Maglaro Muli (Retry) 🔄
                </button>
                <button
                  onClick={() => {
                    triggerClick();
                    onBackToDashboard();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-colors cursor-pointer border border-slate-200"
                >
                  Bumalik sa Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
