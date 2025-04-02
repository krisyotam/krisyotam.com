import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { cache } from "react"

export interface Post {
  title: string
  subtitle?: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  state: string
  status?: string
  confidence?: string
  importance?: number
}

export interface PostsData {
  posts: Post[]
}

// Helper function to get the year from a date string
export function getPostYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString()
}

// Get all posts
export const getAllPosts = cache(async (): Promise<Post[]> => {
  try {
    const filePath = path.join(process.cwd(), "data", "feed.json")
    const fileContents = await fs.readFileSync(filePath, "utf8")
    const data: PostsData = JSON.parse(fileContents)

    // Sort posts by date (newest first)
    return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error loading posts:", error)
    return []
  }
})

// Get active posts (state === 'active')
export const getActivePosts = cache(async (): Promise<Post[]> => {
  const allPosts = await getAllPosts()
  // getAllPosts already sorts by date, so we just need to filter
  return allPosts.filter((post) => post.state === "active")
})

// Get a specific post by slug
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const allPosts = await getAllPosts()
    return allPosts.find((post) => post.slug === slug) || null
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return null
  }
})

// Check if an MDX file exists for a post
export function isPostMDX(year: string, slug: string): boolean {
  try {
    const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
    return fs.existsSync(mdxPath)
  } catch (error) {
    console.error(`Error checking if MDX file exists for ${year}/${slug}:`, error)
    return false
  }
}

// Get all unique categories
export const getCategories = cache(async (): Promise<{ slug: string; name: string }[]> => {
  try {
    const allPosts = await getAllPosts()
    // Extract unique categories from posts
    const uniqueCategories = Array.from(new Set(allPosts.map((post) => post.category)))
    // Map to { slug, name } format expected by generateStaticParams
    return uniqueCategories.map((category) => ({
      slug: category.toLowerCase().replace(/\s+/g, "-"), // e.g., "Tech News" -> "tech-news"
      name: category, // Original category name
    }))
  } catch (error) {
    console.error("Error loading categories:", error)
    return []
  }
})

// Get posts by category
export const getPostsByCategory = cache(async (categorySlug: string): Promise<Post[]> => {
  try {
    const allPosts = await getAllPosts()
    // Filter posts by matching category slug
    return allPosts.filter((post) => {
      const postCategorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
      return postCategorySlug === categorySlug
    })
  } catch (error) {
    console.error("Error loading posts by category:", error)
    return []
  }
})

// Function to check if a blog post file exists
export function checkPostExists(year: string, slug: string): boolean {
  try {
    const blogPostPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx")
    return fs.existsSync(blogPostPath)
  } catch (error) {
    console.error(`Error checking if blog post exists for ${year}/${slug}:`, error)
    return false
  }
}

// Function to extract headings from MDX content
function extractHeadings(content: string) {
  const headings = []
  // Match both Markdown headings (# Title) and JSX headings (<h1>Title</h1>)
  const markdownHeadingRegex = /^(#{1,3})\s+(.+?)(?:\s+\{#([a-zA-Z0-9-]+)\})?$/gm
  const jsxHeadingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/g

  // Extract Markdown headings
  let match
  while ((match = markdownHeadingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = match[3] || text.toLowerCase().replace(/[^\w]+/g, "-")

    headings.push({
      level,
      text,
      id,
    })
  }

  // Extract JSX headings
  while ((match = jsxHeadingRegex.exec(content)) !== null) {
    const level = Number.parseInt(match[1])
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w]+/g, "-")

    // Check if this heading is already in the list (might have been caught by markdown regex)
    const exists = headings.some((h) => h.text === text && h.level === level)
    if (!exists) {
      headings.push({
        level,
        text,
        id,
      })
    }
  }

  console.log("Extracted headings:", headings)
  return headings
}

// Function to get post content (MDX or regular)
export async function getPostContent(year: string, slug: string) {
  const isMDX = isPostMDX(year, slug)
  let mdxData = null
  let blogPostExists = false

  // If MDX post exists, read its content
  if (isMDX) {
    try {
      const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
      const mdxSource = fs.readFileSync(mdxPath, "utf8")

      // Parse frontmatter to get headings, margin notes, etc.
      const { content, data } = matter(mdxSource)

      // If no headings in frontmatter, try to extract them from content
      if (!data.headings || data.headings.length === 0) {
        data.headings = extractHeadings(content)
      }

      console.log("Headings for MDX post:", data.headings)

      mdxData = {
        content,
        frontmatter: data,
      }
    } catch (error) {
      console.error(`Error reading MDX file for ${year}/${slug}:`, error)
    }
  } else {
    // Check if there's a corresponding blog post file in the blog directory
    blogPostExists = checkPostExists(year, slug)
    console.log(`🔍 DEBUG: Blog post file exists:`, blogPostExists)
  }

  return {
    isMDX,
    mdxData,
    blogPostExists,
  }
}

