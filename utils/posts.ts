import { promises as fs } from "fs";
import path from "path";

export interface Post {
  title: string;
  subtitle?: string;
  preview: string;
  date: string;
  tags: string[];
  category: string;
  slug: string;
  state: string;
  status?: string;
  confidence?: string;
  importance?: number;
  headings?: string[];
  marginNotes?: string[];
}

export interface PostsData {
  posts: Post[];
}

// Helper function to get the year from a date string
export function getPostYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "feed.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const data: PostsData = JSON.parse(fileContents);

    // Sort posts by date (newest first)
    return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

// Get active posts (state === 'active')
export async function getActivePosts(): Promise<Post[]> {
  const allPosts = await getAllPosts();
  // getAllPosts already sorts by date, so we just need to filter
  return allPosts.filter((post) => post.state === "active");
}

// Get a specific post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

// Get all unique categories
export async function getCategories(): Promise<{ slug: string; name: string }[]> {
  try {
    const allPosts = await getAllPosts();
    // Extract unique categories from posts
    const uniqueCategories = Array.from(
      new Set(allPosts.map((post) => post.category))
    );
    // Map to { slug, name } format expected by generateStaticParams
    return uniqueCategories.map((category) => ({
      slug: category.toLowerCase().replace(/\s+/g, "-"), // e.g., "Tech News" -> "tech-news"
      name: category, // Original category name
    }));
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

// Get posts by category (NEW FUNCTION ADDED)
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const allPosts = await getAllPosts();
    // Filter posts by matching category slug
    return allPosts.filter((post) => {
      const postCategorySlug = post.category.toLowerCase().replace(/\s+/g, "-");
      return postCategorySlug === categorySlug;
    });
  } catch (error) {
    console.error("Error loading posts by category:", error);
    return [];
  }
}