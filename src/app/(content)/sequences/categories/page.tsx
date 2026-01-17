/**
 * =============================================================================
 * Sequences Categories Page
 * =============================================================================
 *
 * Listing page for all sequence categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import SequencesCategoriesClientPage from "./SequencesCategoriesClientPage";
import { getSequencesData } from "@/lib/data";
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
  const data = await getSequencesData();

  // Get unique categories and count sequences in each
  const categoryCounts = new Map<string, number>();
  const categoryPreviews = new Map<string, string[]>();

  data.sequences.forEach((sequence) => {
    if (sequence.category) {
      const count = categoryCounts.get(sequence.category) || 0;
      categoryCounts.set(sequence.category, count + 1);

      const previews = categoryPreviews.get(sequence.category) || [];
      if (previews.length < 3) {
        // Collect up to 3 titles per category for preview
        previews.push(sequence.title);
        categoryPreviews.set(sequence.category, previews);
      }
    }
  });

  // Format the categories
  const categories = Array.from(categoryCounts.keys())
    .map((category) => {
      const slug = category.toLowerCase().replace(/\s+/g, "-");
      const preview = categoryPreviews.get(category)?.join(", ");

      return {
        slug,
        title: category,
        preview: `${preview} and more...`,
        count: categoryCounts.get(category) || 0,
        importance: 5, // Default importance
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <div className="sequences-container">
      <SequencesCategoriesClientPage categories={categories} />
    </div>
  );
}
