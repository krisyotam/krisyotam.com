import { Post } from "./posts";

// API fetch functions
async function fetchTagsData() {
  try {
    const response = await fetch('/api/data/blog/tags');
    if (!response.ok) {
      throw new Error('Failed to fetch tags data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags data:', error);
    return { tags: [] };
  }
}

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

export interface TagSummary {
  slug: string;
  name: string;
  count: number;
}

export interface TagData {
  slug: string;
  title: string;
  subtitle?: string;
  preview?: string;
  date: string;
  "show-status"?: string;
  status?: string;
  confidence?: string;
  importance?: number;
}

// Utility: slugify a tag name
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/**
 * Read and parse feed.json (expects { posts: Post[] })
 */
async function readFeed(): Promise<Post[]> {
  const feedData = await fetchFeedData();
  return feedData.posts;
}

/**
 * Read and parse tags.json
 */
async function readTagsData(): Promise<{ tags: TagData[] }> {
  return await fetchTagsData();
}

/**
 * Get a list of unique tags with counts from feed.json, excluding hidden posts
 */
export async function getTags(): Promise<TagSummary[]> {
  const posts = await readFeed();
  const counter: Record<string, number> = {};

  posts
    .filter((p) => p.state !== "hidden")
    .forEach((post) => {
      post.tags?.forEach((tagName) => {
        const slug = slugify(tagName);
        counter[slug] = (counter[slug] || 0) + 1;
      });
    });

  return Object.entries(counter).map(([slug, count]) => ({
    slug,
    name: slug.replace(/-/g, " "),
    count,
  }));
}

/**
 * Get all manual tag metadata from tags.json
 */
export async function getAllTagData(): Promise<TagData[]> {
  const { tags } = await readTagsData();
  return tags;
}

/**
 * Lookup a single tag's metadata by slug
 */
export async function getTagDataBySlug(
  slug: string
): Promise<TagData | undefined> {
  const tags = await getAllTagData();
  return tags.find((t) => t.slug === slug);
}

/**
 * Get all posts matching a given tag slug, excluding hidden posts
 */
export async function getPostsByTag(
  slug: string
): Promise<Post[]> {
  const posts = await readFeed();

  return posts.filter(
    (post) =>
      post.state !== "hidden" &&
      post.tags?.some((tagName) => slugify(tagName) === slug)
  );
}
