/**
 * =============================================================================
 * Blog Category Page
 * =============================================================================
 *
 * Dynamic route for displaying blog posts within a specific category.
 * Fetches data from content.db via lib/data.ts functions.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveContentByType, getCategoriesByContentType } from "@/lib/data";
import BlogCategoryClient from "./BlogCategoryClient";
import type { BlogMeta, Status, Confidence } from "@/types/content";

// =============================================================================
// Types
// =============================================================================

interface BlogCategoryPageProps {
  params: Promise<{ category: string }>;
}

// =============================================================================
// Helpers
// =============================================================================

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// =============================================================================
// Static Generation
// =============================================================================

export async function generateStaticParams() {
  const posts = getActiveContentByType('blog');
  const categorySlugs = new Set<string>();

  posts.forEach(post => {
    if (post.category) {
      categorySlugs.add(slugifyCategory(post.category));
    }
  });

  return Array.from(categorySlugs).map(category => ({ category }));
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const posts = getActiveContentByType('blog');

  const categoryPost = posts.find(post =>
    slugifyCategory(post.category) === categorySlug
  );

  if (!categoryPost) {
    return { title: "Category Not Found" };
  }

  const categoryTitle = categoryPost.category;
  const url = `https://krisyotam.com/blog/${categorySlug}`;
  const description = `Blog posts in the ${categoryTitle} category`;

  return {
    title: `${categoryTitle} | Blog`,
    description,
    openGraph: {
      title: `${categoryTitle} Blog Posts`,
      description,
      url,
      type: "website",
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Blog Posts`,
      description,
      creator: "@krisyotam"
    }
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params;

  // Fetch data from database
  const allPosts = getActiveContentByType('blog');
  const categories = getCategoriesByContentType('blog');

  // Filter posts for this category
  const categoryPosts = allPosts
    .filter(post => slugifyCategory(post.category) === categorySlug)
    .map(post => ({
      title: post.title,
      start_date: post.start_date,
      end_date: post.end_date,
      slug: post.slug,
      tags: post.tags,
      category: post.category,
      status: post.status as Status,
      confidence: post.confidence as Confidence,
      importance: post.importance,
      preview: post.preview,
      state: post.state as "active" | "hidden" | undefined
    }));

  if (!categoryPosts.length) {
    notFound();
  }

  // Transform all posts for client
  const posts: BlogMeta[] = allPosts.map(post => ({
    title: post.title,
    start_date: post.start_date,
    end_date: post.end_date,
    slug: post.slug,
    tags: post.tags,
    category: post.category,
    status: post.status as Status,
    confidence: post.confidence as Confidence,
    importance: post.importance,
    preview: post.preview,
    state: post.state as "active" | "hidden" | undefined
  }));

  return (
    <BlogCategoryClient
      posts={categoryPosts}
      allPosts={posts}
      category={categoryPosts[0].category}
      categories={categories}
    />
  );
}
