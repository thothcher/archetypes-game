import PracticesPage from "@/components/PracticesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("practices", "ka");

export default function Page() {
  return <PracticesPage lang="ka" />;
}
