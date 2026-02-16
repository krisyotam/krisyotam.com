/**
 * =============================================================================
 * Diary Tags Page
 * =============================================================================
 *
 * Lists all tags used in diary entries.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import DiaryTagsClientPage from "./DiaryTagsClientPage";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Diary Tags",
  description: "Browse diary entries by tag.",
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

export default async function DiaryTagsPage() {
  const entries = getActiveContentByType('diary');
  const dbTags = getTagsByContentType('diary');

  // Gather unique tags from entries
  const tagSet = new Set<string>();
  entries.forEach(entry => {
    (entry.tags || []).forEach(tag => tagSet.add(tag));
  });

  // Build tag data with metadata from database
  const tags = Array.from(tagSet).map(tag => {
    const slug = titleToSlug(tag);
    const dbTag = dbTags.find(t => t.slug === slug);

    return {
      slug,
      title: tag,
      preview: dbTag?.preview || null,
      importance: dbTag?.importance || 5,
    };
  }).sort((a, b) => (b.importance || 0) - (a.importance || 0));

  return <DiaryTagsClientPage tags={tags} />;
}
