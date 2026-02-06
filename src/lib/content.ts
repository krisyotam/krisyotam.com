/**
 * =============================================================================
 * Universal Content Aggregation
 * =============================================================================
 *
 * Aggregates content across all types from content.db.
 * Used for global /tags and /categories pages.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import {
  getActiveContentByType,
  getTagsByContentType,
  getCategoriesByContentType,
  getCategoriesData,
  getTagsData,
  type Post,
  type TagData,
  type CategoryData
} from '@/lib/data'

// =============================================================================
// Types
// =============================================================================

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
  type: string
  route: string
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

// =============================================================================
// Content Types Configuration
// =============================================================================

// Content types that were migrated to the database
const DB_CONTENT_TYPES = [
  { type: 'blog', route: 'blog' },
  { type: 'essays', route: 'essays' },
  { type: 'fiction', route: 'fiction' },
  { type: 'news', route: 'news' },
  { type: 'notes', route: 'notes' },
  { type: 'ocs', route: 'characters' },
  { type: 'papers', route: 'papers' },
  { type: 'progymnasmata', route: 'progymnasmata' },
  { type: 'reviews', route: 'reviews' },
  { type: 'sequences', route: 'sequences' },
  { type: 'verse', route: 'verse' },
] as const

type ContentType = typeof DB_CONTENT_TYPES[number]['type']

// =============================================================================
// Helper Functions
// =============================================================================

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-')
}

// =============================================================================
// Universal Post Functions
// =============================================================================

/**
 * Get all active posts from all content types in the database
 */
export async function getAllUniversalPosts(): Promise<UniversalPost[]> {
  const allPosts: UniversalPost[] = []

  for (const contentType of DB_CONTENT_TYPES) {
    try {
      const posts = getActiveContentByType(contentType.type)

      const transformedPosts = posts.map((post: Post) => ({
        title: post.title,
        subtitle: post.subtitle,
        preview: post.preview,
        start_date: post.start_date,
        end_date: post.end_date,
        tags: post.tags || [],
        category: post.category,
        slug: post.slug,
        state: post.state,
        status: post.status,
        confidence: post.confidence,
        importance: post.importance,
        cover_image: post.cover_image,
        type: contentType.type,
        route: `/${contentType.route}`,
      }))

      allPosts.push(...transformedPosts)
    } catch (error) {
      console.error(`Error loading ${contentType.type}:`, error)
    }
  }

  return allPosts
}

/**
 * Get only active posts (state === "active")
 */
export async function getActiveUniversalPosts(): Promise<UniversalPost[]> {
  // getActiveContentByType already filters by state === 'active'
  return getAllUniversalPosts()
}

// =============================================================================
// Universal Tag Functions
// =============================================================================

/**
 * Get all tags from all content types, merged by slug
 * Only returns tags that exist in the main tags table
 */
export async function getAllUniversalTags(): Promise<{ slug: string; title: string; count: number; types: string[] }[]> {
  const posts = await getActiveUniversalPosts()

  // Load all valid tags from the tags table
  const { tags: validTags } = await getTagsData()
  const validTagSlugs = new Set(validTags.map(t => t.slug))
  const tagMetaMap = new Map(validTags.map(t => [t.slug, { slug: t.slug, title: t.title }]))

  const tagMap = new Map<string, { title: string; count: number; types: Set<string> }>()

  // Count posts per tag, but only for valid tags
  posts.forEach(post => {
    if (!post.tags) return

    post.tags.forEach(tag => {
      const slug = slugify(tag)

      // Only count if this tag exists in the tags table
      if (!validTagSlugs.has(slug)) return

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

  // Convert to array and sort by title
  return Array.from(tagMap.entries())
    .map(([slug, data]) => ({
      slug,
      title: data.title,
      count: data.count,
      types: Array.from(data.types)
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

// =============================================================================
// Universal Category Functions
// =============================================================================

/**
 * Get all categories from all content types, merged by slug
 * Only returns categories that exist in the main categories table
 */
export async function getAllUniversalCategories(): Promise<{ slug: string; title: string; count: number; types: string[] }[]> {
  const posts = await getActiveUniversalPosts()

  // Load all valid categories from the categories table
  const { categories: validCategories } = await getCategoriesData()
  const validCategorySlugs = new Set(validCategories.map(c => c.slug))
  const categoryMetaMap = new Map(validCategories.map(c => [c.slug, { slug: c.slug, title: c.title }]))

  const categoryMap = new Map<string, { title: string; count: number; types: Set<string> }>()

  // Count posts per category, but only for valid categories
  posts.forEach(post => {
    if (!post.category) return

    const slug = slugify(post.category)

    // Only count if this category exists in the categories table
    if (!validCategorySlugs.has(slug)) return

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

  // Convert to array and sort by title
  return Array.from(categoryMap.entries())
    .map(([slug, data]) => ({
      slug,
      title: data.title,
      count: data.count,
      types: Array.from(data.types)
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

// =============================================================================
// Posts by Tag/Category Functions
// =============================================================================

/**
 * Get posts by tag across all content types
 */
export async function getUniversalPostsByTag(tagSlug: string): Promise<UniversalPost[]> {
  const posts = await getActiveUniversalPosts()
  return posts.filter(post => {
    if (!post.tags) return false
    return post.tags.some(tag => slugify(tag) === tagSlug)
  }).sort((a, b) => {
    const dateA = a.end_date || a.start_date || ''
    const dateB = b.end_date || b.start_date || ''
    return dateB.localeCompare(dateA)
  })
}

/**
 * Get posts by category across all content types
 */
export async function getUniversalPostsByCategory(categorySlug: string): Promise<UniversalPost[]> {
  const posts = await getActiveUniversalPosts()
  return posts.filter(post => {
    if (!post.category) return false
    return slugify(post.category) === categorySlug
  }).sort((a, b) => {
    const dateA = a.end_date || a.start_date || ''
    const dateB = b.end_date || b.start_date || ''
    return dateB.localeCompare(dateA)
  })
}

// =============================================================================
// Metadata Functions
// =============================================================================

/**
 * Get tag metadata by slug
 */
export async function getTagMeta(tagSlug: string): Promise<TagMeta | null> {
  for (const contentType of DB_CONTENT_TYPES) {
    try {
      const tags = getTagsByContentType(contentType.type)
      const tag = tags.find(t => t.slug === tagSlug)
      if (tag) {
        return {
          slug: tag.slug,
          title: tag.title,
          preview: tag.preview || undefined,
          date: new Date().toISOString(),
          status: 'Active',
          confidence: 'certain',
          importance: tag.importance,
        }
      }
    } catch (error) {
      // Continue to next content type
    }
  }

  return null
}

/**
 * Get category metadata by slug
 */
export async function getCategoryMeta(categorySlug: string): Promise<CategoryMeta | null> {
  for (const contentType of DB_CONTENT_TYPES) {
    try {
      const categories = getCategoriesByContentType(contentType.type)
      const category = categories.find(c => c.slug === categorySlug)
      if (category) {
        return {
          slug: category.slug,
          title: category.title,
          preview: category.preview || undefined,
          date: category.date || new Date().toISOString(),
          status: category.status,
          confidence: category.confidence,
          importance: category.importance,
        }
      }
    } catch (error) {
      // Continue to next content type
    }
  }

  return null
}
