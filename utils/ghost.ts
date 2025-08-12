const GHOST_URL = process.env.GHOST_URL || "https://kris-yotam.ghost.io"
const GHOST_KEY = process.env.GHOST_KEY || "55704fddcdb457f05e61b3aef2"
const HOME_PAGE_FILTER_TAG = process.env.HOME_PAGE_FILTER_TAG || "krisyotam.com"
const BOOK_FILTER_TAG = process.env.BOOK_FILTER_TAG || "book"
const NOW_PAGE_FILTER_TAG = process.env.NOW_PAGE_FILTER_TAG || "krisyotam-now"

export interface GhostPost {
  slug: string
  title: string
  excerpt: string
  html: string
  published_at: string
  feature_image: string
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

export async function getPosts(): Promise<GhostPost[]> {
  try {
    const res = await fetch(`${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_KEY}&include=tags&limit=500`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    return data.posts
      .filter((post: GhostPost) => post.tags.some((tag) => tag.name === `#${HOME_PAGE_FILTER_TAG}`))
      .filter((post: GhostPost) => !post.tags.some((tag) => tag.name === `#${NOW_PAGE_FILTER_TAG}`))
      .sort((a: GhostPost, b: GhostPost) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export async function getBooks(): Promise<GhostPost[]> {
  try {
    const res = await fetch(`${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_KEY}&include=tags&limit=500`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    return data.posts
      .filter((post: GhostPost) => post.tags.some((tag) => tag.name === `#${BOOK_FILTER_TAG}`))
      .sort((a: GhostPost, b: GhostPost) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  } catch (error) {
    console.error("Error fetching books:", error)
    throw error
  }
}

export async function getBookBySlug(slug: string): Promise<GhostPost | null> {
  try {
    const res = await fetch(`${GHOST_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${GHOST_KEY}&include=tags`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch book: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data.posts || data.posts.length === 0) {
      return null
    }

    return data.posts[0]
  } catch (error) {
    console.error("Error getting book by slug:", error)
    throw error
  }
}

export async function getFeaturedImage(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${GHOST_KEY}&fields=feature_image`,
      {
        cache: "no-store",
      },
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch featured image: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data.posts || data.posts.length === 0) {
      return null
    }

    return data.posts[0].feature_image
  } catch (error) {
    console.error("Error fetching featured image:", error)
    return null
  }
}

export async function getCategories() {
  try {
    const posts = await getPosts()
    const categoryCount: Record<string, { count: number; slug: string }> = {}

    posts.forEach((post) => {
      const validTags = post.tags.filter((tag) => !tag.name.startsWith("#"))
      validTags.forEach((tag) => {
        if (!categoryCount[tag.name]) {
          categoryCount[tag.name] = { count: 0, slug: tag.slug }
        }
        categoryCount[tag.name].count++
      })
    })

    return Object.entries(categoryCount)
      .map(([name, { count, slug }]) => ({
        name,
        count,
        slug,
      }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error("Error getting categories:", error)
    throw error
  }
}

export async function getPostsByCategory(slug: string) {
  try {
    const posts = await getPosts()
    return posts.filter((post) => post.tags.some((tag) => tag.slug === slug && !tag.name.startsWith("#")))
  } catch (error) {
    console.error("Error getting posts by category:", error)
    throw error
  }
}

export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  try {
    const res = await fetch(`${GHOST_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${GHOST_KEY}&include=tags`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data.posts || data.posts.length === 0) {
      return null
    }

    return data.posts[0]
  } catch (error) {
    console.error("Error getting post by slug:", error)
    throw error
  }
}

export async function getNowPosts(): Promise<GhostPost[]> {
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_KEY}&filter=tag:${NOW_PAGE_FILTER_TAG}&limit=10&order=published_at%20desc`,
      { cache: "no-store" },
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch now posts: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.posts
  } catch (error) {
    console.error("Error fetching now posts:", error)
    throw error
  }
}

