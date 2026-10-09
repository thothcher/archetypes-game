import PracticesPage from "@/components/PracticesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("practices", "en");

export default function Page() {
  return <PracticesPage lang="en" />;
}
