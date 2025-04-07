import { promises as fs } from "fs"
import path from "path"

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
  headings?: string[]
  marginNotes?: string[]
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
  confidence?: string
  importance?: number
}

export interface CategoriesData {
  categories: CategoryData[]
}

// Helper function to get the year from a date string
export function getPostYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString()
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "feed.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const data: PostsData = JSON.parse(fileContents)

    // Sort posts by date (newest first)
    return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error loading posts:", error)
    return []
  }
}

// Get active posts (state === 'active')
export async function getActivePosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  // getAllPosts already sorts by date, so we just need to filter
  return allPosts.filter((post) => post.state === "active")
}

// Get a specific post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPosts()
  return allPosts.find((post) => post.slug === slug) || null
}

// Get all category data
export async function getAllCategoryData(): Promise<CategoryData[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "category-data.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const data: CategoriesData = JSON.parse(fileContents)
    return data.categories
  } catch (error) {
    console.error("Error loading category data:", error)
    return []
  }
}

// Get category data by slug
export async function getCategoryDataBySlug(slug: string): Promise<CategoryData | null> {
  try {
    const categories = await getAllCategoryData()
    return categories.find((category) => category.slug === slug) || null
  } catch (error) {
    console.error("Error finding category data:", error)
    return null
  }
}

// Get all unique categories (only active ones)
export async function getCategories(): Promise<{ slug: string; name: string; count: number }[]> {
  try {
    const allPosts = await getActivePosts() // Only count active posts
    const categoryData = await getAllCategoryData()

    // Get active category slugs
    const activeCategorySlugs = categoryData
      .filter((category) => category["show-status"] === "active")
      .map((category) => category.slug)

    // Create a map to count posts per category
    const categoryCounts = new Map<string, number>()

    // Count posts for each category
    allPosts.forEach((post) => {
      if (post.category) {
        const slug = post.category.toLowerCase().replace(/\s+/g, "-")
        categoryCounts.set(slug, (categoryCounts.get(slug) || 0) + 1)
      }
    })

    // Map to { slug, name, count } format and filter out hidden categories
    return activeCategorySlugs
      .map((slug) => {
        // Find the category data for this slug
        const category = categoryData.find((c) => c.slug === slug)

        return {
          slug,
          name:
            category?.title ||
            slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          count: categoryCounts.get(slug) || 0,
        }
      })
      .filter((category) => category.count > 0) // Only include categories with posts
  } catch (error) {
    console.error("Error loading categories:", error)
    return []
  }
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const allPosts = await getActivePosts() // Only include active posts

    // Filter posts by matching category slug
    return allPosts.filter((post) => {
      if (!post.category) return false

      const postCategorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
      return postCategorySlug === categorySlug
    })
  } catch (error) {
    console.error("Error loading posts by category:", error)
    return []
  }
}

// Check if a post is MDX
export function isPostMDX(year: string, slug: string): boolean {
  try {
    const mdxPath = path.join(process.cwd(), "app", "blog", year, slug, "page.mdx")
    return fs
      .stat(mdxPath)
      .then(() => true)
      .catch(() => false)
  } catch {
    return false
  }
}

// New function to get content for a post (MDX or other)
export async function getPostContent(year: string, slug: string) {
  try {
    // Check if there's an MDX version of the post
    const mdxPath = path.join(process.cwd(), "data", "posts", year, slug, "content.mdx")
    const fileExists = await fs.stat(mdxPath).catch(() => null)

    if (fileExists) {
      const mdxData = await fs.readFile(mdxPath, "utf-8")
      return {
        isMDX: true,
        mdxData,
        blogPostExists: true,
      }
    }

    // Return default if no MDX content exists
    return {
      isMDX: false,
      mdxData: null,
      blogPostExists: false,
    }
  } catch (error) {
    console.error("Error loading MDX content:", error)
    return {
      isMDX: false,
      mdxData: null,
      blogPostExists: false,
    }
  }
}

