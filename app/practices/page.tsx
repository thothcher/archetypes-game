import type { Metadata } from "next";
import Practices, { PracticesHero } from "@/components/Practices";

export const metadata: Metadata = {
  title: "Practices of Balance · VAS",
  description:
    "Jungian practices to loosen the Persona, integrate the Shadow, relate to the Anima or Animus, and live closer to the Self.",
};

export default function PracticesPage() {
  return (
    <main className="practices-page">
      <PracticesHero />
      <Practices />
    </main>
  );
}
