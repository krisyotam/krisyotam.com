/**
 * =============================================================================
 * Sequences Page
 * =============================================================================
 *
 * Main listing page for all sequences.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import SequencesClientPage from "./SequencesClientPage";
import { staticMetadata } from "@/lib/staticMetadata";
import { getSequencesData, getCategoriesData } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.sequences;

// =============================================================================
// Page Component
// =============================================================================

export default async function SequencesPage() {
  const sequencesData = await getSequencesData();
  const categoriesData = await getCategoriesData();

  // Filter to only active sequences
  const activeSequences = sequencesData.sequences.filter(
    (sequence) => sequence.state === "active"
  );

  // Get unique categories from sequences
  const sequenceCategories = Array.from(
    new Set(activeSequences.map((s) => s.category).filter(Boolean))
  );

  // Filter categories to only those used by sequences
  const relevantCategories = categoriesData.categories.filter((cat) =>
    sequenceCategories.includes(cat.slug)
  );

  return (
    <SequencesClientPage
      sequences={activeSequences}
      categories={relevantCategories}
    />
  );
}
