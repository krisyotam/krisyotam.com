// utils/universal-content.ts
// Universal content aggregation across all content types

import { promises as fs } from 'fs'
import path from 'path'

export interface UniversalPost {
  title: string
  subtitle?: string
  preview?: string
  start_date: string
  end_date?: string
  date?: string
  tags: string[]
  category: string
  slug: string
  state?: string
  status?: string
  confidence?: string
  importance?: number
  cover_image?: string
  type: string // Content type (essays, notes, papers, etc.)
  route: string // URL route to the post
}

export interface TagMeta {
  slug: string
  title: string
  preview?: string
  date: string
  'show-status'?: 'active' | 'hidden'
  status?: string
  confidence?: string
  importance?: number
}

export interface CategoryMeta {
  slug: string
  title: string
  subtitle?: string
  preview?: string
  date: string
  'show-status'?: 'active' | 'hidden'
  status?: string
  confidence?: string
  importance?: number
}

// Content types with their corresponding routes
const CONTENT_TYPES = [
  { type: 'blog', route: 'blog', dataFile: 'blog.json', key: 'posts' },
  { type: 'essays', route: 'essays', dataFile: 'essays.json', key: 'essays' },
  { type: 'fiction', route: 'fiction', dataFile: 'fiction.json', key: 'fiction' },
  { type: 'news', route: 'news', dataFile: 'news.json', key: 'news' },
  { type: 'notes', route: 'notes', dataFile: 'notes.json', key: 'notes' },
  { type: 'papers', route: 'papers', dataFile: 'papers.json', key: 'papers' },
  { type: 'progymnasmata', route: 'progymnasmata', dataFile: 'progymnasmata.json', key: 'progymnasmata' },
  { type: 'reviews', route: 'reviews', dataFile: 'reviews.json', key: 'reviews' },
  { type: 'sequences', route: 'sequences', dataFile: 'sequences.json', key: 'sequences' },
  { type: 'til', route: 'til', dataFile: 'til.json', key: 'til' },
  { type: 'verse', route: 'verse', dataFile: 'verse.json', key: 'verse' },
  { type: 'research', route: 'research', dataFile: 'research.json', key: 'research' },
]

// Helper to read JSON file safely
async function readJSONFile<T>(filePath: string): Promise<T | null> {
  try {
    const contents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(contents) as T
  } catch (error) {
    // File doesn't exist or can't be parsed, return null
    return null
  }
}

// Get all posts from all content types
export async function getAllUniversalPosts(): Promise<UniversalPost[]> {
  const allPosts: UniversalPost[] = []

  for (const contentType of CONTENT_TYPES) {
    const dataPath = path.join(process.cwd(), 'data', contentType.type, contentType.dataFile)
    const data = await readJSONFile<any>(dataPath)

    if (data && data[contentType.key]) {
      const posts = data[contentType.key].map((post: any) => ({
        ...post,
        type: contentType.type,
        route: `/${contentType.route}`,
        // Normalize date field
        start_date: post.start_date || post.date || '',
      }))

      allPosts.push(...posts)
    }
  }

  return allPosts
}

// Get only active posts (state === "active")
export async function getActiveUniversalPosts(): Promise<UniversalPost[]> {
  const all = await getAllUniversalPosts()
  return all.filter(post => post.state === 'active')
}

// Get all tags from all content types, merged by slug
export async function getAllUniversalTags(): Promise<{ slug: string; title: string; count: number; types: string[] }[]> {
  const posts = await getActiveUniversalPosts()
  const tagMap = new Map<string, { title: string; count: number; types: Set<string> }>()

  // Load tag metadata from all content types
  const tagMetaMap = new Map<string, TagMeta>()
  for (const contentType of CONTENT_TYPES) {
    const tagsPath = path.join(process.cwd(), 'data', contentType.type, 'tags.json')
    const tagsData = await readJSONFile<{ tags: TagMeta[] }>(tagsPath)

    if (tagsData?.tags) {
      for (const tag of tagsData.tags) {
        if (!tagMetaMap.has(tag.slug) || tag['show-status'] === 'active') {
          tagMetaMap.set(tag.slug, tag)
        }
      }
    }
  }

  // Count posts per tag
  posts.forEach(post => {
    post.tags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-')

      if (!tagMap.has(slug)) {
        const meta = tagMetaMap.get(slug)
        tagMap.set(slug, {
          title: meta?.title || tag,
          count: 0,
          types: new Set<string>()
        })
      }

      const tagData = tagMap.get(slug)!
      tagData.count++
      tagData.types.add(post.type)
    })
  })

  // Convert to array and filter hidden tags
  return Array.from(tagMap.entries())
    .filter(([slug]) => {
      const meta = tagMetaMap.get(slug)
      return !meta || meta['show-status'] !== 'hidden'
    })
    .map(([slug, data]) => ({
      slug,
      title: data.title,
      count: data.count,
      types: Array.from(data.types)
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

// Get all categories from all content types, merged by slug
export async function getAllUniversalCategories(): Promise<{ slug: string; title: string; count: number; types: string[] }[]> {
  const posts = await getActiveUniversalPosts()
  const categoryMap = new Map<string, { title: string; count: number; types: Set<string> }>()

  // Load category metadata from all content types
  const categoryMetaMap = new Map<string, CategoryMeta>()
  for (const contentType of CONTENT_TYPES) {
    const categoriesPath = path.join(process.cwd(), 'data', contentType.type, 'categories.json')
    const categoriesData = await readJSONFile<{ categories: CategoryMeta[] }>(categoriesPath)

    if (categoriesData?.categories) {
      for (const category of categoriesData.categories) {
        if (!categoryMetaMap.has(category.slug) || category['show-status'] === 'active') {
          categoryMetaMap.set(category.slug, category)
        }
      }
    }
  }

  // Count posts per category
  posts.forEach(post => {
    const slug = post.category.toLowerCase().replace(/\s+/g, '-')

    if (!categoryMap.has(slug)) {
      const meta = categoryMetaMap.get(slug)
      categoryMap.set(slug, {
        title: meta?.title || post.category,
        count: 0,
        types: new Set<string>()
      })
    }

    const categoryData = categoryMap.get(slug)!
    categoryData.count++
    categoryData.types.add(post.type)
  })

  // Convert to array and filter hidden categories
  return Array.from(categoryMap.entries())
    .filter(([slug]) => {
      const meta = categoryMetaMap.get(slug)
      return !meta || meta['show-status'] !== 'hidden'
    })
    .map(([slug, data]) => ({
      slug,
      title: data.title,
      count: data.count,
      types: Array.from(data.types)
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

// Get posts by tag across all content types
export async function getUniversalPostsByTag(tagSlug: string): Promise<UniversalPost[]> {
  const posts = await getActiveUniversalPosts()
  return posts.filter(post => {
    return post.tags.some(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-')
      return slug === tagSlug
    })
  }).sort((a, b) => {
    const dateA = a.end_date || a.start_date || a.date || ''
    const dateB = b.end_date || b.start_date || b.date || ''
    return dateB.localeCompare(dateA)
  })
}

// Get posts by category across all content types
export async function getUniversalPostsByCategory(categorySlug: string): Promise<UniversalPost[]> {
  const posts = await getActiveUniversalPosts()
  return posts.filter(post => {
    const slug = post.category.toLowerCase().replace(/\s+/g, '-')
    return slug === categorySlug
  }).sort((a, b) => {
    const dateA = a.end_date || a.start_date || a.date || ''
    const dateB = b.end_date || b.start_date || b.date || ''
    return dateB.localeCompare(dateA)
  })
}

// Get tag metadata by slug
export async function getTagMeta(tagSlug: string): Promise<TagMeta | null> {
  for (const contentType of CONTENT_TYPES) {
    const tagsPath = path.join(process.cwd(), 'data', contentType.type, 'tags.json')
    const tagsData = await readJSONFile<{ tags: TagMeta[] }>(tagsPath)

    if (tagsData?.tags) {
      const tag = tagsData.tags.find(t => t.slug === tagSlug)
      if (tag) return tag
    }
  }

  return null
}

// Get category metadata by slug
export async function getCategoryMeta(categorySlug: string): Promise<CategoryMeta | null> {
  for (const contentType of CONTENT_TYPES) {
    const categoriesPath = path.join(process.cwd(), 'data', contentType.type, 'categories.json')
    const categoriesData = await readJSONFile<{ categories: CategoryMeta[] }>(categoriesPath)

    if (categoriesData?.categories) {
      const category = categoriesData.categories.find(c => c.slug === categorySlug)
      if (category) return category
    }
  }

  return null
}
