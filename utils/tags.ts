import fs from "fs/promises";
import path from "path";
import { Post } from "./posts";

const feedPath = path.join(process.cwd(), "data", "essays", "feed.json");
const tagsDataPath = path.join(process.cwd(), "data", "blog", "tags.json");

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
  const raw = await fs.readFile(feedPath, "utf-8");
  const data = JSON.parse(raw) as { posts: Post[] };
  return data.posts;
}

/**
 * Read and parse tags.json
 */
async function readTagsData(): Promise<{ tags: TagData[] }> {
  const raw = await fs.readFile(tagsDataPath, "utf-8");
  return JSON.parse(raw) as { tags: TagData[] };
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
