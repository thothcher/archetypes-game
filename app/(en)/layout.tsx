import SiteShell from "@/components/SiteShell";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
