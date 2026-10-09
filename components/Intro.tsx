"use client";

import { ALL, namedL, type Archetype } from "@/lib/archetypes";
import { rich, useLang } from "@/lib/i18n";
import { UI_TEXT, type UI } from "@/lib/ui";

export default function Intro() {
  const { lang } = useLang();
  const t = UI_TEXT[lang];
  const [persona, self, anima, animus, shadow] = (["persona", "self", "anima", "animus", "shadow"] as const).map(
    (id) => namedL(id, lang)
  );

  return (
    <>
      <section className="hero">
        <div className="blobs" aria-hidden>
          <span className="b b-self" />
          <span className="b b-anima" />
          <span className="b b-animus" />
          <span className="b b-shadow" />
        </div>
        <div className="hero-inner">
          <p className="mono dim hero-kicker">{t.hero.kicker}</p>
          <h1 className="display hero-title">
            {t.hero.title1}
            <br />
            <em>{t.hero.title2}</em>
          </h1>
          <p className="hero-sub">{t.hero.sub}</p>
        </div>
        <a href="#waters" className="scroll-cue mono">
          <span className="line" /> {t.hero.scroll}
        </a>
      </section>

      <section className="waters" id="waters">
        <div className="section-head">
          <span className="mono">{t.waters.label}</span>
          <h2 className="display">
            {t.waters.title1} <em>{t.waters.title2}</em>
          </h2>
        </div>
        <div className="water-grid">
          <WaterCard n={1} a={persona} t={t.waters} />
          <WaterCard n={2} a={self} t={t.waters} />

          <article
            className="water soul"
            style={{ ["--c" as string]: ALL.anima.color, ["--c2" as string]: ALL.animus.color }}
          >
            <div className="water-top">
              <span className="mono dim">03</span>
              <span className="water-glyph">
                <span style={{ color: anima.color }}>{anima.glyph}</span>{" "}
                <span style={{ color: animus.color }}>{animus.glyph}</span>
              </span>
            </div>
            <h3 className="display">
              <span style={{ color: anima.color }}>{anima.name}</span>
              <span className="dim"> / </span>
              <span style={{ color: animus.color }}>{animus.name}</span>
            </h3>
            <p>{t.waters.soulText}</p>
            <p className="water-light">
              <span className="mono" style={{ color: anima.color }}>
                {t.waters.animaInMan}
              </span>
              {anima.light}
            </p>
            <p className="water-light">
              <span className="mono" style={{ color: animus.color }}>
                {t.waters.animusInWoman}
              </span>
              {animus.light}
            </p>
            <p className="water-dark">
              <span className="mono">{t.waters.unconscious}</span> {t.waters.soulDark}
            </p>
          </article>

          <WaterCard n={4} a={shadow} t={t.waters} />
        </div>
        <p className="note">
          <span className="mono">{t.waters.noteLabel}</span> {rich(t.waters.note)}
        </p>
      </section>
    </>
  );
}

function WaterCard({ n, a, t }: { n: number; a: Archetype; t: UI["waters"] }) {
  return (
    <article className="water" style={{ ["--c" as string]: a.color }}>
      <div className="water-top">
        <span className="mono dim">0{n}</span>
        <span className="water-glyph">{a.glyph}</span>
      </div>
      <h3 className="display">{a.name}</h3>
      <p>{a.essence}</p>
      <p className="water-light">
        <span className="mono">{t.integrated}</span> {a.light}
      </p>
      <p className="water-dark">
        <span className="mono">{t.unconscious}</span> {a.dark}
      </p>
    </article>
  );
}
