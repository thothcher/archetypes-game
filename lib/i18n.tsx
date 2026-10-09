"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ka";
export const LANGS: Lang[] = ["en", "ka"];

const KEY = "vas-lang";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

/**
 * Language for the whole site. Pages are prerendered in English; on load the
 * choice is restored from ?lang=, then from this browser's memory, then from
 * the browser's own language.
 */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let initial: Lang = "en";
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const stored = localStorage.getItem(KEY);
      if (fromUrl === "ka" || fromUrl === "en") initial = fromUrl;
      else if (stored === "ka" || stored === "en") initial = stored;
      else if (navigator.language?.toLowerCase().startsWith("ka")) initial = "ka";
    } catch {}
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Renders *emphasis* markers in a translated string as <em>. */
export function rich(s: string) {
  return s.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}
