/**
 * =============================================================================
 * Essays Page
 * =============================================================================
 *
 * Server component for the essays listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import EssaysClientPage from "./EssaysClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import { staticMetadata } from "@/lib/staticMetadata";
import type { Metadata } from "next";
import type { Post } from "@/lib/posts";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.essays;

// =============================================================================
// Page Component
// =============================================================================

export default async function EssaysPage() {
  // Fetch data from database
  const allEssays = getActiveContentByType('essays');
  const categories = getCategoriesByContentType('essays');

  // Build slugs for view count lookup (format: essays/category/slug)
  const slugs = allEssays.map(essay => `essays/${essay.category}/${essay.slug}`);
  const viewCounts = getViewCounts(slugs);

  // Transform to Post format with views
  const essays: (Post & { views: number })[] = allEssays.map(essay => {
    const viewSlug = `essays/${essay.category}/${essay.slug}`;
    return {
      slug: essay.slug,
      title: essay.title,
      date: (essay.end_date?.trim()) ? essay.end_date : essay.start_date,
      start_date: essay.start_date,
      end_date: essay.end_date || "",
      preview: essay.preview || "",
      tags: essay.tags || [],
      status: (essay.status || "Finished") as Post['status'],
      confidence: (essay.confidence || "certain") as Post['confidence'],
      importance: essay.importance ?? 5,
      category: essay.category,
      state: essay.state as Post['state'],
      path: "essays",
      cover_image: essay.cover_image,
      views: viewCounts[viewSlug] ?? 0
    };
  });

  // Transform categories with defaults
  const transformedCategories = categories.map(cat => ({
    slug: cat.slug,
    title: cat.title,
    preview: cat.preview || `Essays in the ${cat.title} category.`,
    date: cat.date,
    status: cat.status,
    confidence: cat.confidence,
    importance: cat.importance ?? 5,
  }));

  return (
    <div className="essays-container">
      <EssaysClientPage notes={essays} categories={transformedCategories} />
    </div>
  );
}
