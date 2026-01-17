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

  // Sort notes by date (newest first)
  const notes = [...rawNotes].sort((a, b) => {
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
