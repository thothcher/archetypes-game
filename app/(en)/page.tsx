import HomePage from "@/components/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", "en");

export default function Page() {
  return <HomePage lang="en" />;
}
