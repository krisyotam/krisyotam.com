/**
 * Post URL Generation Utilities
 * @author Kris Yotam
 * @date 2025-12-29
 */

import { Post } from "@/lib/posts"

/**
 * Generate correct URL for a post based on whether it's a blog post or essay
 */
export function getPostUrl(post: Post): string {
  // Check if this is a blog post or an essay based on the path property
  if (post.path === 'blog') {
    // Blog posts are accessed by /blog/category-slug/slug
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
    return `blog/${categorySlug}/${encodeURIComponent(post.slug)}`;
  } else {
    // Essays are accessed by /essays/category-slug/slug
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
    return `essays/${categorySlug}/${post.slug}`;
  }
}
