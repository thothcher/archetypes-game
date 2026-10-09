import { LangProvider } from "@/lib/i18n";
import type { Lang } from "@/lib/locale";
import Footer from "./Footer";
import Nav from "./Nav";

const SKIP: Record<Lang, string> = { en: "Skip to content", ka: "გადადი შინაარსზე" };

/** Everything around the page content, in one language. */
export default function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <LangProvider lang={lang}>
      <a className="skip" href="#main">
        {SKIP[lang]}
      </a>
      <Nav />
      {children}
      <Footer />
    </LangProvider>
  );
}
