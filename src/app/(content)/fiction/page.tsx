/**
 * =============================================================================
 * Fiction Page
 * =============================================================================
 *
 * Main fiction listing page displaying all fiction stories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import FictionClientPage from "./FictionClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Types
// =============================================================================

interface Story {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  cover_image?: string;
  status?: string;
  confidence?: string;
  importance?: number;
  preview: string;
  state: string;
}

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.fiction;

// =============================================================================
// Page Component
// =============================================================================

export default function FictionPage() {
  // Fetch active fiction content from database
  const fictionData = getActiveContentByType('fiction');

  // Fetch categories for the client component
  const categories = getCategoriesByContentType('fiction');

  // Build slugs for view count lookup (format: fiction/category/slug)
  const slugs = fictionData.map(story => {
    const categorySlug = story.category.toLowerCase().replace(/\s+/g, "-");
    return `fiction/${categorySlug}/${story.slug}`;
  });
  const viewCounts = getViewCounts(slugs);

  // Sort fiction by date (newest first) and add views
  const stories = fictionData
    .map(story => {
      const categorySlug = story.category.toLowerCase().replace(/\s+/g, "-");
      return {
        ...story,
        views: viewCounts[`fiction/${categorySlug}/${story.slug}`] ?? 0
      };
    })
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }) as (Story & { views: number })[];

  return (
    <div className="fiction-container">
      <FictionClientPage stories={stories} initialCategory="all" categories={categories} />
    </div>
  );
}
