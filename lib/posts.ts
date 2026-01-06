/**
 * =============================================================================
 * posts.ts
 * =============================================================================
 *
 * Post data fetching and manipulation utilities.
 *
 * Provides functions to get, filter, and sort posts from content.db.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { getEssaysData, getBlogData, getCategoriesData } from "@/lib/data"

// Re-export types for backward compatibility
export type { Post, PostsData, CategoryData, CategoriesData } from "@/lib/types/content"
import type { Post, CategoryData } from "@/lib/types/content"

// Helper to guard server‑only code
function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("This function must be called server‑side only")
  }
}

// Extract year from date
export function getPostYear(dateString: string): string {
  try {
    // Extract the year directly from the YYYY-MM-DD format
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString.split('-')[0];
    }
    
    // Fallback to parsing with Date
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? new Date().getFullYear().toString()
      : date.getFullYear().toString()
  } catch {
    return new Date().getFullYear().toString()
  }
}

// Read a JSON file from /data/blog or /data/essays (legacy - use lib/data.ts functions instead)
async function readDataFile<T>(filename: string): Promise<T | null> {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])

  const fullPath = path.join(process.cwd(), "public", "data", filename)

  try {
    const contents = await fs.readFile(fullPath, "utf8")
    return JSON.parse(contents) as T
  } catch (error) {
    console.error(`Error loading or parsing ${fullPath}:`, error)
    return null
  }
}

// Add caching for production
let cachedPosts: Post[] | null = null;

// Get all posts, sorted newest first
export async function getAllPosts(): Promise<Post[]> {
  if (process.env.NODE_ENV === 'production' && cachedPosts) {
    return cachedPosts
  }

  // Use the lib functions that ensure files are included in Vercel build
  const essaysData = await getEssaysData()
  const blogData = await getBlogData()

  const essays = (essaysData?.posts || []).map(post => ({ ...post, path: 'essays' }))
  // blogData is already an array, not an object with posts property
  const blogPosts = (blogData || []).map(post => ({ ...post, path: 'blog' }))

  const sortedPosts = [...essays, ...blogPosts].sort(
    (a, b) => {
      const dateA = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
      const dateB = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
      return dateB.localeCompare(dateA); // Directly compare YYYY-MM-DD strings
    }
  )

  if (process.env.NODE_ENV === 'production') {
    cachedPosts = sortedPosts
  }

  return sortedPosts
}

export async function getActivePosts(): Promise<Post[]> {
  const all = await getAllPosts()
  
  // Filter all posts to only include those with state === "active"
  // This applies to both essays and blog posts
  return all.filter((post) => post.state === "active")
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getActivePosts() // Use getActivePosts instead of getAllPosts to respect state
  return all.find((post) => post.slug === slug) || null
}

export async function getAllCategoryData(): Promise<CategoryData[]> {
  const data = await getCategoriesData()
  return data?.categories || []
}

export async function getCategoryDataBySlug(slug: string): Promise<CategoryData | null> {
  const all = await getAllCategoryData()
  return all.find((c) => c.slug === slug) || null
}

export async function getCategories(): Promise<{ slug: string; name: string; count: number }[]> {
  const posts = await getActivePosts()
  const essaysMeta = await getCategoriesData()
  const meta = (essaysMeta?.categories || []) as CategoryData[]

  const counts = new Map<string, number>()
  posts.forEach((p) => {
    const slug = p.category.toLowerCase().replace(/\s+/g, "-")
    counts.set(slug, (counts.get(slug) || 0) + 1)
  })

  const result: { slug: string; name: string; count: number }[] = []
  for (const [slug, count] of counts) {
    const catMeta = meta.find((c: CategoryData) => c.slug === slug)
    if (catMeta && catMeta["show-status"] === "hidden") continue

    const name = catMeta?.title || slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")
    result.push({ slug, name, count })
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getActivePosts()
  return posts.filter((p) => {
    const slug = p.category.toLowerCase().replace(/\s+/g, "-")
    return slug === categorySlug
  })
}

export async function isPostMDX(year: string, slug: string): Promise<boolean> {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  try {
    await fs.stat(path.join(process.cwd(), "app", "blog", year, slug, "page.mdx"))
    return true
  } catch {
    return false
  }
}

export async function getPostContent(year: string, slug: string) {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  const mdxPath = path.join(process.cwd(), "app", "essays", year, slug, "page.mdx")

  try {
    const mdxData = await fs.readFile(mdxPath, "utf-8")
    return { isMDX: true, mdxData, blogPostExists: true }
  } catch {
    return { isMDX: false, mdxData: null, blogPostExists: false }
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await getActivePosts() // Use getActivePosts to respect state
  return all.filter((post) => post.tags.includes(tag))
}

export async function getTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getActivePosts() // Use getActivePosts to respect state
  const tagCounts = new Map<string, number>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
