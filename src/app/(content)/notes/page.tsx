/**
 * =============================================================================
 * Notes Page
 * =============================================================================
 *
 * Server component for the notes listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NotesClientPage from "./NotesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.notes;

// =============================================================================
// Page Component
// =============================================================================

export default async function NotesPage() {
  // Fetch data from database
  const rawNotes = getActiveContentByType('notes');
  const categories = getCategoriesByContentType('notes');

  // Build slugs for view count lookup (format: notes/category/slug)
  const slugs = rawNotes.map(note => `notes/${note.category}/${note.slug}`);
  const viewCounts = getViewCounts(slugs);

  // Sort notes by date (newest first) and add views
  const notes = [...rawNotes]
    .map(note => ({
      ...note,
      views: viewCounts[`notes/${note.category}/${note.slug}`] ?? 0
    }))
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="notes-container">
      <NotesClientPage
        notes={notes}
        categories={categories}
        initialCategory="all"
      />
    </div>
  );
}
