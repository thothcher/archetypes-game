import type { Lang } from "./i18n";
import { KA_ARCH } from "./ka";

// Jung's four principal archetypes of the personality:
// Persona, Shadow, the soul-image (Anima in a man, Animus in a woman), and the Self.

export type ArchetypeKey = "persona" | "shadow" | "soul" | "self";
export type Gender = "man" | "woman";

export type Psyche = Record<ArchetypeKey, number>;

/** A value that may differ by the player's gender. */
export type Gendered<T> = T | { man: T; woman: T };

export function pick<T>(v: Gendered<T>, g: Gender): T {
  if (v && typeof v === "object" && "man" in v && "woman" in v) return (v as { man: T; woman: T })[g];
  return v as T;
}

export interface Archetype {
  key: ArchetypeKey;
  name: string;
  glyph: string;
  color: string;
  /** rgb 0..1 for the shader */
  rgb: [number, number, number];
  essence: string;
  light: string;
  dark: string;
}

/** Stacking order inside the body, bottom → top. The Persona, the mask, covers the face. */
export const ORDER: ArchetypeKey[] = ["shadow", "soul", "self", "persona"];

const PERSONA: Archetype = {
  key: "persona",
  name: "Persona",
  glyph: "◇",
  color: "#c9d3e6",
  rgb: [0.78, 0.82, 0.9],
  essence:
    "The mask you show the world: roles, manners, reputation. Quicksilver: it reflects others back to themselves.",
  light: "Healthy, it is a flexible filter that lets you work, teach, and meet strangers with grace.",
  dark: "Identified with it, you become the role: hollow, performing, afraid of being seen without it.",
};

const SHADOW: Archetype = {
  key: "shadow",
  name: "Shadow",
  glyph: "◐",
  color: "#7b4dd6",
  rgb: [0.2, 0.08, 0.38],
  essence: "Everything you refuse to see in yourself: repressed desire, anger, envy, and talents you never lived.",
  light: "Integrated, it becomes vitality, honesty, boundaries, creative fire.",
  dark: "Denied, it gets projected onto others and erupts as moods, addictions, and cruelty.",
};

const ANIMA: Archetype = {
  key: "soul",
  name: "Anima",
  glyph: "☾",
  color: "#ff7aa8",
  rgb: [1.0, 0.36, 0.6],
  essence:
    "The feminine soul-image in a man: feeling, Eros, relatedness, imagination, the bridge to the unconscious.",
  light: "Related to consciously, she brings warmth, inspiration, creativity, and the capacity to love.",
  dark: "Unconscious, she possesses him as moods, touchiness, sentimentality, and fascinations he projects onto women.",
};

const ANIMUS: Archetype = {
  key: "soul",
  name: "Animus",
  glyph: "△",
  color: "#4da3ff",
  rgb: [0.18, 0.5, 1.0],
  essence:
    "The masculine soul-image in a woman: Logos, will, discernment, the word and the deed, the bridge to the unconscious.",
  light: "Related to consciously, he brings courage, clarity, initiative, and spiritual direction.",
  dark: "Unconscious, he possesses her as rigid opinions, a merciless inner critic, and heroes she projects onto men.",
};

const SELF: Archetype = {
  key: "self",
  name: "Self",
  glyph: "◉",
  color: "#f2c14e",
  rgb: [1.0, 0.78, 0.3],
  essence: "The center and the totality of the psyche: the organizing wholeness that individuation moves toward.",
  light: "When you live from it, opposites are held instead of split, and choices feel true.",
  dark: "Lacking it, you are pulled around by whichever complex is loudest.",
};

export function arch(k: ArchetypeKey, g: Gender): Archetype {
  if (k === "soul") return g === "man" ? ANIMA : ANIMUS;
  return { persona: PERSONA, shadow: SHADOW, self: SELF }[k];
}

export const SOUL = { man: ANIMA, woman: ANIMUS };
export const ALL = { persona: PERSONA, shadow: SHADOW, anima: ANIMA, animus: ANIMUS, self: SELF };

/** Starting state of a typical adult: a thick mask, a heavy shadow, a faint Self. */
export const START: Psyche = { shadow: 34, soul: 18, self: 18, persona: 30 };

const MIN = 4;

/** Apply raw deltas, then renormalise so the vessel is always 100% full. */
export function applyDeltas(p: Psyche, d: Partial<Psyche>): Psyche {
  const next = { ...p };
  ORDER.forEach((k) => (next[k] = Math.max(MIN, next[k] + (d[k] ?? 0))));
  const sum = ORDER.reduce((s, k) => s + next[k], 0);
  ORDER.forEach((k) => (next[k] = (next[k] / sum) * 100));
  return next;
}

/**
 * Individuation index (0–100). A strong Self and an integrated Shadow raise it.
 * The Persona and the soul-image are needed in measure: a mask that is too thick
 * (identification) or too thin (no boundaries) lowers it, as does a soul-image that
 * floods the vessel (possession) or barely exists (no contact with the unconscious).
 */
export function individuation(p: Psyche): number {
  const v =
    50 +
    (p.self - p.shadow) * 1.0 -
    Math.max(0, p.persona - 20) * 0.8 -
    Math.max(0, 12 - p.persona) * 1.2 -
    Math.max(0, p.soul - 30) * 0.8 -
    Math.max(0, 12 - p.soul) * 0.6;
  return Math.round(Math.min(100, Math.max(0, v)));
}

export function dominant(p: Psyche): ArchetypeKey {
  return ORDER.reduce((a, b) => (p[a] >= p[b] ? a : b));
}

/** Archetype in the reader's language. */
export function archL(k: ArchetypeKey, g: Gender, lang: Lang): Archetype {
  const a = arch(k, g);
  if (lang === "en") return a;
  const id = k === "soul" ? (g === "man" ? "anima" : "animus") : k;
  return { ...a, ...KA_ARCH[id] };
}

/** One of the five archetype descriptions (both soul-images included) in the reader's language. */
export function namedL(id: keyof typeof ALL, lang: Lang): Archetype {
  return lang === "en" ? ALL[id] : { ...ALL[id], ...KA_ARCH[id] };
}
