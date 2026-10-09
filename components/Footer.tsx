"use client";

import { useLang } from "@/lib/i18n";
import { UI_TEXT } from "@/lib/ui";

export default function Footer() {
  const t = UI_TEXT[useLang().lang].footer;
  return (
    <footer className="footer">
      <span className="mono dim">{t.about}</span>
      <span className="mono dim">{t.care}</span>
    </footer>
  );
}
