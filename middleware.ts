/* =============================================================================
 * MIDDLEWARE - krisyotam.com
 * =============================================================================
 * Central middleware for handling cross-cutting concerns like headers,
 * rewrites, and content serving.
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * IMPORTS
 * ----------------------------------------------------------------------------- */

// Next.js core
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Site utilities
import { getTodaysClacks } from "./lib/memoriam" // Memorial header utility

/* -----------------------------------------------------------------------------
 * RAW CONTENT SERVING - Helper Functions
 * -----------------------------------------------------------------------------
 * These functions handle requests for raw MDX/MD content, allowing LLMs and
 * other tools to fetch content in its source format.
 *
 * Supported URL patterns:
 *   - /essays/musings/boy-interrupted.md
 *   - /essays/musings/boy-interrupted.mdx
 *   - /blog/philosophy/faith-in-uncertainty.md
 *   - etc.
 * ----------------------------------------------------------------------------- */

// Content types that support raw content serving
const RAW_CONTENT_TYPES = [
  'essays',
  'blog',
  'fiction',
  'news',
  'notes',
  'ocs',
  'papers',
  'progymnasmata',
  'reviews',
  'verse',
] as const

type RawContentType = typeof RAW_CONTENT_TYPES[number]

// Vanity URL mappings (short URLs that map to actual content paths)
// Format: '/vanity-url' -> { contentType, category, slug }
const VANITY_URL_MAPPINGS: Record<string, { contentType: RawContentType; category: string; slug: string }> = {
  '/me':     { contentType: 'notes', category: 'on-myself', slug: 'about-kris' },
  '/logo':   { contentType: 'notes', category: 'on-myself', slug: 'about-my-logo' },
  '/about':  { contentType: 'notes', category: 'website', slug: 'about-this-website' },
  '/design': { contentType: 'notes', category: 'website', slug: 'design-of-this-website' },
  '/donate': { contentType: 'notes', category: 'website', slug: 'donate' },
  '/faq':    { contentType: 'notes', category: 'website', slug: 'faq' },
}

/**
 * Checks if a pathname requests raw content (ends with .md or .mdx)
 */
function isRawContentRequest(pathname: string): boolean {
  return /\.(md|mdx)$/.test(pathname)
}

/**
 * Parses a vanity URL into its content path components
 * Example: /me.md -> { contentType: 'notes', category: 'on-myself', slug: 'about-kris' }
 */
function parseVanityUrl(pathname: string): {
  contentType: RawContentType
  category: string
  slug: string
} | null {
  // Remove .md or .mdx extension to get the base vanity path
  const basePath = pathname.replace(/\.(md|mdx)$/, '')

  const mapping = VANITY_URL_MAPPINGS[basePath]
  return mapping || null
}

/**
 * Parses a raw content URL path into its components
 * Example: /essays/musings/boy-interrupted.md -> { contentType: 'essays', category: 'musings', slug: 'boy-interrupted' }
 */
function parseRawContentPath(pathname: string): {
  contentType: RawContentType
  category: string
  slug: string
} | null {
  // Match paths like /essays/musings/boy-interrupted.md or .mdx
  const match = pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\.(md|mdx)$/)

  if (!match) return null

  const [, contentType, category, slug] = match

  // Validate content type
  if (!RAW_CONTENT_TYPES.includes(contentType as RawContentType)) {
    return null
  }

  return {
    contentType: contentType as RawContentType,
    category,
    slug,
  }
}

/* -----------------------------------------------------------------------------
 * MIDDLEWARE FUNCTION
 * ----------------------------------------------------------------------------- */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  /* ---------------------------------------------------------------------------
   * RAW CONTENT HANDLING
   * ---------------------------------------------------------------------------
   * Intercept requests for .md/.mdx files and rewrite to API route
   * Supports both full paths (/essays/musings/slug.md) and vanity URLs (/me.md)
   * ------------------------------------------------------------------------- */
  if (isRawContentRequest(pathname)) {
    // First, try to parse as a vanity URL (e.g., /me.md)
    const vanityParsed = parseVanityUrl(pathname)
    if (vanityParsed) {
      const url = request.nextUrl.clone()
      url.pathname = `/api/raw/${vanityParsed.contentType}/${vanityParsed.category}/${vanityParsed.slug}`
      return NextResponse.rewrite(url)
    }

    // Otherwise, try to parse as a full content path (e.g., /essays/musings/slug.md)
    const parsed = parseRawContentPath(pathname)
    if (parsed) {
      const url = request.nextUrl.clone()
      url.pathname = `/api/raw/${parsed.contentType}/${parsed.category}/${parsed.slug}`
      return NextResponse.rewrite(url)
    }
  }

  /* ---------------------------------------------------------------------------
   * DEFAULT RESPONSE WITH HEADERS
   * ------------------------------------------------------------------------- */
  const response = NextResponse.next()

  /* ---------------------------------------------------------------------------
   * X-CLACKS-OVERHEAD HEADER
   * ---------------------------------------------------------------------------
   * GNU Terry Pratchett - Memorial header for those who have passed
   * See: http://www.gnuterrypratchett.com/
   * ------------------------------------------------------------------------- */
  const name = getTodaysClacks()
  if (name) {
    response.headers.set("X-Clacks-Overhead", name)
  }

  return response
}

/* -----------------------------------------------------------------------------
 * MIDDLEWARE CONFIG
 * -----------------------------------------------------------------------------
 * Define which routes the middleware should run on
 * ----------------------------------------------------------------------------- */

export const config = {
  matcher: [
    // Match all routes except API and Next.js internals
    // The middleware code handles filtering for .md/.mdx vs other extensions
    "/((?!api|_next|_static|_vercel).*)",
  ],
}
