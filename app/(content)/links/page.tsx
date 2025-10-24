import LinksClientPage from "./LinksClientPage";
import linksData from "@/data/links/links.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.links;

export default function LinksPage() {
  // Sort links by date (newest first)
  const links = [...linksData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="links-container">
      <LinksClientPage links={links} initialCategory="all" />
    </div>
  );
}
