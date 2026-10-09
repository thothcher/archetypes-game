import type { MetadataRoute } from "next";
import { url, type PageId } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: PageId[] = ["home", "practices"];
  return pages.flatMap((page) =>
    (["en", "ka"] as const).map((lang) => ({
      url: url(page, lang),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: { languages: { en: url(page, "en"), ka: url(page, "ka"), "x-default": url(page, "en") } },
    }))
  );
}
