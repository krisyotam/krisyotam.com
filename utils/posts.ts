// utils/posts.ts

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

// Helper to guard server‑only code
function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("This function must be called server‑side only")
  }
}

// Extract year from date
export function getPostYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString()
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

// Get all posts, sorted newest first
export async function getAllPosts(): Promise<Post[]> {
  const data = await readDataFile<PostsData>("feed.json")
  const posts = data?.posts || []
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Only active posts (state === "active")
export async function getActivePosts(): Promise<Post[]> {
  const all = await getAllPosts()
  return all.filter((post) => post.state === "active")
}

// Find post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts()
  return all.find((post) => post.slug === slug) || null
}

// Load category metadata
export async function getAllCategoryData(): Promise<CategoryData[]> {
  const data = await readDataFile<CategoriesData>("category-data.json")
  return data?.categories || []
}

export async function getCategoryDataBySlug(
  slug: string
): Promise<CategoryData | null> {
  const all = await getAllCategoryData()
  return all.find((c) => c.slug === slug) || null
}

// List categories with post counts, respecting category-data.json show-status
export async function getCategories(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const posts = await getActivePosts()
  const meta = await getAllCategoryData()

  // tally up posts per slugified category
  const counts = new Map<string, number>()
  posts.forEach((p) => {
    const slug = p.category.toLowerCase().replace(/\s+/g, "-")
    counts.set(slug, (counts.get(slug) || 0) + 1)
  })

  // build the final list, filtering out hidden categories
  const result: { slug: string; name: string; count: number }[] = []
  for (const [slug, count] of counts) {
    const catMeta = meta.find((c) => c.slug === slug)
    // if metadata exists and is hidden, skip
    if (catMeta && catMeta["show-status"] === "hidden") continue

    // determine display name
    const name =
      catMeta?.title ||
      slug
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")

    result.push({ slug, name, count })
  }

  return result
}

// Get posts by category slug
export async function getPostsByCategory(
  categorySlug: string
): Promise<Post[]> {
  const posts = await getActivePosts()
  return posts.filter((p) => {
    const slug = p.category.toLowerCase().replace(/\s+/g, "-")
    return slug === categorySlug
  })
}

// Check MDX existence
export async function isPostMDX(year: string, slug: string): Promise<boolean> {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  try {
    await fs.stat(
      path.join(process.cwd(), "app", "blog", year, slug, "page.mdx")
    )
    return true
  } catch {
    return false
  }
}

// Load MDX content
export async function getPostContent(year: string, slug: string) {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  const mdxPath = path.join(
    process.cwd(),
    "data",
    "posts",
    year,
    slug,
    "content.mdx"
  )
  try {
    const mdxData = await fs.readFile(mdxPath, "utf-8")
    return { isMDX: true, mdxData, blogPostExists: true }
  } catch {
    return { isMDX: false, mdxData: null, blogPostExists: false }
  }
}
