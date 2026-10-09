import HomePage from "@/components/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", "ka");

export default function Page() {
  return <HomePage lang="ka" />;
}
