/**
 * =============================================================================
 * Sequences Categories Page
 * =============================================================================
 *
 * Server component that displays all sequence categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import SequencesCategoriesClientPage from "./SequencesCategoriesClientPage";
import { getSequencesData, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Sequence Categories",
  description: "Browse all sequence categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function SequencesCategoriesPage() {
  // Fetch sequences data and global categories
  const data = await getSequencesData();
  const allCategories = getCategoriesByContentType('sequences');

  // Filter to only active, non-hidden sequences
  const visibleSequences = data.sequences.filter(
    (sequence) => sequence.state === "active" && sequence.status !== "hidden"
  );

  // Get unique categories that exist in active sequences
  const existingCategorySlugs = new Set(
    visibleSequences.map(seq => seq.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Sequences in the ${category.title} category.`,
      date: category.date || new Date().toISOString().split('T')[0],
      status: category.status || "Active",
      confidence: category.confidence || "certain",
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="sequences-container">
      <SequencesCategoriesClientPage categories={categories} />
    </div>
  );
}
