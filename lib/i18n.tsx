"use client";

import { createContext, useContext } from "react";
import type { Lang } from "./locale";

export type { Lang } from "./locale";

// Each language has its own prerendered URLs (English at /, Georgian at /ka/);
// the layout for each tells its subtree which language it is.
const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return { lang: useContext(LangContext) };
}

/** Renders *emphasis* markers in a translated string as <em>. */
export function rich(s: string) {
  return s.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}
