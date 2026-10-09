"use client";

import { useSyncExternalStore } from "react";
import { START, type ArchetypeKey, type Psyche } from "./archetypes";

// Game progress lives outside React so it survives client-side navigation,
// e.g. switching between the English and Georgian pages mid-game.

export type Phase = "gender" | "choose" | "predict" | "reveal" | "end";

export interface Step {
  /** indexes into SCENARIOS and its choices, so the path re-renders in any language */
  scenario: number;
  choice: number;
  guessed: ArchetypeKey | null;
  correct: boolean;
}

export interface GameState {
  psyche: Psyche;
  idx: number;
  phase: Phase;
  choiceIdx: number | null;
  guess: ArchetypeKey | null;
  history: Step[];
  pulseTick: number;
  pulseKeys: ArchetypeKey[];
  predictMode: boolean;
}

export const INITIAL: GameState = {
  psyche: START,
  idx: 0,
  phase: "gender",
  choiceIdx: null,
  guess: null,
  history: [],
  pulseTick: 0,
  pulseKeys: [],
  predictMode: true,
};

let state = INITIAL;
const listeners = new Set<() => void>();

export function setGame(update: Partial<GameState> | ((s: GameState) => Partial<GameState>)) {
  state = { ...state, ...(typeof update === "function" ? update(state) : update) };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useGame(): GameState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  );
}
