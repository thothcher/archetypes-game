"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ORDER, START, applyDeltas, archL, individuation, pick, type ArchetypeKey, type Gender } from "@/lib/archetypes";
import { rich, useLang } from "@/lib/i18n";
import { PRACTICES, localizePractice } from "@/lib/practices";
import { UI_TEXT } from "@/lib/ui";
import { useGender } from "@/lib/useGender";

const FluidAvatar = dynamic(() => import("./FluidAvatar"), {
  ssr: false,
  loading: () => <div className="avatar avatar-loading">…</div>,
});

const STORE = "vas-practices";
/** Top-to-bottom as in the body. */
const FILTER_ORDER: ArchetypeKey[] = [...ORDER].reverse();

export function PracticesHero() {
  const t = UI_TEXT[useLang().lang].practices;
  return (
    <section className="p-hero">
      <p className="mono dim">{t.label}</p>
      <h1 className="display hero-title">
        {t.title1}
        <br />
        <em>{t.title2}</em>
      </h1>
      <p className="hero-sub">{rich(t.sub)}</p>
    </section>
  );
}

export default function Practices() {
  const { lang } = useLang();
  const t = UI_TEXT[lang].practices;
  const [stored, setGender] = useGender();
  const gender: Gender = stored ?? "man";
  const [picked, setPicked] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [lastKeys, setLastKeys] = useState<ArchetypeKey[]>([]);
  const [filter, setFilter] = useState<ArchetypeKey | "all">("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setPicked(JSON.parse(raw));
    } catch {}
  }, []);

  const psyche = useMemo(
    () => PRACTICES.filter((p) => picked.includes(p.id)).reduce((acc, p) => applyDeltas(acc, p.deltas), START),
    [picked]
  );

  function toggle(id: string) {
    const p = PRACTICES.find((x) => x.id === id)!;
    const next = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id];
    setPicked(next);
    setLastKeys(Object.keys(p.deltas) as ArchetypeKey[]);
    setTick((n) => n + 1);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {}
  }

  const list = PRACTICES.filter((p) => filter === "all" || p.for === filter).map((p) => localizePractice(p, lang));

  return (
    <section className="practices">
      <aside className="p-vessel">
        <FluidAvatar psyche={psyche} gender={gender} pulseTick={tick} pulseKeys={lastKeys} />
        <div className="p-stats">
          <div>
            <span className="big">{individuation(psyche)}</span>
            <span className="mono dim">{UI_TEXT[lang].game.individuation}</span>
          </div>
          <div>
            <span className="big">{picked.length}</span>
            <span className="mono dim">{t.chosen}</span>
          </div>
        </div>
      </aside>

      <div className="p-list">
        <div className="filters">
          <div className="seg" role="group">
            {(["man", "woman"] as Gender[]).map((g) => (
              <button
                key={g}
                className={gender === g ? "on" : ""}
                style={{ ["--c" as string]: archL("soul", g, lang).color }}
                onClick={() => {
                  setGender(g);
                  setLastKeys(["soul"]);
                  setTick((n) => n + 1);
                }}
                aria-pressed={gender === g}
              >
                {t.vessel[g]}
              </button>
            ))}
          </div>
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
            {t.all}
          </button>
          {FILTER_ORDER.map((k) => {
            const a = archL(k, gender, lang);
            return (
              <button
                key={k}
                className={filter === k ? "on" : ""}
                style={{ ["--c" as string]: a.color }}
                onClick={() => setFilter(k)}
              >
                {a.glyph} {a.name}
              </button>
            );
          })}
        </div>

        {list.map((p, i) => {
          const on = picked.includes(p.id);
          const a = archL(p.for, gender, lang);
          return (
            <article key={p.id} className={`practice ${on ? "on" : ""}`} style={{ ["--c" as string]: a.color }}>
              <button className="practice-head" onClick={() => toggle(p.id)} aria-pressed={on}>
                <span className="mono dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="practice-title display">{pick(p.title, gender)}</span>
                <span className="check">{on ? "✓" : "+"}</span>
              </button>
              <div className="practice-body">
                <p className="mono dim">
                  {a.glyph} {a.name} · {pick(p.time, gender)}
                </p>
                <p>{pick(p.how, gender)}</p>
                <p className="why">{pick(p.why, gender)}</p>
                <div className="effects">
                  {(Object.entries(p.deltas) as [ArchetypeKey, number][]).map(([k, v]) => {
                    const e = archL(k, gender, lang);
                    return (
                      <span key={k} className="effect" style={{ ["--c" as string]: e.color }}>
                        {e.name} {v > 0 ? "▲" : "▼"}
                      </span>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
