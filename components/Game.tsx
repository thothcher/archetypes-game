"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { useLang, type Lang } from "@/lib/i18n";
import { SCENARIOS, biggestMovers, localizeScenario, type Choice } from "@/lib/scenarios";
import { chime } from "@/lib/sound";
import { UI_TEXT, type UI } from "@/lib/ui";
import { useGender } from "@/lib/useGender";

const FluidAvatar = dynamic(() => import("./FluidAvatar"), {
  ssr: false,
  loading: () => <div className="avatar avatar-loading">…</div>,
});

type Phase = "gender" | "choose" | "predict" | "reveal" | "end";

interface Step {
  /** index into SCENARIOS / its choices, so the path re-renders in the current language */
  scenario: number;
  choice: number;
  guessed: ArchetypeKey | null;
  correct: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;
const GENDERS: Gender[] = ["man", "woman"];
/** Top-to-bottom as in the body: Persona (face), Self, soul-image, Shadow (feet). */
const PREDICT_ORDER: ArchetypeKey[] = [...ORDER].reverse();

export default function Game() {
  const { lang } = useLang();
  const t = UI_TEXT[lang].game;
  const [gender, setGender] = useGender();
  const [psyche, setPsyche] = useState<Psyche>(START);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("gender");
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null);
  const [guess, setGuess] = useState<ArchetypeKey | null>(null);
  const [history, setHistory] = useState<Step[]>([]);
  const [pulseTick, setPulseTick] = useState(0);
  const [pulseKeys, setPulseKeys] = useState<ArchetypeKey[]>([]);
  const [predictMode, setPredictMode] = useState(true);
  const rightRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);

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
  const choice: Choice | null = choiceIdx === null ? null : scenario.choices[choiceIdx];
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
    setPulseKeys(["soul"]);
    setPulseTick((n) => n + 1);
    setPhase("choose");
  }

  function choose(i: number) {
    setChoiceIdx(i);
    if (predictMode) setPhase("predict");
    else commit(i, null);
  }

  function commit(i: number, guessed: ArchetypeKey | null) {
    const d = pick(scenario.choices[i].deltas, g);
    const movers = biggestMovers(d);
    setGuess(guessed);
    setPsyche((p) => applyDeltas(p, d));
    setPulseKeys(Object.keys(d) as ArchetypeKey[]);
    setPulseTick((n) => n + 1);
    setHistory((h) => [...h, { scenario: idx, choice: i, guessed, correct: !!guessed && movers.includes(guessed) }]);
    chime((d.self ?? 0) - (d.shadow ?? 0) >= 0 ? "light" : "dark");
    setPhase("reveal");
  }

  function next() {
    setChoiceIdx(null);
    setGuess(null);
    if (idx + 1 >= SCENARIOS.length) setPhase("end");
    else {
      setIdx(idx + 1);
      setPhase("choose");
    }
  }

  function restart() {
    setPsyche(START);
    setIdx(0);
    setHistory([]);
    setChoiceIdx(null);
    setGuess(null);
    setPhase("gender");
    setPulseKeys(ORDER);
    setPulseTick((n) => n + 1);
  }

  // GTA-style keyboard: 1–4 to pick, Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      const n = parseInt(e.key, 10);
      if (phase === "gender" && (n === 1 || n === 2)) chooseGender(GENDERS[n - 1]);
      else if (phase === "choose" && n >= 1 && n <= scenario.choices.length) choose(n - 1);
      else if (phase === "predict" && n >= 1 && n <= 4 && choiceIdx !== null) commit(choiceIdx, PREDICT_ORDER[n - 1]);
      else if (phase === "reveal" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ind = individuation(psyche);
  const lastStep = history[history.length - 1];

  return (
    <section className="game" id="experience">
      <div className="section-head">
        <span className="mono">{t.label}</span>
        <h2 className="display">
          {t.title1} <em>{t.title2}</em>
        </h2>
      </div>

      <div className="stage">
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
                      <span>
                        {a.glyph} {a.name}
                      </span>
                      <span className="mono">{psyche[k].toFixed(1)}%</span>
                    </div>
                    <div className="meter-track">
                      <motion.div
                        className="meter-fill"
                        animate={{ width: `${psyche[k]}%` }}
                        transition={{ duration: 1.2, ease }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <IndividuationRing value={ind} t={t} />
          </div>

          <FluidAvatar
            psyche={psyche}
            gender={phase === "gender" ? gender : g}
            pulseTick={pulseTick}
            pulseKeys={pulseKeys}
          />
          <p className="mono dim drag-hint">{t.dragHint}</p>
        </div>

        <div className="stage-right" ref={rightRef}>
          <AnimatePresence mode="wait">
            {phase === "gender" && (
              <motion.div
                key="gender"
                className="card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease }}
              >
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
                        <span className="key">{i + 1}</span>
                        <span className="gender-title display">{t.gender[opt]}</span>
                        <span className="gender-soul">
                          {s.glyph} {t.carries[opt]}
                        </span>
                        <span className="gender-desc">{s.essence}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {phase === "choose" && (
              <motion.div
                key={`c-${scenario.id}`}
                className="card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease }}
              >
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
                        <span className="key">{i + 1}</span>
                        <span className="choice-body">
                          <span className="choice-label">{c.label}</span>
                          <span className="choice-line">{c.line}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
                <label className="toggle mono">
                  <input type="checkbox" checked={predictMode} onChange={(e) => setPredictMode(e.target.checked)} />
                  <span /> {t.predictToggle}
                </label>
              </motion.div>
            )}

            {phase === "predict" && choice && choiceIdx !== null && (
              <motion.div
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
                        <span className="key">{i + 1}</span>
                        <span className="glyph">{a.glyph}</span>
                        <span>{a.name}</span>
                      </button>
                    );
                  })}
                </div>
                <button className="link mono" onClick={() => commit(choiceIdx, null)}>
                  {t.skip}
                </button>
              </motion.div>
            )}

            {phase === "reveal" && choice && (
              <motion.div
                key={`r-${scenario.id}`}
                className="card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease }}
              >
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
                        <span className="glyph">{a.glyph}</span>
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
                  {idx + 1 >= SCENARIOS.length ? t.seeVessel : t.next} <span className="mono">↵</span>
                </button>
              </motion.div>
            )}

            {phase === "end" && (
              <motion.div
                key="end"
                className="card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                <Ending psyche={psyche} history={history} gender={g} lang={lang} t={t} />
                <div className="end-actions">
                  <button className="cta" onClick={restart}>
                    {t.again}
                  </button>
                  <Link className="cta ghost" href="/practices/">
                    {t.toPractices}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function IndividuationRing({ value, t }: { value: number; t: UI["game"] }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" title={t.ringTitle}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} className="ring-bg" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          className="ring-fg"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.2, ease }}
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
