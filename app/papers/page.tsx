import PapersClientPage from "./PapersClientPage";
import papersData from "@/data/papers/papers.json";
import type { Metadata } from "next";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/papers";

export const metadata: Metadata = {
  title: "Papers",
  description: "Research papers and academic inquiries across multiple disciplines",
};

export default function PapersPage() {
  // Map and sort papers by date (newest first)
  const papers: PaperMeta[] = papersData.papers.map(paperItem => ({
    ...paperItem,
    status: paperItem.status as PaperStatus,
    confidence: paperItem.confidence as PaperConfidence
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="papers-container">
      <PapersClientPage papers={papers} initialCategory="all" />
    </div>
  );
}