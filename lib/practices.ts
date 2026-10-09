import type { ArchetypeKey, Gendered, Psyche } from "./archetypes";
import type { Lang } from "./locale";
import { KA_PRACTICES } from "./ka";

export interface Practice {
  id: string;
  for: ArchetypeKey;
  title: Gendered<string>;
  time: Gendered<string>;
  how: Gendered<string>;
  why: Gendered<string>;
  deltas: Partial<Psyche>;
}

export const PRACTICES: Practice[] = [
  // ——— Persona: wear the mask, don't become it
  {
    id: "mask-inventory",
    for: "persona",
    title: "The Mask Inventory",
    time: "10 min · once",
    how: "List your masks: at work, with family, online, with friends. For each one, write what it protects and what it hides.",
    why: "You can only take off a mask you know you're wearing. Jung's warning was identification: forgetting that the role is a role.",
    deltas: { persona: -6, self: 4 },
  },
  {
    id: "true-answer",
    for: "persona",
    title: "One True Answer a Day",
    time: "daily",
    how: "Once a day, when someone asks “How are you?”, give a true answer in one sentence instead of the automatic one.",
    why: "A healthy Persona is a filter, not a wall. Small truths keep the mask flexible.",
    deltas: { persona: -5, self: 3, shadow: -1 },
  },
  {
    id: "offline",
    for: "persona",
    title: "An Unwitnessed Day",
    time: "1 day · monthly",
    how: "Spend one day with no posting, no photos, no performing. Notice who you are when no one is watching.",
    why: "Social media is Persona at industrial scale. Time without an audience shows you what's underneath.",
    deltas: { persona: -6, self: 3 },
  },
  // ——— Shadow: face it, don't fight it
  {
    id: "projection-log",
    for: "shadow",
    title: "The Projection Log",
    time: "5 min · daily",
    how: "Write down one person who irritated you today and the exact trait. Then ask: “Where do I do this, or secretly wish I could?”",
    why: "Withdrawing projections is the core of shadow work. The charge you feel toward others is energy that belongs to you.",
    deltas: { shadow: -8, self: 4 },
  },
  {
    id: "unsent-letter",
    for: "shadow",
    title: "The Unsent Letter",
    time: "15 min · weekly",
    how: "Write everything you never dared to say to someone, uncensored. Read it aloud once. Then burn or delete it.",
    why: "Repressed anger loses its secret power once it is consciously expressed in a safe container.",
    deltas: { shadow: -6, persona: -2 },
  },
  {
    id: "conscious-yes",
    for: "shadow",
    title: "The Conscious Yes",
    time: "any moment",
    how: "Choose one small 'forbidden' pleasure (cotton candy, a lazy hour) and enjoy it fully, with awareness and without guilt.",
    why: "Rigid denial feeds the Shadow (enantiodromia). A conscious yes integrates the desire before it turns into a secret binge.",
    deltas: { shadow: -5, self: 3 },
  },
  {
    id: "body-fire",
    for: "shadow",
    title: "Channel the Fire",
    time: "45 min · 2× week",
    how: "Do boxing, sprinting, drumming, or primal shouting in the car. Give your aggression a body and a boundary.",
    why: "Integrated aggression becomes vitality and the ability to say no.",
    deltas: { shadow: -6, self: 2 },
  },
  // ——— Anima / Animus: relate to the soul-image instead of being possessed by it
  {
    id: "dream-journal",
    for: "soul",
    title: "Dream Journal",
    time: "5 min · on waking",
    how: "Keep a notebook by the bed. Write any fragment before you check your phone, and sketch the strongest image.",
    why: {
      man: "Dreams are the unconscious speaking in images, and the Anima often appears as an unknown woman who guides, tempts, or warns.",
      woman: "Dreams are the unconscious speaking in images, and the Animus often appears as an unknown man (or a council of men) who guides, judges, or rescues.",
    },
    deltas: { soul: 5, self: 3 },
  },
  {
    id: "soul-voice",
    for: "soul",
    title: { man: "Find the Exact Feeling", woman: "Name the Inner Judge" },
    time: { man: "1 min · 3× day", woman: "5 min" },
    how: {
      man: "Stop and name your feeling precisely. Not 'bad' but 'disappointed', 'tender', 'restless'. Then say it to someone.",
      woman:
        "When a harsh verdict sounds inside ('you always…', 'you'll never…'), write it down and ask: whose voice is this? Answer it as you would a bully: “Thanks, I've heard you.”",
    },
    why: {
      man: "A named feeling is a related Anima. An unnamed one turns into a mood that possesses you.",
      woman:
        "Personifying the negative Animus separates you from it. You can hear the voice without being the voice, and its energy becomes discernment instead of attack.",
    },
    deltas: { soul: -2, shadow: -3, self: 4 },
  },
  {
    id: "soul-gift",
    for: "soul",
    title: { man: "Useless Beauty", woman: "One Clear Deed" },
    time: "20 min · weekly",
    how: {
      man: "Do something with no purpose: paint, play music, sing, watch clouds, read poetry aloud. Let feeling lead.",
      woman:
        "Choose one thing you've been 'meaning to' do (a sentence, a decision, a first step) and do it, without asking permission.",
    },
    why: {
      man: "Eros, beauty and imagination are the Anima's gifts. A man who lives them stops needing a woman to carry them for him.",
      woman:
        "Logos and initiative are the positive Animus's gifts. A woman who lives them stops needing a man to carry them for her.",
    },
    deltas: { soul: 5, self: 2 },
  },
  {
    id: "take-back",
    for: "soul",
    title: "Take Back the Projection",
    time: "10 min · when fascinated",
    how: {
      man: "When a woman fascinates you instantly and totally, write down the qualities you see in her. Then ask: where does this live, unlived, in me?",
      woman:
        "When a man fascinates you instantly and totally, write down the qualities you see in him. Then ask: where does this live, unlived, in me?",
    },
    why: {
      man: "Instant fascination is usually Anima projection. Taking it back turns her into an inner capacity and lets the real woman be herself.",
      woman:
        "Instant fascination is usually Animus projection. Taking it back turns him into an inner capacity and lets the real man be himself.",
    },
    deltas: { soul: 3, self: 5, shadow: -2 },
  },
  // ——— Self: the center that holds the opposites
  {
    id: "mandala",
    for: "self",
    title: "Draw a Mandala",
    time: "20 min",
    how: "Draw a circle. Fill it from the center outward, without planning, using any colours that call to you.",
    why: "Jung drew a mandala every morning during his crisis years. He saw it as a spontaneous image of the Self ordering the psyche.",
    deltas: { self: 7, shadow: -2 },
  },
  {
    id: "active-imagination",
    for: "self",
    title: "Active Imagination",
    time: "20 min · weekly",
    how: "Return to a dream image or a strong feeling. Let it move on its own and dialogue with it in writing, as two equals.",
    why: "This is Jung's central method. A conscious ego and the unconscious meet, and the 'transcendent function' produces a third, new attitude.",
    deltas: { self: 8, soul: 2, shadow: -3 },
  },
  {
    id: "hold-opposites",
    for: "self",
    title: "Hold the Opposites",
    time: "5 min",
    how: "When torn (stay or go, yes or no), write both sides fully, then wait. Don't choose too fast. Notice what third option appears.",
    why: "The Self doesn't pick one pole. It holds the tension until something new emerges.",
    deltas: { self: 6, persona: -1 },
  },
  {
    id: "solitude",
    for: "self",
    title: "The Tower Hour",
    time: "1 h · weekly",
    how: "Spend one hour alone with no phone, no input. A walk, a candle, a window. Jung built his stone tower at Bollingen for this.",
    why: "The Self speaks quietly. Silence gives it room, and no mask is needed when no one is there.",
    deltas: { self: 6, persona: -2 },
  },
];

/** Practice text in the reader's language; ids, targets and deltas come from the source above. */
export function localizePractice(p: Practice, lang: Lang): Practice {
  if (lang === "en") return p;
  const t = KA_PRACTICES[p.id];
  return t ? { ...p, ...t } : p;
}
