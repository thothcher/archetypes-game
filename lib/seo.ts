import type { Metadata } from "next";
import { localePath, type Lang } from "./locale";
import { UI_TEXT } from "./ui";

/** Public origin + base path of the deployed site. Canonical URLs always point here. */
export const SITE = "https://thothcher.github.io/archetypes-game";
export const SITE_NAME = "VAS · The Hermetic Vessel";

export type PageId = "home" | "practices";
const PATHS: Record<PageId, string> = { home: "/", practices: "/practices/" };

export const url = (page: PageId, lang: Lang) => SITE + localePath(PATHS[page], lang);

const COPY: Record<Lang, Record<PageId, { title: string; description: string }>> = {
  en: {
    home: {
      title: "Jung's Archetypes Game: Persona, Shadow, Anima/Animus & Self",
      description:
        "A free interactive lesson on Carl Jung's four archetypes. Make everyday choices and watch the Persona, Shadow, Anima or Animus and Self shift as fluids inside a 3D glass body.",
    },
    practices: {
      title: "Jungian Practices for Shadow Work and Individuation",
      description:
        "15 exercises from analytical psychology: shadow work, a projection log, a dream journal, active imagination, mandala drawing and more. Tick them and watch your vessel rebalance.",
    },
  },
  ka: {
    home: {
      title: "იუნგის არქეტიპები: თამაში პერსონაზე, ჩრდილზე, ანიმა/ანიმუსსა და თვითობაზე",
      description:
        "უფასო ინტერაქტიული გაკვეთილი კარლ გუსტავ იუნგის ოთხ არქეტიპზე. მიიღე ყოველდღიური გადაწყვეტილებები და უყურე, როგორ იცვლება პერსონა, ჩრდილი, ანიმა ან ანიმუსი და თვითობა მინის სხეულში.",
    },
    practices: {
      title: "იუნგიანური პრაქტიკები: ჩრდილთან მუშაობა და ინდივიდუაცია",
      description:
        "15 სავარჯიშო ანალიტიკური ფსიქოლოგიიდან: ჩრდილთან მუშაობა, პროექციების დღიური, სიზმრების დღიური, აქტიური წარმოსახვა, მანდალა და სხვა. მონიშნე და უყურე, როგორ ბალანსდება შენი ჭურჭელი.",
    },
  },
};

const OG_LOCALE: Record<Lang, string> = { en: "en_US", ka: "ka_GE" };

export function pageMetadata(page: PageId, lang: Lang): Metadata {
  const { title, description } = COPY[lang][page];
  const image = { url: `${SITE}/og-${lang}.png`, width: 1200, height: 630, alt: title, type: "image/png" };
  return {
    title,
    description,
    alternates: {
      canonical: url(page, lang),
      languages: { en: url(page, "en"), ka: url(page, "ka"), "x-default": url(page, "en") },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: url(page, lang),
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === "en" ? "ka" : "en"],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

const JUNG = {
  "@type": "Person",
  name: "Carl Gustav Jung",
  sameAs: "https://en.wikipedia.org/wiki/Carl_Jung",
};

/** schema.org graph for a page: the site, the learning resource itself and, on the home page, the FAQ. */
export function jsonLd(page: PageId, lang: Lang) {
  const { title, description } = COPY[lang][page];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: SITE_NAME,
      inLanguage: ["en", "ka"],
    },
    {
      "@type": ["LearningResource", "WebPage"],
      "@id": `${url(page, lang)}#page`,
      url: url(page, lang),
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": `${SITE}/#website` },
      learningResourceType: page === "home" ? "Interactive game" : "Exercises",
      educationalUse: ["self-study", "classroom"],
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      isAccessibleForFree: true,
      about: [
        { "@type": "Thing", name: "Analytical psychology", sameAs: "https://en.wikipedia.org/wiki/Analytical_psychology" },
        { "@type": "Thing", name: "Jungian archetypes", sameAs: "https://en.wikipedia.org/wiki/Jungian_archetypes" },
        JUNG,
      ],
      teaches: ["Persona", "Shadow", "Anima and Animus", "Self", "Individuation", "Projection"],
      image: `${SITE}/og-${lang}.png`,
      author: { "@type": "Person", name: "thothcher", url: "https://github.com/thothcher" },
    },
  ];
  if (page === "home") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url(page, lang)}#faq`,
      inLanguage: lang,
      mainEntity: UI_TEXT[lang].faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
