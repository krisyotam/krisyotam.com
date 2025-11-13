import LexiconClientPage from "./LexiconClientPage";
import lexiconData from "@/data/lexicon/lexicon.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexicon",
  description: "A searchable list of words and phrases from my lexicon.",
};

export default function LexiconPage() {
  // Filter lexicon to only show active ones and sort by date (newest first)
  const active = (lexiconData as any[]).filter((item) => item.state === "active");
  const items = [...active].sort((a, b) => new Date(b.start_date || "1970-01-01").getTime() - new Date(a.start_date || "1970-01-01").getTime());

  return (
    <div className="lexicon-container">
      <LexiconClientPage items={items} initialCategory="all" />
    </div>
  );
}
