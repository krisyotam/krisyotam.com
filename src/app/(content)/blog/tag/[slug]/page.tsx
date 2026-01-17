/**
 * =============================================================================
 * Blog Tag Page
 * =============================================================================
 *
 * Dynamic route for displaying blog posts with a specific tag.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import BlogTaggedPage from "./BlogTaggedPage";
import { getActiveContentByType, getTagsByContentType } from "@/lib/data";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/content";
import { notFound } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const posts = getActiveContentByType('blog');

  const allTagsSet = new Set<string>();
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTagsSet.add(titleToSlug(tag)));
    }
  });

  return Array.from(allTagsSet).map(slug => ({ slug }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: tagSlug } = await params;
  const posts = getActiveContentByType('blog');
  const dbTags = getTagsByContentType('blog');

  // Find original tag name
  let originalTag: string | undefined;
  for (const post of posts) {
    if (post.tags && Array.isArray(post.tags)) {
      originalTag = post.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return { title: "Tag Not Found | Blog" };
  }

  const dbTag = dbTags.find(t => t.slug === tagSlug);
  const tagTitle = dbTag?.title || originalTag;

  return {
    title: `${tagTitle} Blog Posts | Kris Yotam`,
    description: `Blog posts tagged with ${tagTitle}`,
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogTagPage({ params }: PageProps) {
  const { slug: tagSlug } = await params;

  // Fetch data from database
  const allPosts = getActiveContentByType('blog');
  const dbTags = getTagsByContentType('blog');

  // Find matching posts and original tag name
  let originalTag: string | undefined;
  const postsWithTag = allPosts.filter(post => {
    if (post.tags && Array.isArray(post.tags)) {
      const foundTag = post.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) originalTag = foundTag;
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || postsWithTag.length === 0) {
    notFound();
  }

  // Get tag metadata
  const dbTag = dbTags.find(t => t.slug === tagSlug);

  // Build header data
  const tagHeaderData = dbTag ? {
    title: dbTag.title,
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: dbTag.preview || `Blog posts tagged with ${dbTag.title}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: dbTag.importance,
    backText: "Tags",
    backHref: "/blog/tags"
  } : {
    title: originalTag,
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: `Blog posts tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/blog/tags"
  };

  // Sort and transform posts
  const posts: BlogMeta[] = postsWithTag
    .map(post => ({
      ...post,
      importance: typeof post.importance === 'string'
        ? parseInt(post.importance as string, 10)
        : post.importance
    }))
    .sort((a, b) => {
      const aDate = a.end_date || a.start_date;
      const bDate = b.end_date || b.start_date;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .map(post => ({
      ...post,
      status: post.status as BlogMeta['status'],
      confidence: post.confidence as BlogMeta['confidence'],
      state: post.state as BlogMeta['state']
    }));

  return (
    <div className="blog-container">
      <BlogTaggedPage posts={posts} tagData={tagHeaderData} />
    </div>
  );
}
