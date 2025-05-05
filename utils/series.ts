// utils/series.ts

import { Post } from "./posts"

export interface SeriesPost {
  slug: string
  order: number
}

export interface SeriesData {
  slug: string
  title: string
  subtitle?: string
  preview?: string
  date: string
  "show-status": "active" | "hidden"
  status: string
  confidence?: string
  importance?: number
  posts: SeriesPost[]
}

export interface SeriesListData {
  series: SeriesData[]
}

// Helper to guard server‑only code
function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("This function must be called server‑side only")
  }
}

// Read a JSON file from /data
async function readDataFile<T>(filename: string): Promise<T | null> {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  try {
    const fullPath = path.join(process.cwd(), "data", filename)
    const contents = await fs.readFile(fullPath, "utf8")
    return JSON.parse(contents) as T
  } catch (e) {
    console.error(`Error reading ${filename}:`, e)
    return null
  }
}

// Get all series data
export async function getAllSeriesData(): Promise<SeriesData[]> {
  const data = await readDataFile<SeriesListData>("series.json")
  return data?.series || []
}

// Get a specific series by slug
export async function getSeriesBySlug(slug: string): Promise<SeriesData | null> {
  const all = await getAllSeriesData()
  return all.find((s) => s.slug === slug) || null
}

// Get all active series with post counts
export async function getSeries(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const seriesData = await getAllSeriesData()
  
  return seriesData
    .filter(series => series["show-status"] === "active")
    .map(series => ({
      slug: series.slug,
      name: series.title,
      count: series.posts.length
    }))
    .sort((a, b) => b.count - a.count)
}

// Get posts for a specific series
export async function getPostsForSeries(
  seriesSlug: string,
  allPosts: Post[]
): Promise<Post[]> {
  const series = await getSeriesBySlug(seriesSlug)
  if (!series) return []
  
  // Get the posts in the series, sorted by order
  const seriesPosts = [...series.posts].sort((a, b) => a.order - b.order)
  const seriesPostSlugs = seriesPosts.map(p => p.slug)
  
  // Find the actual post data for each slug
  return seriesPostSlugs
    .map(slug => allPosts.find(post => post.slug === slug))
    .filter((post): post is Post => post !== undefined)
} 