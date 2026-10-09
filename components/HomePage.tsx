import type { Lang } from "@/lib/locale";
import Faq from "./Faq";
import Game from "./Game";
import Intro from "./Intro";
import JsonLd from "./JsonLd";

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <main id="main">
      <JsonLd page="home" lang={lang} />
      <Intro />
      <Game />
      <Faq />
    </main>
  );
}
