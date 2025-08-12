// utils/related-posts.ts
import { getActivePosts, Post } from "./posts";

interface ScoredPost {
  post: Post;
  score: number;
}

/**
 * Return up to `limit` posts most similar to the current post
 * based on shared tags, category, and title keywords (only active posts).
 * By default, `limit = Infinity` so you can paginate client‐side as needed.
 */
export async function getSimilarPosts(
  currentSlug: string,
  limit: number = Infinity
): Promise<Post[]> {
  // 1. load all active posts
  const all = await getActivePosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return [];

  // 2. score every other post
  const scored: ScoredPost[] = all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;

      // shared tags → +3 points each
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      score += sharedTags * 3;

      // same category → +2 points
      if (p.category === current.category) score += 2;

      // title keyword overlap → +1 point each
      const baseWords = new Set(current.title.toLowerCase().split(/\W+/));
      const matchWords = p.title
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => baseWords.has(w)).length;
      score += matchWords;

      return { post: p, score };
    })
    // drop zero‑score posts
    .filter((x) => x.score > 0)
    // sort by score desc, then newest first
    .sort(
      (a, b) =>
        b.score - a.score || Date.parse((b.post.end_date && b.post.end_date.trim()) ? b.post.end_date : b.post.start_date) - Date.parse((a.post.end_date && a.post.end_date.trim()) ? a.post.end_date : a.post.start_date)
    );

  // 3. return up to `limit`
  return scored.slice(0, limit).map((x) => x.post);
}
