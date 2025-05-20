import feedData from '@/data/feed.json';

interface Post {
  title: string;
  subtitle?: string;
  preview: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  cover_image: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
  customPath?: string;
}

/**
 * Get a post from feed.json by slug
 * @param slug The post slug to look up
 * @returns The post data or null if not found
 */
export function getPostBySlug(slug: string): Post | null {
  if (!slug) return null;
  
  const post = feedData.posts.find(post => post.slug === slug);
  return post || null;
}

/**
 * Get a post by year and slug
 * @param year The year as a string (e.g. "2025")
 * @param slug The post slug
 * @returns The post data or null if not found
 */
export function getPostByYearAndSlug(year: string, slug: string): Post | null {
  if (!year || !slug) return null;
  
  const post = feedData.posts.find(post => {
    const postYear = new Date(post.date).getFullYear().toString();
    return post.slug === slug && postYear === year;
  });
  
  return post || null;
}

/**
 * Get all posts from feed.json
 * @returns Array of all posts
 */
export function getAllPosts(): Post[] {
  return feedData.posts;
} 