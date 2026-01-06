/**
 * =============================================================================
 * Blog Categories Page
 * =============================================================================
 *
 * Server component that displays all blog categories.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import BlogCategoriesClientPage from "./BlogCategoriesClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Blog Categories",
  description: "Browse all blog categories and their descriptions",
};

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogCategoriesPage() {
  // Fetch data from database
  const posts = getActiveContentByType('blog');
  const allCategories = getCategoriesByContentType('blog');

  // Get unique categories that exist in active posts
  const existingCategorySlugs = new Set(
    posts.map(post => post.category?.toLowerCase().replace(/\s+/g, "-"))
  );

  // Filter, transform and sort categories by importance
  const categories = allCategories
    .filter(category => existingCategorySlugs.has(category.slug))
    .map(category => ({
      slug: category.slug,
      title: category.title,
      preview: category.preview || `Blog posts in the ${category.title} category.`,
      date: category.date || new Date().toISOString().split('T')[0],
      status: category.status || "Active",
      confidence: category.confidence || "certain",
      importance: category.importance || 5,
    }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="blog-container">
      <BlogCategoriesClientPage categories={categories} />
    </div>
  );
}
