"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LANGS, useLang } from "@/lib/i18n";
import { soundOff, soundOn } from "@/lib/sound";
import { UI_TEXT } from "@/lib/ui";

const LANG_LABEL = { en: "EN", ka: "ქარ" };

export default function Nav() {
  const [sound, setSound] = useState(false);
  const path = usePathname();
  const { lang, setLang } = useLang();
  const t = UI_TEXT[lang].nav;
  return (
    <header className="nav">
      <Link href="/" className="logo">
        <span className="logo-mark">◉</span> VAS
        <span className="logo-sub mono">{t.logoSub}</span>
      </Link>
      <nav className="nav-links">
        <Link href="/#waters" className={path === "/" ? "active" : ""}>
          {t.archetypes}
        </Link>
        <Link href="/#experience">{t.experience}</Link>
        <Link href="/practices/" className={path?.startsWith("/practices") ? "active" : ""}>
          {t.practices}
        </Link>
      </nav>
      <div className="nav-right">
        <div className="lang" role="group" aria-label="Language / ენა">
          {LANGS.map((l) => (
            <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)} aria-pressed={lang === l}>
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
        <button
          className="sound mono"
          onClick={() => {
            if (sound) soundOff();
            else soundOn();
            setSound(!sound);
          }}
          aria-pressed={sound}
        >
          <span className={`bars ${sound ? "on" : ""}`}>
            <i />
            <i />
            <i />
          </span>
          <span className="sound-label">{sound ? t.soundOn : t.soundOff}</span>
        </button>
      </div>
    </header>
  );
}
