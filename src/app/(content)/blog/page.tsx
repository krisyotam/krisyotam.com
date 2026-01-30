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
import { getViewCounts } from "@/lib/analytics-db";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/content";
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

  // Build slugs for view count lookup (format: blog/category/slug)
  const slugs = rawPosts.map(post => {
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-");
    return `blog/${categorySlug}/${post.slug}`;
  });
  const viewCounts = await getViewCounts(slugs);

  // Transform and sort posts with views
  const posts: (BlogMeta & { views: number })[] = rawPosts
    .map(post => {
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-");
      const viewSlug = `blog/${categorySlug}/${post.slug}`;
      return {
        ...post,
        importance: typeof post.importance === 'string'
          ? parseInt(post.importance as string, 10)
          : post.importance,
        status: post.status as BlogMeta['status'],
        confidence: post.confidence as BlogMeta['confidence'],
        state: post.state as BlogMeta['state'],
        views: viewCounts[viewSlug] ?? 0
      };
    })
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
