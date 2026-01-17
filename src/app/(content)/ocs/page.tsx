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

  // Map to OCSMeta type and sort by date (newest first)
  const ocs: OCSMeta[] = ocsData
    .map(character => ({
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
      state: (character.state as "active" | "hidden" | undefined) || "active"
    }))
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
