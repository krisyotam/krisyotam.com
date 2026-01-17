/**
 * =============================================================================
 * Blog Tags Page
 * =============================================================================
 *
 * Server component that displays all blog tags.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import BlogTagsClientPage from "./BlogTagsClientPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Blog Tags",
  description: "Browse all blog tags and their descriptions",
};

// =============================================================================
// Helpers
// =============================================================================

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogTagsPage() {
  // Fetch data from database
  const posts = getActiveContentByType('blog');
  const dbTags = getTagsByContentType('blog');

  // Gather all unique tags from posts
  const allTagsSet = new Set<string>();
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTagsSet.add(tag));
    }
  });

  // Create tag objects with metadata from database or defaults
  const tags = Array.from(allTagsSet).map(tagTitle => {
    const slug = titleToSlug(tagTitle);
    const dbTag = dbTags.find(t => t.slug === slug);

    if (dbTag) {
      return {
        slug: dbTag.slug,
        title: dbTag.title,
        preview: dbTag.preview || `Blog posts and content related to ${dbTag.title.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: "Active",
        confidence: "certain",
        importance: dbTag.importance,
      };
    }

    return {
      slug,
      title: tagTitle,
      preview: `Blog posts and content related to ${tagTitle.toLowerCase()}.`,
      date: new Date().toISOString(),
      status: "Active",
      confidence: "certain",
      importance: 5,
    };
  });

  // Sort tags by importance
  const sortedTags = tags.sort((a, b) => b.importance - a.importance);

  return (
    <div className="blog-container">
      <BlogTagsClientPage tags={sortedTags} />
    </div>
  );
}
