"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  ORDER,
  SOUL,
  START,
  applyDeltas,
  archL,
  dominant,
  individuation,
  pick,
  type ArchetypeKey,
  type Gender,
  type Psyche,
} from "@/lib/archetypes";
import { INITIAL, setGame, useGame, type Step } from "@/lib/gameStore";
import { useLang } from "@/lib/i18n";
import { localePath, type Lang } from "@/lib/locale";
import { SCENARIOS, biggestMovers, localizeScenario } from "@/lib/scenarios";
import { chime } from "@/lib/sound";
import { UI_TEXT, type UI } from "@/lib/ui";
import { useGender } from "@/lib/useGender";
import FluidAvatar from "./FluidAvatar";

// Animation features load after the page is interactive.
const loadMotion = () => import("@/lib/motionFeatures").then((r) => r.default);

const ease = [0.22, 1, 0.36, 1] as const;
const GENDERS: Gender[] = ["man", "woman"];
/** Top-to-bottom as in the body: Persona (face), Self, soul-image, Shadow (feet). */
const PREDICT_ORDER: ArchetypeKey[] = [...ORDER].reverse();

export default function Game() {
  const { lang } = useLang();
  const t = UI_TEXT[lang].game;
  const [gender, setGender] = useGender();
  const { psyche, idx, phase, choiceIdx, guess, history, pulseTick, pulseKeys, predictMode } = useGame();
  const stageRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const firstStep = useRef(true);

  // Keyboard shortcuts only apply while the game is actually on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(stageRef.current!);
    return () => io.disconnect();
  }, []);

  // On phones the vessel is pinned on top: bring each new card up beneath it.
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = rightRef.current;
    if (!el || !window.matchMedia("(max-width: 860px)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.5) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase, idx]);

  const g: Gender = gender ?? "man";
  const scenario = localizeScenario(SCENARIOS[idx], lang);
  const choice = choiceIdx === null ? null : scenario.choices[choiceIdx];
  const score = history.filter((h) => h.correct).length;
  const guesses = history.filter((h) => h.guessed).length;
  const deltas = choice ? pick(choice.deltas, g) : {};
  const name = (k: ArchetypeKey) => archL(k, g, lang).name;

  function look(k: ArchetypeKey) {
    if (!gender && k === "soul") return { name: t.soulBoth, glyph: "☾△", color: "#b98ee0" };
    return archL(k, g, lang);
  }

  function chooseGender(next: Gender) {
    setGender(next);
    setGame((s) => ({ phase: "choose", pulseKeys: ["soul"], pulseTick: s.pulseTick + 1 }));
  }

  function choose(i: number) {
    if (predictMode) setGame({ choiceIdx: i, phase: "predict" });
    else commit(i, null);
  }

  function commit(i: number, guessed: ArchetypeKey | null) {
    const d = pick(scenario.choices[i].deltas, g);
    const correct = !!guessed && biggestMovers(d).includes(guessed);
    setGame((s) => ({
      choiceIdx: i,
      guess: guessed,
      psyche: applyDeltas(s.psyche, d),
      pulseKeys: Object.keys(d) as ArchetypeKey[],
      pulseTick: s.pulseTick + 1,
      history: [...s.history, { scenario: idx, choice: i, guessed, correct }],
      phase: "reveal",
    }));
    chime((d.self ?? 0) - (d.shadow ?? 0) >= 0 ? "light" : "dark");
  }

  function next() {
    if (idx + 1 >= SCENARIOS.length) setGame({ choiceIdx: null, guess: null, phase: "end" });
    else setGame({ choiceIdx: null, guess: null, idx: idx + 1, phase: "choose" });
  }

  function restart() {
    setGame((s) => ({ ...INITIAL, predictMode: s.predictMode, psyche: START, pulseKeys: ORDER, pulseTick: s.pulseTick + 1 }));
  }

  // GTA-style keyboard: 1–4 to pick, Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const n = parseInt(e.key, 10);
      if (phase === "gender" && (n === 1 || n === 2)) chooseGender(GENDERS[n - 1]);
      else if (phase === "choose" && n >= 1 && n <= scenario.choices.length) choose(n - 1);
      else if (phase === "predict" && n >= 1 && n <= 4 && choiceIdx !== null) commit(choiceIdx, PREDICT_ORDER[n - 1]);
      else if (phase === "reveal" && (e.key === "Enter" || e.key === " ")) {
        if (tag === "BUTTON" || tag === "A") return; // let the focused control do its own thing
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ind = individuation(psyche);
  const lastStep = history[history.length - 1];
  const card = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: { duration: 0.6, ease } };

  return (
    <section className="game" id="experience" aria-labelledby="game-title">
      <div className="section-head">
        <span className="mono">{t.label}</span>
        <h2 className="display" id="game-title">
          {t.title1} <em>{t.title2}</em>
        </h2>
      </div>

      <LazyMotion features={loadMotion} strict>
        <div className="stage" ref={stageRef}>
          <div className="stage-left">
            <div className="hud">
              <div className="hud-row">
                <span className="mono dim">
                  {phase === "gender" ? "00" : String(Math.min(idx + 1, SCENARIOS.length)).padStart(2, "0")} /{" "}
                  {SCENARIOS.length}
                </span>
                <span className="mono dim">
                  {t.insight} {score}/{guesses}
                </span>
              </div>
              <div className="meters">
                {PREDICT_ORDER.map((k) => {
                  const a = look(k);
                  return (
                    <div className="meter" key={k} style={{ ["--c" as string]: a.color }}>
                      <div className="meter-top">
                        <span className="meter-name">
                          {a.glyph} {a.name}
                        </span>
                        <span className="mono">{psyche[k].toFixed(1)}%</span>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill" style={{ transform: `scaleX(${psyche[k] / 100})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <IndividuationRing value={ind} t={t} />
            </div>

            <FluidAvatar psyche={psyche} gender={phase === "gender" ? gender : g} pulseTick={pulseTick} pulseKeys={pulseKeys} />
            <p className="mono dim drag-hint" aria-hidden>
              {t.dragHint}
            </p>
          </div>

          <div className="stage-right" ref={rightRef} aria-live="polite">
            <AnimatePresence mode="wait">
              {phase === "gender" && (
                <m.div key="gender" className="card" {...card}>
                  <div className="card-meta">
                    <span className="tag riddle">{t.beforeBegin}</span>
                  </div>
                  <h3 className="display card-title">
                    {t.choose1} <em>{t.choose2}</em>
                  </h3>
                  <p className="prompt">
                    {t.genderIntro(
                      <b style={{ color: SOUL.man.color }}>{archL("soul", "man", lang).name}</b>,
                      <b style={{ color: SOUL.woman.color }}>{archL("soul", "woman", lang).name}</b>
                    )}
                  </p>
                  <div className="gender-grid">
                    {GENDERS.map((opt, i) => {
                      const s = archL("soul", opt, lang);
                      return (
                        <button
                          key={opt}
                          className={`gender ${gender === opt ? "on" : ""}`}
                          style={{ ["--c" as string]: s.color }}
                          onClick={() => chooseGender(opt)}
                        >
                          <span className="key" aria-hidden>
                            {i + 1}
                          </span>
                          <span className="gender-title display">{t.gender[opt]}</span>
                          <span className="gender-soul">
                            {s.glyph} {t.carries[opt]}
                          </span>
                          <span className="gender-desc">{s.essence}</span>
                        </button>
                      );
                    })}
                  </div>
                </m.div>
              )}

              {phase === "choose" && (
                <m.div key={`c-${scenario.id}`} className="card" {...card}>
                  <div className="card-meta">
                    <span className={`tag ${scenario.kind}`}>{scenario.kind === "riddle" ? t.riddle : t.situation}</span>
                    <span className="mono dim">{scenario.place}</span>
                  </div>
                  <h3 className="display card-title">{scenario.title}</h3>
                  {scenario.speaker && <p className="mono speaker">{scenario.speaker}</p>}
                  <p className="prompt">{pick(scenario.prompt, g)}</p>

                  <ol className="choices">
                    {scenario.choices.map((c, i) => (
                      <li key={i}>
                        <button onClick={() => choose(i)} className="choice">
                          <span className="key" aria-hidden>
                            {i + 1}
                          </span>
                          <span className="choice-body">
                            <span className="choice-label">{c.label}</span>
                            <span className="choice-line">{c.line}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <label className="toggle mono">
                    <input
                      type="checkbox"
                      checked={predictMode}
                      onChange={(e) => setGame({ predictMode: e.target.checked })}
                    />
                    <span aria-hidden /> {t.predictToggle}
                  </label>
                </m.div>
              )}

              {phase === "predict" && choice && choiceIdx !== null && (
                <m.div
                  key="predict"
                  className="card"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <span className="mono dim">{t.youChose}</span>
                  <p className="chosen">{choice.line}</p>
                  <h3 className="display card-title small">
                    {t.predict1} <em>{t.predict2}</em>
                  </h3>
                  <div className="predict-grid">
                    {PREDICT_ORDER.map((k, i) => {
                      const a = archL(k, g, lang);
                      return (
                        <button
                          key={k}
                          className="predict"
                          style={{ ["--c" as string]: a.color }}
                          onClick={() => commit(choiceIdx, k)}
                        >
                          <span className="key" aria-hidden>
                            {i + 1}
                          </span>
                          <span className="glyph" aria-hidden>
                            {a.glyph}
                          </span>
                          <span>{a.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button className="link mono" onClick={() => commit(choiceIdx, null)}>
                    {t.skip}
                  </button>
                </m.div>
              )}

              {phase === "reveal" && choice && (
                <m.div key={`r-${scenario.id}`} className="card" {...card}>
                  {guess && (
                    <p className={`verdict ${lastStep?.correct ? "ok" : "no"}`}>
                      {lastStep?.correct ? t.right : t.notQuite(biggestMovers(deltas).map(name).join(t.and))}
                    </p>
                  )}
                  <p className="chosen">{choice.line}</p>
                  <div className="deltas">
                    {PREDICT_ORDER.map((k) => {
                      const v = deltas[k] ?? 0;
                      const a = archL(k, g, lang);
                      return (
                        <div
                          key={k}
                          className={`delta ${v > 0 ? "up" : v < 0 ? "down" : "flat"}`}
                          style={{ ["--c" as string]: a.color }}
                        >
                          <span className="glyph" aria-hidden>
                            {a.glyph}
                          </span>
                          <span>{a.name}</span>
                          <span className="mono">{v > 0 ? `▲ +${v}` : v < 0 ? `▼ ${v}` : "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="insight">{pick(choice.insight, g)}</p>
                  {scenario.quote && (
                    <blockquote>
                      {lang === "ka" ? `„${scenario.quote.text}“` : `“${scenario.quote.text}”`}
                      <cite className="mono">{scenario.quote.source}</cite>
                    </blockquote>
                  )}
                  <button className="cta" onClick={next}>
                    {idx + 1 >= SCENARIOS.length ? t.seeVessel : t.next} <span className="mono" aria-hidden>↵</span>
                  </button>
                </m.div>
              )}

              {phase === "end" && (
                <m.div key="end" className="card" {...card}>
                  <Ending psyche={psyche} history={history} gender={g} lang={lang} t={t} />
                  <div className="end-actions">
                    <button className="cta" onClick={restart}>
                      {t.again}
                    </button>
                    <Link className="cta ghost" href={localePath("/practices/", lang)}>
                      {t.toPractices}
                    </Link>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LazyMotion>
    </section>
  );
}

function IndividuationRing({ value, t }: { value: number; t: UI["game"] }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" title={t.ringTitle}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={r} className="ring-bg" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className="ring-fg"
          strokeDasharray={c}
          style={{ strokeDashoffset: c * (1 - value / 100) }}
        />
      </svg>
      <div>
        <div className="ring-val">{value}</div>
        <div className="mono dim">{t.individuation}</div>
      </div>
    </div>
  );
}

function Ending({
  psyche,
  history,
  gender,
  lang,
  t,
}: {
  psyche: Psyche;
  history: Step[];
  gender: Gender;
  lang: Lang;
  t: UI["game"];
}) {
  const dom = dominant(psyche);
  const a = archL(dom, gender, lang);
  const ind = individuation(psyche);
  const guesses = history.filter((h) => h.guessed);
  const correct = guesses.filter((h) => h.correct).length;
  const band = ind >= 70 ? t.bandClear : ind >= 45 ? t.bandUnderway : t.bandNigredo;
  const reading = dom === "soul" ? t.readings.soul[gender] : t.readings[dom];
  return (
    <div className="ending">
      <span className="mono dim">{t.afterDay}</span>
      <h3 className="display card-title">{band}</h3>
      <p className="ending-dom" style={{ color: a.color }}>
        {a.glyph} {t.dominant} {a.name}
      </p>
      <p className="insight">{reading}</p>
      <div className="end-stats">
        <div>
          <span className="big">{ind}</span>
          <span className="mono dim">{t.individuation}</span>
        </div>
        <div>
          <span className="big">{guesses.length ? Math.round((correct / guesses.length) * 100) : "—"}%</span>
          <span className="mono dim">{t.intuition}</span>
        </div>
        <div>
          <span className="big">{psyche.shadow.toFixed(0)}%</span>
          <span className="mono dim">{t.unintegrated}</span>
        </div>
        <div>
          <span className="big">{psyche.persona.toFixed(0)}%</span>
          <span className="mono dim">{t.mask}</span>
        </div>
      </div>
      <details className="journey">
        <summary className="mono">{t.path}</summary>
        <ol>
          {history.map((h) => {
            const s = localizeScenario(SCENARIOS[h.scenario], lang);
            return (
              <li key={h.scenario}>
                <span className="mono dim">{s.title}</span> {s.choices[h.choice].line}
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
