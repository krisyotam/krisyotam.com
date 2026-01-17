/**
 * =============================================================================
 * Essays Categories Page
 * =============================================================================
 *
 * Server component that displays all essay categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import EssaysCategoriesClientPage from "./EssaysCategoriesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Essays Categories",
  description: "Browse all essay categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function EssaysCategoriesPage() {
  // Fetch data from database
  const essays = getActiveContentByType('essays');
  const allCategories = getCategoriesByContentType('essays');

  // Get unique categories that exist in active essays
  const existingCategorySlugs = new Set(
    essays.map(essay => essay.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Essays in the ${category.title} category.`,
      date: category.date || new Date().toISOString().split('T')[0],
      status: category.status || "Active",
      confidence: category.confidence || "certain",
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="essays-container">
      <EssaysCategoriesClientPage categories={categories} />
    </div>
  );
}
