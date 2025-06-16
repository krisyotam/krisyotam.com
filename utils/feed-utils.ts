// API fetch function
async function fetchFeedData() {
  try {
    const response = await fetch('/api/data/essays/feed');
    if (!response.ok) {
      throw new Error('Failed to fetch feed data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching feed data:', error);
    return { posts: [] };
  }
}

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
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;
  
  const feedData = await fetchFeedData();
  const post = feedData.posts.find((post: Post) => post.slug === slug);
  return post || null;
}

/**
 * Get a post by year and slug
 * @param year The year as a string (e.g. "2025")
 * @param slug The post slug
 * @returns The post data or null if not found
 */
export async function getPostByYearAndSlug(year: string, slug: string): Promise<Post | null> {
  if (!year || !slug) return null;
  
  const feedData = await fetchFeedData();
  const post = feedData.posts.find((post: any) => {
    const postYear = new Date(post.date).getFullYear().toString();
    return post.slug === slug && postYear === year;
  });
  
  return post || null;
}

/**
 * Get all posts from feed.json
 * @returns Array of all posts
 */
export async function getAllPosts(): Promise<Post[]> {
  const feedData = await fetchFeedData();
  return feedData.posts;
}