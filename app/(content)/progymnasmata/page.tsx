/**
 * =============================================================================
 * Progymnasmata Index Page
 * =============================================================================
 *
 * Main listing page for Progymnasmata (classical rhetorical exercises).
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import type { Metadata } from "next";
import { ProgymnasmataClient } from "./progymnasmata-client";
import { staticMetadata } from "@/lib/staticMetadata";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.progymnasmata;

// =============================================================================
// Page Component
// =============================================================================

export default function ProgymnasmataPage() {
  // Fetch active progymnasmata posts from database
  const activePosts = getActiveContentByType('progymnasmata');

  // Sort by date (newest first) and transform with defaults
  const posts = [...activePosts].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).map(post => ({
    ...post,
    state: post.state || "active",
    status: post.status || "Finished",
    confidence: post.confidence || "certain",
    importance: post.importance ?? 5,
    tags: post.tags || []
  }));

  // Fetch categories for progymnasmata from database and transform with defaults
  const rawCategories = getCategoriesByContentType('progymnasmata');
  const categories = rawCategories.map(cat => ({
    ...cat,
    preview: cat.preview || `Exercises in the ${cat.title} category.`,
    status: cat.status || "Active",
    confidence: cat.confidence || "certain",
    importance: cat.importance ?? 5,
    date: cat.date || new Date().toISOString().split('T')[0]
  }));

  return (
    <div className="progymnasmata-container">
      <ProgymnasmataClient posts={posts} categories={categories} initialCategory="all" />
    </div>
  );
}
