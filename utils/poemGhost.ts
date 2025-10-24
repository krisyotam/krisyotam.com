const GHOST_URL = process.env.GHOST_URL || "https://kris-yotam.ghost.io"
const GHOST_KEY = process.env.GHOST_KEY || "55704fddcdb457f05e61b3aef2"
const POEM_FILTER_TAG = process.env.POEM_FILTER_TAG || "poem"

export interface GhostPoem {
  slug: string
  title: string
  html: string
  published_at: string
  feature_image: string
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

export async function getPoemBySlug(slug: string): Promise<GhostPoem | null> {
  try {
    const res = await fetch(`${GHOST_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${GHOST_KEY}&include=tags`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch poem: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data.posts || data.posts.length === 0) {
      return null
    }

    return data.posts[0]
  } catch (error) {
    console.error("Error getting poem by slug:", error)
    throw error
  }
}

export async function getAllPoems(): Promise<GhostPoem[]> {
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_KEY}&filter=tag:${POEM_FILTER_TAG}&include=tags&limit=all`,
      { cache: "no-store" },
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch poems: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.posts
  } catch (error) {
    console.error("Error fetching poems:", error)
    throw error
  }
}

export async function getPoemTypes(): Promise<string[]> {
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/v3/content/posts/?key=${GHOST_KEY}&filter=tag:${POEM_FILTER_TAG}&include=tags&fields=tags&limit=all`,
      { cache: "no-store" },
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch poem types: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const types = new Set<string>()

    data.posts.forEach((post: GhostPoem) => {
      post.tags.forEach((tag) => {
        // Assuming poem types are tagged with "type-{poemType}"
        if (tag.name.startsWith("type-")) {
          types.add(tag.name.replace("type-", ""))
        }
      })
    })

    return Array.from(types)
  } catch (error) {
    console.error("Error fetching poem types:", error)
    return []
  }
}

// Helper function to process poetry content from Ghost
export function processPoetryContent(html: string): string {
  if (!html) return ""

  // Replace <p> tags with div tags to preserve line breaks
  let processedHtml = html.replace(/<p>/g, '<div class="poetry-stanza">').replace(/<\/p>/g, "</div>")

  // Ensure <br> tags are preserved
  processedHtml = processedHtml.replace(/<br>/g, "<br />")

  return processedHtml
}

