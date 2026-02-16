/**
 * Post URL Generation Utilities
 * @author Kris Yotam
 * @date 2025-12-29
 */

import { Post } from "@/lib/posts"

/**
 * Generate correct URL for a post using sexy URLs (/{slug})
 */
export function getPostUrl(post: Post): string {
  return post.slug;
}
