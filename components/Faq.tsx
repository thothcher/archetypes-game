"use client";

import { useLang } from "@/lib/i18n";
import { UI_TEXT } from "@/lib/ui";

/** Questions people actually search for, answered in plain words (also exposed as FAQPage data). */
export default function Faq() {
  const t = UI_TEXT[useLang().lang].faq;
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <span className="mono">{t.label}</span>
        <h2 className="display" id="faq-title">
          {t.title1} <em>{t.title2}</em>
        </h2>
      </div>
      <div className="faq-list">
        {t.items.map((f, i) => (
          <details key={i} open={i === 0}>
            <summary>
              <h3>{f.q}</h3>
              <span className="faq-plus" aria-hidden>
                +
              </span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
