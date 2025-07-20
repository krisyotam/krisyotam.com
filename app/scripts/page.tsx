import ScriptsClientPage from "./ScriptsClientPage";
import scriptsData from "@/data/scripts/scripts.json";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.scripts;

export default function ScriptsPage() {
  // Sort scripts by date (newest first)
  const scripts = [...scriptsData.scripts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="scripts-container">
      <ScriptsClientPage scripts={scripts} initialCategory="all" />
    </div>
  );
}
