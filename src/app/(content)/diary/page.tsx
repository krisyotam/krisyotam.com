/**
 * =============================================================================
 * Diary Page
 * =============================================================================
 *
 * Server component for the diary listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import DiaryClientPage from "./DiaryClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import type { DiaryMeta } from "@/types/content";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Diary",
  description: "Quick, unpolished entries and raw thoughts.",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function DiaryPage() {
  // Fetch data from database
  const rawEntries = getActiveContentByType('diary');
  const categories = getCategoriesByContentType('diary');

  // Build slugs for view count lookup (format: diary/category/slug)
  const slugs = rawEntries.map(entry => {
    const categorySlug = entry.category.toLowerCase().replace(/\s+/g, "-");
    return `diary/${categorySlug}/${entry.slug}`;
  });
  const viewCounts = await getViewCounts(slugs);

  // Transform and sort entries with views
  const entries: (DiaryMeta & { views: number })[] = rawEntries
    .map(entry => {
      const categorySlug = entry.category.toLowerCase().replace(/\s+/g, "-");
      const viewSlug = `diary/${categorySlug}/${entry.slug}`;
      return {
        title: entry.title,
        preview: entry.preview,
        start_date: entry.start_date,
        end_date: entry.end_date,
        slug: entry.slug,
        tags: entry.tags || [],
        category: entry.category,
        cover_image: entry.cover_image,
        state: entry.state as DiaryMeta['state'],
        views: viewCounts[viewSlug] ?? 0
      };
    })
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="diary-container">
      <DiaryClientPage
        entries={entries}
        categories={categories}
        initialCategory="all"
      />
    </div>
  );
}
