/**
 * =============================================================================
 * Papers Categories Page
 * =============================================================================
 *
 * Server component that displays all paper categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import PapersCategoriesClientPage from "./PapersCategoriesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Papers Categories",
  description: "Browse all paper categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function PapersCategoriesPage() {
  // Fetch data from database
  const papers = getActiveContentByType('papers');
  const allCategories = getCategoriesByContentType('papers');

  // Get unique categories that exist in active papers
  const existingCategorySlugs = new Set(
    papers.map(paper => paper.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Papers in the ${category.title} category.`,
      date: category.date || new Date().toISOString().split('T')[0],
      status: category.status || "Active",
      confidence: category.confidence || "certain",
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="papers-container">
      <PapersCategoriesClientPage categories={categories} />
    </div>
  );
}
