"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { LANGS, LANG_KEY, localePath, type Lang } from "@/lib/locale";
import { soundOff, soundOn } from "@/lib/sound";
import { UI_TEXT } from "@/lib/ui";

const LANG_LABEL: Record<Lang, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  ka: { short: "ქარ", full: "ქართული" },
};

export default function Nav() {
  const [sound, setSound] = useState(false);
  const path = usePathname() || "/";
  const router = useRouter();
  const { lang } = useLang();
  const t = UI_TEXT[lang].nav;

  // Old ?lang=ka links, and readers who chose Georgian before, land on the Georgian page.
  useEffect(() => {
    if (lang !== "en") return;
    let want: string | null = null;
    try {
      want = new URLSearchParams(location.search).get("lang") ?? localStorage.getItem(LANG_KEY);
    } catch {}
    if (want === "ka") router.replace(localePath(path, "ka") + location.hash);
  }, [lang, path, router]);

  const remember = (l: Lang) => {
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  return (
    <header className="nav">
      <Link href={localePath("/", lang)} className="logo">
        <span className="logo-mark" aria-hidden>
          ◉
        </span>{" "}
        VAS
        <span className="logo-sub mono">{t.logoSub}</span>
      </Link>
      <nav className="nav-links" aria-label={t.menu}>
        <Link href={localePath("/", lang) + "#waters"}>{t.archetypes}</Link>
        <Link href={localePath("/", lang) + "#experience"}>{t.experience}</Link>
        <Link
          href={localePath("/practices/", lang)}
          className={path.includes("/practices") ? "active" : ""}
          aria-current={path.includes("/practices") ? "page" : undefined}
        >
          {t.practices}
        </Link>
      </nav>
      <div className="nav-right">
        <div className="lang" role="group" aria-label="Language · ენა">
          {LANGS.map((l) => (
            <Link
              key={l}
              href={localePath(path, l)}
              hrefLang={l}
              lang={l}
              className={lang === l ? "on" : ""}
              aria-current={lang === l ? "true" : undefined}
              aria-label={`${LANG_LABEL[l].short} · ${LANG_LABEL[l].full}`}
              title={LANG_LABEL[l].full}
              onClick={() => remember(l)}
              scroll={false}
            >
              {LANG_LABEL[l].short}
            </Link>
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
          aria-label={sound ? t.soundOn : t.soundOff}
        >
          <span className={`bars ${sound ? "on" : ""}`} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="sound-label" aria-hidden>
            {sound ? t.soundOn : t.soundOff}
          </span>
        </button>
      </div>
    </header>
  );
}
