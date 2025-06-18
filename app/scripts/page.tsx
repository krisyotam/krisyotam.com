import ScriptsClientPage from "./ScriptsClientPage";
import scriptsData from "@/data/scripts/scripts.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scripts",
  description: "A collection of useful scripts and utilities",
};

export default function ScriptsPage() {
  // Sort scripts by date (newest first)
  const scripts = [...scriptsData.scripts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="scripts-container">
      <ScriptsClientPage scripts={scripts} initialCategory="all" />
    </div>
  );
}
