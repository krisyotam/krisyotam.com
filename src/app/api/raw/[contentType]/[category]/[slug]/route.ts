/* =============================================================================
 * RAW CONTENT API ROUTE
 * =============================================================================
 * Serves raw MDX/MD content for LLMs and other tools.
 *
 * Endpoint: GET /api/raw/[contentType]/[category]/[slug]
 *
 * Examples:
 *   GET /api/raw/essays/musings/boy-interrupted
 *   GET /api/raw/blog/philosophy/faith-in-uncertainty
 *   GET /api/raw/verse/haiku/afternoon-retreat
 *
 * Response:
 *   - 200: Raw MDX content with Content-Type: text/markdown
 *   - 404: Content not found
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * IMPORTS
 * ----------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from 'next/server'
import { getRawMDXContent, CONTENT_PATHS } from '@/components/core/serve-raw'

/* -----------------------------------------------------------------------------
 * ROUTE HANDLER
 * ----------------------------------------------------------------------------- */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentType: string; category: string; slug: string }> }
) {
  const { contentType, category, slug } = await params

  // Validate content type
  if (!CONTENT_PATHS[contentType]) {
    return new NextResponse(
      `Unknown content type: ${contentType}\n\nSupported types: ${Object.keys(CONTENT_PATHS).join(', ')}`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    )
  }

  // Fetch raw content
  const result = await getRawMDXContent(contentType, slug, category)

  // Handle errors
  if (result.error) {
    return new NextResponse(result.error, {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  // Return raw content
  return new NextResponse(result.content, {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
