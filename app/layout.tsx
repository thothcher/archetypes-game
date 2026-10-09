import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SITE, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
// Body text paints at once in a size-matched fallback; the web font is used as soon as it is cached.
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "optional" });
// Small labels only: let it swap in instead of competing with the hero fonts for bandwidth.
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE + "/"),
  applicationName: SITE_NAME,
  title: { default: SITE_NAME, template: "%s · VAS" },
  description:
    "A gamified journey through Jung's four archetypes (Persona, Shadow, Anima/Animus and Self) as living fluids.",
  robots: { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: false, email: false, address: false },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#07060b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Mark the document Georgian before first paint on /ka/ pages (the subtree also carries lang="ka").
const setLang = `(function(){if(/\\/ka(\\/|$)/.test(location.pathname))document.documentElement.lang="ka"})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setLang }} />
      </head>
      <body>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
