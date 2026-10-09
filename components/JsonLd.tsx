import type { Lang } from "@/lib/locale";
import { jsonLd, type PageId } from "@/lib/seo";

/** Structured data for search engines, rendered into the static HTML. */
export default function JsonLd({ page, lang }: { page: PageId; lang: Lang }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page, lang)).replace(/</g, "\\u003c") }}
    />
  );
}
