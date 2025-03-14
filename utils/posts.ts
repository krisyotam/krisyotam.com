import fs from "fs"
import path from "path"
import feedData from "../data/feed.json"

export interface Post {
  headings: never[]
  marginNotes: never[]
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  status: "active" | "hidden" // New status field
  html?: string
}

export async function getAllPosts(): Promise<Post[]> {
  console.log("Getting all posts from feed:", feedData.posts)

  // Get all posts from feed data
  const allPosts = feedData.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  console.log("All posts:", allPosts.length)
  return allPosts
}

export async function getActivePosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.status === "active")
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const allPosts = await getActivePosts()
  return allPosts.filter(
    (post) =>
      post.category.toLowerCase() === category.toLowerCase() ||
      post.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase(),
  )
}

export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const allPosts = await getActivePosts()
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

// Update the getPostBySlug function to correctly handle the new file structure

export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log(`Getting post by slug: ${slug}`)

  // Find the post in feed data first
  const feedPost = feedData.posts.find((post) => post.slug === slug)
  if (!feedPost) {
    console.log(`Post not found in feed data: ${slug}`)
    return null
  }

  // Get the year from the post date
  const year = getPostYear(feedPost.date)

  // Check for the post in the file system under the blog/[year]/[slug] structure
  const postPath = path.join(process.cwd(), "blog", year, slug)
  console.log(`Looking for post at path: ${postPath}`)

  if (fs.existsSync(postPath)) {
    console.log(`Found post directory at: ${postPath}`)

    // Check if page.tsx exists
    const pagePath = path.join(postPath, "page.tsx")
    if (fs.existsSync(pagePath)) {
      console.log(`Found page.tsx at: ${pagePath}`)
    } else {
      console.log(`No page.tsx found at: ${pagePath}`)
    }

    try {
      const postDataPath = path.join(postPath, "data.json")
      if (fs.existsSync(postDataPath)) {
        const postData = fs.readFileSync(postDataPath, "utf8")
        const postJson = JSON.parse(postData)
        return {
          ...postJson,
          status: postJson.status || "active", // Default to active if status is not specified
        }
      }
    } catch (error) {
      console.error(`Error reading post data for slug: ${slug}`, error)
    }
  } else {
    console.log(`Post directory not found at: ${postPath}`)
  }

  // If we couldn't find or read the data.json, return the feed data
  return feedPost
}

export function getPostYear(date: string): string {
  if (!date) {
    return "Unknown" // Handle cases where date might be undefined
  }
  return new Date(date).getFullYear().toString()
}

export async function getPostsByYear(year: string): Promise<Post[]> {
  const allPosts = await getActivePosts()
  return allPosts.filter((post) => getPostYear(post.date) === year)
}

