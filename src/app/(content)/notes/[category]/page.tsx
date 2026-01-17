/**
 * =============================================================================
 * Notes Category Page
 * =============================================================================
 *
 * Dynamic route for displaying notes within a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NotesClientPage from "../NotesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ category: string }>;
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const notes = getActiveContentByType('notes');
  const categorySlugs = new Set<string>();

  notes.forEach(note => {
    if (note.category) {
      categorySlugs.add(note.category.toLowerCase().replace(/\s+/g, "-"));
    }
  });

  return Array.from(categorySlugs).map(category => ({ category }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const notes = getActiveContentByType('notes');

  const originalCategory = notes.find(note =>
    note.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return { title: "Category Not Found | Notes" };
  }

  return {
    title: `${originalCategory} Notes | Kris Yotam`,
    description: `Notes in the ${originalCategory} category`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NotesCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Fetch data from database
  const allNotes = getActiveContentByType('notes');
  const categories = getCategoriesByContentType('notes');

  // Find original category name
  const originalCategory = allNotes.find(note =>
    note.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort notes by date
  const notes = [...allNotes].sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="notes-container">
      <NotesClientPage
        notes={notes}
        categories={categories}
        initialCategory={originalCategory}
      />
    </div>
  );
}
