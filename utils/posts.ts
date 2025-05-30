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
  cover_image?: string
  cover?: string
  path?: string // Custom URL path for the post
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
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return new Date().getFullYear().toString(); // Default to current year
    }
    
    return date.getFullYear().toString();
  } catch (error) {
    console.error(`Error extracting year from date ${dateString}:`, error);
    return new Date().getFullYear().toString(); // Default to current year
  }
}

// Read a JSON file from /data
async function readDataFile<T>(filename: string): Promise<T | null> {
  assertServer()
  const [{ promises: fs }, path] = await Promise.all([
    import("fs"),
    import("path"),
  ])
  
  // Define multiple possible paths to try
  const pathsToTry = [
    path.join(process.cwd(), "data", filename),
    path.join(process.cwd(), "..", "data", filename),
    path.join(process.cwd(), "public", "data", filename)
  ]
    console.log(`Attempting to read data file: ${filename}`)
  console.log(`Current working directory: ${process.cwd()}`)
  
  // Try each path until one works
  for (const fullPath of pathsToTry) {
    try {
      console.log(`Trying path: ${fullPath}`)
      
      // Verify file exists
      const fileExists = await fs.access(fullPath).then(() => true).catch(() => false)
      if (!fileExists) {
        console.log(`File not found at: ${fullPath}`)
        continue
      }
      
      const contents = await fs.readFile(fullPath, "utf8")
      
      try {
        return JSON.parse(contents) as T
      } catch (parseError) {
        console.error(`Error parsing JSON from ${filename}:`, parseError instanceof Error ? parseError.message : String(parseError))
        console.error(`Content sample: ${contents.substring(0, 100)}...`)
        break
      }
    } catch (e) {
      console.log(`Error reading from ${fullPath}:`, e instanceof Error ? e.message : String(e))
      continue
    }
  }
  
  console.error(`File ${filename} not found in any location`)
  return null
}

// Add caching for production
let cachedPosts: Post[] | null = null;

// Get all posts, sorted newest first
export async function getAllPosts(): Promise<Post[]> {
  // Use cached data if available in production
  if (process.env.NODE_ENV === 'production' && cachedPosts) {
    return cachedPosts;
  }
  
  const data = await readDataFile<PostsData>("blog/feed.json")
  const posts = data?.posts || []
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Cache the data in production
  if (process.env.NODE_ENV === 'production') {
    cachedPosts = sortedPosts;
  }
  
  return sortedPosts
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
  const data = await readDataFile<CategoriesData>("blog/category-data.json")
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
  
  // Only use the app/blog structure which is the canonical location for MDX content
  const mdxPath = path.join(process.cwd(), "app", "blog", year, slug, "page.mdx")
  
  console.log(`Attempting to load MDX for ${year}/${slug}`)
  console.log(`CWD: ${process.cwd()}`)
  console.log(`Trying path: ${mdxPath}`)
  
  try {
    const mdxData = await fs.readFile(mdxPath, "utf-8")
    console.log(`Successfully loaded MDX from ${mdxPath}`)
    return { isMDX: true, mdxData, blogPostExists: true }
  } catch (err) {
    console.log(`Failed to load from ${mdxPath}: ${err instanceof Error ? err.message : String(err)}`)
    console.log(`Could not find MDX for ${year}/${slug} at app/blog/${year}/${slug}/page.mdx`)
    return { isMDX: false, mdxData: null, blogPostExists: false }
  }
}
