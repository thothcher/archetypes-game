import type { Metadata } from "next";
import {
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Noto_Sans_Georgian,
  Noto_Serif_Georgian,
} from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Georgian script: the Latin fonts above have no Georgian glyphs, so the browser falls back to these per character.
const serifKa = Noto_Serif_Georgian({ subsets: ["georgian"], weight: ["300", "400"], variable: "--font-serif-ka" });
const sansKa = Noto_Sans_Georgian({ subsets: ["georgian"], weight: ["400", "500"], variable: "--font-sans-ka" });

export const metadata: Metadata = {
  title: "VAS · The Hermetic Vessel",
  description:
    "A gamified journey through Jung's four archetypes (Persona, Shadow, Anima/Animus and Self) as living fluids. · იუნგის ოთხი არქეტიპი თამაშად.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${serifKa.variable} ${sansKa.variable}`}
    >
      <body>
        <LangProvider>
          <div className="grain" aria-hidden />
          <Nav />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
