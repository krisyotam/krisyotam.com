/**
 * =============================================================================
 * Notes Categories Page
 * =============================================================================
 *
 * Server component that displays all note categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NotesCategoriesClientPage from "./NotesCategoriesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Notes Categories",
  description: "Browse all note categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function NotesCategoriesPage() {
  // Fetch data from database
  const notes = getActiveContentByType('notes');
  const allCategories = getCategoriesByContentType('notes');

  // Get unique categories that exist in active notes
  const existingCategorySlugs = new Set(
    notes.map(note => note.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Notes in the ${category.title} category.`,
      date: category.date || new Date().toISOString().split('T')[0],
      status: category.status || "Active",
      confidence: category.confidence || "certain",
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="notes-container">
      <NotesCategoriesClientPage categories={categories} />
    </div>
  );
}
