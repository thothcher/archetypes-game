import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import SiteShell from "@/components/SiteShell";

// Georgian fonts live here so they are only downloaded (and preloaded) on Georgian pages.
const serifKa = Noto_Serif_Georgian({ subsets: ["georgian"], weight: ["300"], variable: "--font-serif-ka" });
const sansKa = Noto_Sans_Georgian({ subsets: ["georgian"], weight: ["400", "500"], variable: "--font-sans-ka" });

export default function GeorgianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ka" className={`ka-fonts ${serifKa.variable} ${sansKa.variable}`}>
      <SiteShell lang="ka">{children}</SiteShell>
    </div>
  );
}
