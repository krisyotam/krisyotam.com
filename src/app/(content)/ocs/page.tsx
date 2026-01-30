/**
 * =============================================================================
 * OCS Main Page
 * =============================================================================
 *
 * Main listing page for Original Characters (OCS).
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import OCSClientPage from "./OCSClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import type { OCSMeta, OCSStatus, OCSConfidence } from "@/types/content";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.ocs;

// =============================================================================
// Page Component
// =============================================================================

export default async function OCSPage() {
  // Fetch active OCS content from database
  const ocsData = getActiveContentByType('ocs');
  const categories = getCategoriesByContentType('ocs');

  // Build slugs for view count lookup (format: ocs/category/slug)
  const slugs = ocsData.map(character => {
    const categorySlug = character.category.toLowerCase().replace(/\s+/g, "-");
    return `ocs/${categorySlug}/${encodeURIComponent(character.slug)}`;
  });
  const viewCounts = getViewCounts(slugs);

  // Map to OCSMeta type and sort by date (newest first) with views
  const ocs: (OCSMeta & { views: number })[] = ocsData
    .map(character => {
      const categorySlug = character.category.toLowerCase().replace(/\s+/g, "-");
      const viewSlug = `ocs/${categorySlug}/${encodeURIComponent(character.slug)}`;
      return {
        title: character.title,
        subtitle: character.subtitle,
        preview: character.preview,
        start_date: character.start_date,
        end_date: character.end_date,
        slug: character.slug,
        tags: character.tags,
        category: character.category,
        book: character.category, // OCS uses category as book
        status: character.status as OCSStatus,
        confidence: character.confidence as OCSConfidence,
        importance: character.importance,
        cover_image: character.cover_image,
        state: (character.state as "active" | "hidden" | undefined) || "active",
        views: viewCounts[viewSlug] ?? 0
      };
    })
    .sort((a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="ocs-container">
      <OCSClientPage ocs={ocs} initialCategory="all" categories={categories} />
    </div>
  );
}
