import type { Lang } from "@/lib/locale";
import JsonLd from "./JsonLd";
import Practices, { PracticesHero } from "./Practices";

export default function PracticesPage({ lang }: { lang: Lang }) {
  return (
    <main id="main" className="practices-page">
      <JsonLd page="practices" lang={lang} />
      <PracticesHero />
      <Practices />
    </main>
  );
}
