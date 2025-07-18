// utils/posts.ts
import { getEssaysData, getBlogData, getCategoriesData, getSeriesData } from "@/lib/data"

export interface Post {
  title: string
  subtitle?: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  state?: string // Make state optional since blog posts don't have it
  status?: string
  confidence?: string
  importance?: number
  headings?: string[]
  marginNotes?: string[]
  cover_image?: string
  cover?: string
  path?: string // Custom URL path for the post
  series?: string
}

export interface PostsData {
  posts: Post[]
}

export interface CategoryData {
  slug: string
  title: string
  subtitle?: string
  preview?: string
  date: string
  "show-status": "active" | "hidden"
  status: string
  confidence?: "certain" | "unlikely" | "likely" | "impossible" | "remote" | "highly unlikely" | "possible" | "highly likely"
  importance?: number
}

export interface CategoriesData {
  categories: CategoryData[]
}

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

  const fullPath = path.join(process.cwd(), "data", filename)

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
    (a, b) => b.date.localeCompare(a.date) // Directly compare YYYY-MM-DD strings
  )

  if (process.env.NODE_ENV === 'production') {
    cachedPosts = sortedPosts
  }

  return sortedPosts
}

export async function getActivePosts(): Promise<Post[]> {
  const all = await getAllPosts()
  
  // For essays: include those with state === "active"
  // For blog posts: include all since they don't have state property (treated as active)
  return all.filter((post) => {
    if (post.path === 'essays') {
      return post.state === "active";
    } else {
      // Blog posts - include all by default as they don't have state property
      return true;
    }
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts()
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
  const all = await getAllPosts()
  return all.filter((post) => post.tags.includes(tag))
}

export async function getTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts()
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

export async function getSeries(): Promise<{ name: string; count: number }[]> {
  const seriesData = await getSeriesData()

  if (!seriesData?.series) return []

  return seriesData.series
    .filter((series: any) => series && series.name && Array.isArray(series.posts))
    .map((series: any) => ({
      name: series.name,
      count: series.posts.length
    }))
    .sort((a: { name: string; count: number }, b: { name: string; count: number }) => a.name.localeCompare(b.name))
}
