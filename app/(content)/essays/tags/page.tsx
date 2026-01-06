/**
 * =============================================================================
 * Essays Tags Page
 * =============================================================================
 *
 * Server component that displays all essay tags.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import EssaysTagsClientPage from "./EssaysTagsClientPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Essays Tags",
  description: "Browse all essay tags and their descriptions",
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

export default async function EssaysTagsPage() {
  // Fetch data from database
  const essays = getActiveContentByType('essays');
  const dbTags = getTagsByContentType('essays');

  // Gather all unique tags from essays
  const allTagsSet = new Set<string>();
  essays.forEach(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      essay.tags.forEach(tag => allTagsSet.add(tag));
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
        preview: dbTag.preview || `Essays and content related to ${dbTag.title.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: "Active",
        confidence: "certain",
        importance: dbTag.importance,
      };
    }

    return {
      slug,
      title: tagTitle,
      preview: `Essays and content related to ${tagTitle.toLowerCase()}.`,
      date: new Date().toISOString(),
      status: "Active",
      confidence: "certain",
      importance: 5,
    };
  });

  // Sort tags by importance
  const sortedTags = tags.sort((a, b) => b.importance - a.importance);

  return (
    <div className="essays-container">
      <EssaysTagsClientPage tags={sortedTags} />
    </div>
  );
}
