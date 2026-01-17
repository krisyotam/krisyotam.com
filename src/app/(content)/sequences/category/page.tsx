/**
 * =============================================================================
 * Sequence Category Redirect Page
 * =============================================================================
 *
 * Redirects from /sequences/category to /sequences/categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { redirect } from "next/navigation";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Sequence Categories",
  description: "Browse all sequence categories",
};

// =============================================================================
// Page Component
// =============================================================================

export default function SequenceCategoriesPage() {
  // Redirect to the categories page
  redirect("/sequences/categories");
}
