/**
 * =============================================================================
 * Papers Tags Page
 * =============================================================================
 *
 * Server component that displays all paper tags.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import PapersTagsClientPage from "./PapersTagsClientPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Papers Tags",
  description: "Browse all paper tags and their descriptions",
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

export default async function PapersTagsPage() {
  // Fetch data from database
  const papers = getActiveContentByType('papers');
  const dbTags = getTagsByContentType('papers');

  // Gather all unique tags from papers
  const allTagsSet = new Set<string>();
  papers.forEach(paper => {
    if (paper.tags && Array.isArray(paper.tags)) {
      paper.tags.forEach(tag => allTagsSet.add(tag));
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
        preview: dbTag.preview || `Papers and content related to ${dbTag.title.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: "Active",
        confidence: "certain",
        importance: dbTag.importance,
      };
    }

    return {
      slug,
      title: tagTitle,
      preview: `Papers and content related to ${tagTitle.toLowerCase()}.`,
      date: new Date().toISOString(),
      status: "Active",
      confidence: "certain",
      importance: 5,
    };
  });

  // Sort tags by importance
  const sortedTags = tags.sort((a, b) => b.importance - a.importance);

  return (
    <div className="papers-container">
      <PapersTagsClientPage tags={sortedTags} />
    </div>
  );
}
