import type { MetadataRoute } from "next";
import { SITE, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "VAS",
    description: "A gamified lesson on Jung's archetypes: Persona, Shadow, Anima/Animus and Self.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#07060b",
    theme_color: "#07060b",
    categories: ["education", "games"],
    lang: "en",
    icons: [
      { src: `${SITE}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${SITE}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${SITE}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
