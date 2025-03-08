import { getPostBySlug as getGhostPostBySlug, getPosts as getGhostPosts } from "./ghost"
import feedData from "../data/feed.json"

export interface Post {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  type: "tsx" | "ghost" // Restrict 'type' to only 'tsx' or 'ghost'
  slug: string
  html?: string
}

export async function getAllPosts(): Promise<Post[]> {
  console.log("Getting all posts from feed:", feedData.posts)

  // Get all Ghost posts first
  const ghostPosts = await getGhostPosts()
  console.log("Got Ghost posts:", ghostPosts.length)

  // Create a map of feed posts for quick lookup
  const feedPostsMap = new Map(feedData.posts.map((post) => [post.slug, post]))

  // Process Ghost posts to match our format
  const processedGhostPosts: Post[] = ghostPosts
    .map((ghostPost) => {
      const feedPost = feedPostsMap.get(ghostPost.slug)
      if (!feedPost) return null // Avoid any further errors

      return {
        ...feedPost,
        html: ghostPost.html,
        preview: ghostPost.excerpt || feedPost.preview,
        type: "ghost" as "ghost", // Explicitly set the type to "ghost"
      }
    })
    .filter((post): post is Post => post !== null) // Filter out null values and ensure Post type

  console.log("Processed Ghost posts:", processedGhostPosts.length)

  // Get TSX posts from our feed data
  const tsxPosts: Post[] = feedData.posts
    .filter((post) => post.type === "tsx")
    .map((post) => ({
      ...post,
      type: "tsx" as "tsx", // Explicitly set the type to "tsx"
    }))
  console.log("TSX posts from feed data:", tsxPosts.length)

  // Combine and sort all posts by date (newest first)
  const allPosts = [...processedGhostPosts, ...tsxPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  console.log("All posts:", allPosts.length)
  return allPosts
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(
    (post) =>
      post.category.toLowerCase() === category.toLowerCase() ||
      post.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase(),
  )
}

export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const allPosts = await getAllPosts()
  const categoryCounts: Record<string, number> = {}

  allPosts.forEach((post) => {
    const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
    if (!categoryCounts[categorySlug]) {
      categoryCounts[categorySlug] = 0
    }
    categoryCounts[categorySlug]++
  })

  return Object.entries(categoryCounts).map(([slug, count]) => ({
    name: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    slug,
    count,
  }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log(`Getting post by slug: ${slug}`)

  // First check in feed data
  const feedPost = feedData.posts.find((post) => post.slug === slug)

  if (!feedPost) {
    console.log(`Post not found in feed data: ${slug}`)
    return null
  }

  // If it's a Ghost post, fetch the HTML content
  if (feedPost.type === "ghost") {
    try {
      const ghostPost = await getGhostPostBySlug(slug)
      if (!ghostPost) {
        console.log(`Ghost post not found: ${slug}`)
        return feedPost // Return feed data without HTML if Ghost post not found
      }

      return {
        ...feedPost,
        html: ghostPost.html,
        type: "ghost" as "ghost", // Ensure the type is "ghost"
      }
    } catch (error) {
      console.error(`Error fetching Ghost post: ${slug}`, error)
      return feedPost // Return feed data without HTML if there's an error
    }
  }

  // For TSX posts, just return the feed data
  return {
    ...feedPost,
    type: "tsx" as "tsx", // Ensure the type is "tsx"
  }
}

export function getPostYear(date: string): string {
  if (!date) {
    return "Unknown" // Handle cases where date might be undefined
  }
  return new Date(date).getFullYear().toString()
}
