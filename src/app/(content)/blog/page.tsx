/**
 * =============================================================================
 * Blog Page
 * =============================================================================
 *
 * Server component for the blog listing page.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import BlogClientPage from "./BlogClientPage";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/content";
import "./blog.css";
import "./blog-grid.css";
import { staticMetadata } from "@/lib/staticMetadata";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = staticMetadata.blog;

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogPage() {
  // Fetch data from database
  const rawPosts = getActiveContentByType('blog');
  const categories = getCategoriesByContentType('blog');

  // Transform and sort posts
  const posts: BlogMeta[] = rawPosts
    .map(post => ({
      ...post,
      importance: typeof post.importance === 'string'
        ? parseInt(post.importance as string, 10)
        : post.importance,
      status: post.status as BlogMeta['status'],
      confidence: post.confidence as BlogMeta['confidence'],
      state: post.state as BlogMeta['state']
    }))
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <div className="notes-container">
      <BlogClientPage
        notes={posts}
        categories={categories}
        initialCategory="all"
      />
    </div>
  );
}
