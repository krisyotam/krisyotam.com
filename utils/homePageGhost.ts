const GHOST_URL = process.env.GHOST_URL || "https://kris-yotam.ghost.io"
const GHOST_KEY = process.env.GHOST_KEY || "55704fddcdb457f05e61b3aef2"
const HOME_PAGE_FILTER_TAG = process.env.HOME_PAGE_FILTER_TAG || "krisyotam.com"
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

export async function getHomePagePosts(): Promise<GhostPost[]> {
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
      .filter((post: GhostPost) => !post.tags.some((tag) => tag.name === NOW_PAGE_FILTER_TAG))
      .sort((a: GhostPost, b: GhostPost) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  } catch (error) {
    console.error("Error fetching home page posts:", error)
    throw error
  }
}

