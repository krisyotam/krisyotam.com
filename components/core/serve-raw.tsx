/* =============================================================================
 * SERVE RAW - Raw MDX/MD Content Serving Utilities
 * =============================================================================
 * This module provides utilities for serving raw MDX/MD content to LLMs and
 * other tools that need access to source content without HTML rendering.
 *
 * Usage:
 *   - /essays/musings/boy-interrupted.md    -> Raw MDX content
 *   - /essays/musings/boy-interrupted.mdx   -> Raw MDX content
 *   - /blog/philosophy/faith.md             -> Raw MDX content
 *
 * Supported content types:
 *   essays, blog, fiction, news, notes, ocs, papers, progymnasmata, reviews, verse
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * IMPORTS
 * ----------------------------------------------------------------------------- */

import { promises as fs } from 'fs'
import path from 'path'

/* -----------------------------------------------------------------------------
 * TYPES
 * ----------------------------------------------------------------------------- */

/**
 * Result returned from getRawMDXContent
 */
export interface RawContentResult {
  content: string | null
  error: string | null
  contentType: string
}

/**
 * Configuration for a content type's file location
 */
interface ContentPathConfig {
  basePath: string
  hasCategory: boolean
}

/* -----------------------------------------------------------------------------
 * CONTENT PATH CONFIGURATION
 * -----------------------------------------------------------------------------
 * Maps content types to their MDX file locations within the app directory.
 * All content types follow the pattern: app/(content)/[type]/content/[category]/[slug].mdx
 * ----------------------------------------------------------------------------- */

export const CONTENT_PATHS: Record<string, ContentPathConfig> = {
  // Long-form essays
  essays: {
    basePath: 'app/(content)/essays/content',
    hasCategory: true,
  },

  // Blog posts
  blog: {
    basePath: 'app/(content)/blog/content',
    hasCategory: true,
  },

  // Fiction (short stories, flash fiction)
  fiction: {
    basePath: 'app/(content)/fiction/content',
    hasCategory: true,
  },

  // News/announcements
  news: {
    basePath: 'app/(content)/news/content',
    hasCategory: true,
  },

  // Notes and shorter pieces
  notes: {
    basePath: 'app/(content)/notes/content',
    hasCategory: true,
  },

  // Original characters
  ocs: {
    basePath: 'app/(content)/ocs/content',
    hasCategory: true,
  },

  // Academic papers
  papers: {
    basePath: 'app/(content)/papers/content',
    hasCategory: true,
  },

  // Progymnasmata exercises
  progymnasmata: {
    basePath: 'app/(content)/progymnasmata/content',
    hasCategory: true,
  },

  // Reviews (books, films, anime, etc.)
  reviews: {
    basePath: 'app/(content)/reviews/content',
    hasCategory: true,
  },

  // Poetry/verse
  verse: {
    basePath: 'app/(content)/verse/content',
    hasCategory: true,
  },
}

/* -----------------------------------------------------------------------------
 * CORE FUNCTIONS
 * ----------------------------------------------------------------------------- */

/**
 * Reads raw MDX content from the filesystem
 *
 * @param contentType - The type of content (essays, blog, notes, etc.)
 * @param slug - The slug/filename of the content (without extension)
 * @param category - The category folder containing the content
 * @returns The raw MDX content or an error message
 *
 * @example
 * const result = await getRawMDXContent('essays', 'boy-interrupted', 'musings')
 * if (result.content) {
 *   // Use the raw MDX content
 * }
 */
export async function getRawMDXContent(
  contentType: string,
  slug: string,
  category?: string
): Promise<RawContentResult> {
  // Get configuration for this content type
  const config = CONTENT_PATHS[contentType]

  if (!config) {
    return {
      content: null,
      error: `Unknown content type: ${contentType}. Supported types: ${Object.keys(CONTENT_PATHS).join(', ')}`,
      contentType: 'text/plain',
    }
  }

  // Build the file path
  let filePath: string
  if (config.hasCategory && category) {
    filePath = path.join(process.cwd(), config.basePath, category, `${slug}.mdx`)
  } else {
    filePath = path.join(process.cwd(), config.basePath, `${slug}.mdx`)
  }

  // Try to read the .mdx file
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return {
      content,
      error: null,
      contentType: 'text/markdown; charset=utf-8',
    }
  } catch {
    // Fallback: try .md extension
    const mdPath = filePath.replace(/\.mdx$/, '.md')
    try {
      const content = await fs.readFile(mdPath, 'utf-8')
      return {
        content,
        error: null,
        contentType: 'text/markdown; charset=utf-8',
      }
    } catch {
      return {
        content: null,
        error: `Content not found: ${contentType}/${category ? category + '/' : ''}${slug}`,
        contentType: 'text/plain',
      }
    }
  }
}

/* -----------------------------------------------------------------------------
 * URL PARSING UTILITIES
 * -----------------------------------------------------------------------------
 * These are duplicated here for use outside of middleware (which has edge
 * runtime restrictions). The middleware has its own inlined versions.
 * ----------------------------------------------------------------------------- */

/**
 * Parses a URL path to extract content type, category, and slug
 *
 * @param pathname - The URL pathname (e.g., /essays/musings/boy-interrupted.md)
 * @returns Parsed path components or null if not a raw content request
 *
 * @example
 * const parsed = parseRawContentPath('/essays/musings/boy-interrupted.md')
 * // { contentType: 'essays', category: 'musings', slug: 'boy-interrupted', extension: 'md' }
 */
export function parseRawContentPath(pathname: string): {
  contentType: string
  category: string | undefined
  slug: string
  extension: 'md' | 'mdx'
} | null {
  // Match paths like /essays/musings/boy-interrupted.md
  const match = pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\.(md|mdx)$/)

  if (match) {
    const [, contentType, category, slug, extension] = match
    return {
      contentType,
      category,
      slug,
      extension: extension as 'md' | 'mdx',
    }
  }

  // Also try without category (for flat content structures)
  const flatMatch = pathname.match(/^\/([^/]+)\/([^/]+)\.(md|mdx)$/)
  if (flatMatch) {
    const [, contentType, slug, extension] = flatMatch
    return {
      contentType,
      category: undefined,
      slug,
      extension: extension as 'md' | 'mdx',
    }
  }

  return null
}

/**
 * Checks if a request path is requesting raw content
 *
 * @param pathname - The URL pathname
 * @returns true if the path ends with .md or .mdx
 */
export function isRawContentRequest(pathname: string): boolean {
  return /\.(md|mdx)$/.test(pathname)
}

/**
 * Gets list of supported content types
 *
 * @returns Array of supported content type names
 */
export function getSupportedContentTypes(): string[] {
  return Object.keys(CONTENT_PATHS)
}
