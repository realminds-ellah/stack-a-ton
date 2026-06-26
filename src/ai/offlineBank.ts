// GETS offline answer bank — authored, MATATAG-grounded tutor replies used when
// there's no connection. This is what powers the AI tutor chat in airplane mode:
// the ScriptedProvider (providers.ts) consults lookup() before the generic Mock
// reply, so offline answers are topic-specific instead of one canned line.
//
// Scope is deliberately small — the topics shown in the demo (the four Grade 7
// MATATAG subjects) plus a handful of common learner intents. When online, the
// router prefers Gemini Flash and never touches this file.

import type { Lang } from "./types";

interface BankEntry {
  id: string;
  /** lowercase keywords; a question matches if it contains any of them */
  keywords: string[];
  /** per-language answer; tl is the fallback when a language is missing */
  answers: Partial<Record<Lang, string>> & { tl: string };
}

const BANK: BankEntry[] = [
  // ── Math · Polygons (the MVP's headline lesson) ──────────────────────────────
  {
    id: "math-polygons",
    keywords: ["polygon", "polygons", "gilid", "anggulo", "angle", "hugis", "tatsulok", "triangle", "parihaba", "quadrilateral", "pentagon", "hexagon"],
    answers: {
      tl: "Ang **polygon** ay saradong hugis na gawa sa tuwid na mga gilid (hindi kurbado). Pangalanan natin ito ayon sa bilang ng gilid: 3 gilid = tatsulok, 4 = parihaba/kwadrado, 5 = pentagon, 6 = hexagon. Tandaan: bilangin lang ang mga gilid at iyon ang magsasabi ng pangalan! Gusto mo ng halimbawa?",
      en: "A **polygon** is a closed shape made of straight sides (no curves). We name it by the number of sides: 3 sides = triangle, 4 = quadrilateral, 5 = pentagon, 6 = hexagon. The trick: just count the sides and that tells you the name! Want a worked example?",
    },
  },
  // ── Science · Ecosystems ─────────────────────────────────────────────────────
  {
    id: "science-ecosystem",
    keywords: ["ecosystem", "ekosistema", "food chain", "food web", "organism", "kalikasan", "ugnayan", "habitat", "producer", "consumer", "decomposer"],
    answers: {
      tl: "Ang **ekosistema** ay ang ugnayan ng mga nabubuhay na bagay (halaman, hayop) at di-nabubuhay (tubig, araw, lupa) sa isang lugar. Ang enerhiya ay dumadaloy: halaman (gumagawa ng pagkain) → hayop na kumakain ng halaman → hayop na kumakain ng hayop. Kapag may nawala sa kadena, apektado ang lahat. Nais mo bang ipaliwanag ko ang food chain?",
      en: "An **ecosystem** is the relationship between living things (plants, animals) and non-living things (water, sun, soil) in one place. Energy flows: plants (make food) → animals that eat plants → animals that eat animals. Remove one link and the whole chain is affected. Want me to explain the food chain?",
    },
  },
  // ── English · Literary forms ────────────────────────────────────────────────
  {
    id: "english-literary-forms",
    keywords: ["literary", "literature", "genre", "short story", "poem", "poetry", "essay", "drama", "fiction", "nonfiction", "anyo ng panitikan"],
    answers: {
      tl: "Ang **literary forms** (anyo ng panitikan) ang iba't ibang paraan ng pagkukuwento. Ang pangunahin: **poetry** (tula — maikli, gumagamit ng imahe at ritmo), **prose** (kuwento o sanaysay na nakasulat sa pangungusap), at **drama** (para itanghal). Bawat isa ay may sariling layunin. Gusto mo ng halimbawa ng bawat isa?",
      en: "**Literary forms** are the different ways we tell stories. The main ones: **poetry** (poems — short, using images and rhythm), **prose** (stories or essays written in sentences), and **drama** (meant to be performed). Each has its own purpose. Want an example of each?",
    },
  },
  // ── Filipino · Panitikan ────────────────────────────────────────────────────
  {
    id: "filipino-panitikan",
    keywords: ["panitikan", "alamat", "kwento", "kuwento", "bugtong", "salawikain", "epiko", "katutubo", "tula", "maikling kwento", "mito"],
    answers: {
      tl: "Ang **panitikan sa panahon ng katutubo** ay ang mga akdang pasalindila bago dumating ang mga Espanyol — ipinapasa sa salita, hindi nakasulat. Kabilang dito: **alamat** (paliwanag kung paano nabuo ang isang bagay), **bugtong** (palaisipan), **salawikain** (aral sa buhay), at **epiko** (mahabang kuwento ng bayani). Gusto mo ba ng halimbawa ng alamat?",
      en: "**Pre-colonial Filipino literature** are the oral works passed down before the Spanish came — shared by word of mouth, not written. These include: **alamat** (legends explaining how something came to be), **bugtong** (riddles), **salawikain** (proverbs with life lessons), and **epiko** (long hero epics). Want an example of a legend?",
    },
  },
  // ── Intent · explain it simpler / re-teach ──────────────────────────────────
  {
    id: "intent-simpler",
    keywords: ["simple", "simpler", "pasimple", "di ko gets", "hindi ko maintindihan", "di ko maintindihan", "explain again", "ulitin", "paulit", "i don't get", "dont understand", "don't understand", "lito"],
    answers: {
      tl: "Walang problema — subukan natin sa ibang paraan. 🌱 Sabihin mo sa akin kung aling bahagi ang malabo (halimbawa: \"ang anggulo\" o \"ang food chain\"), at gagawa ako ng mas simpleng paliwanag na may halimbawa mula sa totoong buhay. Hindi ka mali — iba lang ang paraan na bagay sa iyo.",
      en: "No problem — let's try it another way. 🌱 Tell me which part is unclear (for example: \"the angles\" or \"the food chain\"), and I'll give a simpler explanation with a real-life example. You're not wrong — you just need a different way in.",
    },
  },
  // ── Intent · give me an example ─────────────────────────────────────────────
  {
    id: "intent-example",
    keywords: ["halimbawa", "example", "give an example", "bigyan mo ako ng halimbawa", "sample"],
    answers: {
      tl: "Sige! Isipin mo ang **bahay**: ang bintana ay parihaba (4 na gilid = polygon), at ang bubong ay tatsulok (3 gilid). Nakikita mo ang aralin sa paligid mo araw-araw. Anong paksa ang gusto mong bigyan ko ng halimbawa?",
      en: "Sure! Picture a **house**: the window is a rectangle (4 sides = a polygon), and the roof is a triangle (3 sides). You can see the lesson around you every day. Which topic should I give an example for?",
    },
  },
  // ── Intent · encouragement / stuck / want to give up ────────────────────────
  {
    id: "intent-encourage",
    keywords: ["give up", "sumuko", "ayoko na", "hirap", "mahirap", "stress", "nahihirapan", "hindi ko kaya", "i can't", "frustrated", "pagod"],
    answers: {
      tl: "Huminga muna tayo. 💙 Hindi ka pumapalpak — natututo ka pa lang, at iyon ay tama lang. Hatiin natin ito sa maliliit na bahagi at gawin nang dahan-dahan, isa-isa. Handa ka na bang subukan ang isang maliit na hakbang kasama ko?",
      en: "Let's take a breath. 💙 You're not failing — you're still learning, and that's exactly right. Let's break it into small pieces and go slowly, one at a time. Ready to try one little step with me?",
    },
  },
  // ── Intent · greeting / what can you do ─────────────────────────────────────
  {
    id: "intent-greeting",
    keywords: ["hello", "hi", "kumusta", "kamusta", "hoy", "uy", "what can you do", "ano ang kaya mo", "tulong", "help", "ano ka"],
    answers: {
      tl: "Kumusta! Ako si **GETS**, ang iyong Grade 7 AI Companion. Matutulungan kita sa Matematika, Agham, Ingles, at Filipino — at kung may hindi malinaw, ipapaliwanag ko ito sa ibang paraan hanggang sa maintindihan mo. Ano ang gusto mong pag-aralan ngayon?",
      en: "Hi! I'm **GETS**, your Grade 7 AI Companion. I can help with Math, Science, English, and Filipino — and if something isn't clear, I'll explain it a different way until it lands. What would you like to study today?",
    },
  },
];

/** Find an authored offline answer for a question, or null if nothing matches. */
export function lookup(question: string, lang: Lang = "tl"): string | null {
  const q = question.toLowerCase();
  for (const entry of BANK) {
    if (entry.keywords.some((k) => q.includes(k))) {
      return entry.answers[lang] ?? entry.answers.tl;
    }
  }
  return null;
}
