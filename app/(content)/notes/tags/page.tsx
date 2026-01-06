/**
 * =============================================================================
 * Notes Tags Page
 * =============================================================================
 *
 * Server component that displays all note tags.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import NotesTagsClientPage from "./NotesTagsClientPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Notes Tags",
  description: "Browse all note tags and their descriptions",
};

// =============================================================================
// Helpers
// =============================================================================

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =============================================================================
// Page Component
// =============================================================================

export default async function NotesTagsPage() {
  // Fetch data from database
  const notes = getActiveContentByType('notes');
  const dbTags = getTagsByContentType('notes');

  // Gather all unique tags from notes
  const allTagsSet = new Set<string>();
  notes.forEach(note => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => allTagsSet.add(tag));
    }
  });

  // Create tag objects with metadata from database or defaults
  const tags = Array.from(allTagsSet).map(tagTitle => {
    const slug = titleToSlug(tagTitle);
    const dbTag = dbTags.find(t => t.slug === slug);

    if (dbTag) {
      return {
        slug: dbTag.slug,
        title: dbTag.title,
        preview: dbTag.preview || `Notes and content related to ${dbTag.title.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: "Active",
        confidence: "certain",
        importance: dbTag.importance,
      };
    }

    return {
      slug,
      title: tagTitle,
      preview: `Notes and content related to ${tagTitle.toLowerCase()}.`,
      date: new Date().toISOString(),
      status: "Active",
      confidence: "certain",
      importance: 5,
    };
  });

  // Sort tags by importance
  const sortedTags = tags.sort((a, b) => b.importance - a.importance);

  return (
    <div className="notes-container">
      <NotesTagsClientPage tags={sortedTags} />
    </div>
  );
}
