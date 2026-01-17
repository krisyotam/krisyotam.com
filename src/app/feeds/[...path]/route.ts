/**
 * =============================================================================
 * Dynamic Feed Route Handler
 * =============================================================================
 *
 * Handles all feed requests for RSS, Atom, and JSON Feed formats.
 *
 * URL Patterns:
 *   Full feeds:
 *     /feeds/rss.xml     → RSS 2.0
 *     /feeds/atom.xml    → Atom 1.0
 *     /feeds/feed.json   → JSON Feed 1.1
 *
 *   Scoped feeds (per content type):
 *     /feeds/essays/rss.xml     → Essays RSS
 *     /feeds/essays/atom.xml    → Essays Atom
 *     /feeds/essays/feed.json   → Essays JSON
 *     /feeds/blog/rss.xml       → Blog RSS
 *     /feeds/papers/rss.xml     → Papers RSS
 *     etc.
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { NextResponse } from 'next/server'
import {
  getFeedItems,
  generateRss,
  generateAtom,
  generateJsonFeed,
  isValidContentType,
  contentTypes,
  type FeedFormat,
} from '@/lib/feeds'
import type { ContentType } from '@/lib/seo'

interface RouteParams {
  params: Promise<{ path: string[] }>
}

function parsePathSegments(segments: string[]): {
  format: FeedFormat | null
  scope: ContentType | null
  error: string | null
} {
  if (segments.length === 0) {
    return { format: null, scope: null, error: 'No path provided' }
  }

  // Single segment: /feeds/rss.xml, /feeds/atom.xml, /feeds/feed.json
  if (segments.length === 1) {
    const file = segments[0]

    if (file === 'rss.xml') {
      return { format: 'rss', scope: null, error: null }
    }
    if (file === 'atom.xml') {
      return { format: 'atom', scope: null, error: null }
    }
    if (file === 'feed.json') {
      return { format: 'json', scope: null, error: null }
    }

    // Check if it's a shorthand like /feeds/essays.xml
    if (file.endsWith('.xml')) {
      const type = file.replace('.xml', '')
      if (isValidContentType(type)) {
        return { format: 'rss', scope: type, error: null }
      }
    }
    if (file.endsWith('.json')) {
      const type = file.replace('.json', '')
      if (isValidContentType(type)) {
        return { format: 'json', scope: type, error: null }
      }
    }

    return { format: null, scope: null, error: `Unknown feed: ${file}` }
  }

  // Two segments: /feeds/essays/rss.xml, /feeds/blog/atom.xml, etc.
  if (segments.length === 2) {
    const [type, file] = segments

    if (!isValidContentType(type)) {
      return { format: null, scope: null, error: `Unknown content type: ${type}` }
    }

    if (file === 'rss.xml') {
      return { format: 'rss', scope: type, error: null }
    }
    if (file === 'atom.xml') {
      return { format: 'atom', scope: type, error: null }
    }
    if (file === 'feed.json') {
      return { format: 'json', scope: type, error: null }
    }

    return { format: null, scope: null, error: `Unknown feed format: ${file}` }
  }

  return { format: null, scope: null, error: 'Invalid path' }
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { path } = await params
  const { format, scope, error } = parsePathSegments(path)

  if (error || !format) {
    return new NextResponse(
      JSON.stringify({
        error: error || 'Invalid feed request',
        available: {
          full: ['/feeds/rss.xml', '/feeds/atom.xml', '/feeds/feed.json'],
          scoped: [
            '/feeds/{type}/rss.xml',
            '/feeds/{type}/atom.xml',
            '/feeds/{type}/feed.json',
            '/feeds/{type}.xml (shorthand for RSS)',
            '/feeds/{type}.json (shorthand for JSON)',
          ],
          types: contentTypes,
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const items = getFeedItems(scope ?? undefined)

  const cacheHeaders = {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  }

  switch (format) {
    case 'rss': {
      const rss = generateRss(items, scope ?? undefined)
      return new NextResponse(rss, {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          ...cacheHeaders,
        },
      })
    }

    case 'atom': {
      const atom = generateAtom(items, scope ?? undefined)
      return new NextResponse(atom, {
        headers: {
          'Content-Type': 'application/atom+xml; charset=utf-8',
          ...cacheHeaders,
        },
      })
    }

    case 'json': {
      const json = generateJsonFeed(items, scope ?? undefined)
      return new NextResponse(json, {
        headers: {
          'Content-Type': 'application/feed+json; charset=utf-8',
          ...cacheHeaders,
        },
      })
    }
  }
}
