/**
 * =============================================================================
 * Papers Page
 * =============================================================================
 *
 * Server component for the papers listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import PapersClientPage from "./PapersClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import type { PaperStatus, PaperConfidence } from "@/types/content";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.papers;

// =============================================================================
// Page Component
// =============================================================================

export default async function PapersPage() {
  // Fetch data from database
  const rawPapers = getActiveContentByType('papers');
  const categories = getCategoriesByContentType('papers');

  // Transform and sort papers
  const papers = rawPapers
    .map(paper => ({
      ...paper,
      status: paper.status as PaperStatus,
      confidence: paper.confidence as PaperConfidence
    }))
    .sort((a, b) => {
      const dateA = a.end_date || a.start_date;
      const dateB = b.end_date || b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="papers-container">
      <PapersClientPage
        papers={papers}
        categories={categories}
        initialCategory="all"
      />
    </div>
  );
}
