/**
 * =============================================================================
 * Reviews Page
 * =============================================================================
 *
 * Main reviews listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import ReviewClientPage from "./ReviewClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import type { ReviewMeta, ReviewStatus, ReviewConfidence } from "@/types/content";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.reviews;

// =============================================================================
// Page Component
// =============================================================================

export default async function ReviewsPage() {
  // Fetch reviews and categories from database
  const reviewsData = getActiveContentByType('reviews');
  const categoriesData = getCategoriesByContentType('reviews');

  // Build slugs for view count lookup (format: reviews/category/slug)
  const slugs = reviewsData.map(review => `reviews/${encodeURIComponent(review.category)}/${encodeURIComponent(review.slug)}`);
  const viewCounts = await getViewCounts(slugs);

  // Map and sort reviews by date (newest first) with views
  const reviews: (ReviewMeta & { views: number })[] = reviewsData
    .map(review => {
      const viewSlug = `reviews/${encodeURIComponent(review.category)}/${encodeURIComponent(review.slug)}`;
      return {
        title: review.title,
        subtitle: review.subtitle,
        preview: review.preview,
        start_date: review.start_date,
        end_date: review.end_date,
        slug: review.slug,
        tags: review.tags,
        category: review.category,
        status: review.status as ReviewStatus,
        confidence: review.confidence as ReviewConfidence,
        importance: review.importance,
        cover_image: review.cover_image,
        state: (review.state as "active" | "hidden" | undefined) || "active",
        views: viewCounts[viewSlug] ?? 0
      };
    })
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // Map categories to the format expected by client component
  const categories = categoriesData.map(cat => ({
    slug: cat.slug,
    title: cat.title,
    preview: cat.preview,
    date: cat.date,
    status: cat.status,
    confidence: cat.confidence,
    importance: cat.importance
  }));

  return (
    <div className="reviews-container">
      <ReviewClientPage
        reviews={reviews}
        categories={categories}
        initialCategory="all"
      />
    </div>
  );
}
