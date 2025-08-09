import PapersClientPage from "./PapersClientPage";
import papersData from "@/data/papers/papers.json";
import type { Metadata } from "next";
import type { PaperMeta, PaperStatus, PaperConfidence } from "@/types/papers";
import { staticMetadata } from "@/lib/staticMetadata";

export const metadata: Metadata = staticMetadata.papers;

export default function PapersPage() {
  // Filter out hidden papers, then map and sort by date (newest first)
  const papers: PaperMeta[] = papersData.papers
    .filter(paperItem => paperItem.state !== "hidden")
    .map(paperItem => ({
      ...paperItem,
      status: paperItem.status as PaperStatus,
      confidence: paperItem.confidence as PaperConfidence
    }))
    .sort((a, b) => {
      const dateA = a.end_date || a.start_date;
      const dateB = b.end_date || b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="papers-container">
      <PapersClientPage papers={papers} initialCategory="all" />
    </div>
  );
}