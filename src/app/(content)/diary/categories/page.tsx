/**
 * =============================================================================
 * Diary Categories Page
 * =============================================================================
 *
 * Server component that displays all diary categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import DiaryCategoriesClientPage from "./DiaryCategoriesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Diary Categories",
  description: "Browse all diary categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function DiaryCategoriesPage() {
  // Fetch data from database
  const entries = getActiveContentByType('diary');
  const allCategories = getCategoriesByContentType('diary');

  // Get unique categories that exist in active diary entries
  const existingCategorySlugs = new Set(
    entries.map(entry => entry.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Diary entries in the ${category.title} category.`,
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return <DiaryCategoriesClientPage categories={categories} />;
}
