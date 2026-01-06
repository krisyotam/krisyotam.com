/**
 * =============================================================================
 * Dynamic OG Image Generator
 * =============================================================================
 *
 * Generates dynamic Open Graph images for social sharing.
 * Uses @vercel/og for edge-optimized image generation.
 *
 * Usage: /og?title=Your+Title&type=essays
 *
 * Author: Kris Yotam
 * =============================================================================
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Kris Yotam'
  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''

  // Color schemes for different content types
  const colorSchemes: Record<string, { bg: string; accent: string }> = {
    essays: { bg: '#1a1a2e', accent: '#e94560' },
    blog: { bg: '#16213e', accent: '#0f3460' },
    papers: { bg: '#1b262c', accent: '#0f4c75' },
    fiction: { bg: '#2d132c', accent: '#801336' },
    verse: { bg: '#1a1a1d', accent: '#6b5b95' },
    notes: { bg: '#222831', accent: '#00adb5' },
    reviews: { bg: '#2c3333', accent: '#a27b5c' },
    news: { bg: '#1e1e2f', accent: '#d63031' },
    default: { bg: '#0c0c0c', accent: '#666666' },
  }

  const scheme = colorSchemes[type] || colorSchemes.default

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: scheme.bg,
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top section with type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {type && (
            <div
              style={{
                backgroundColor: scheme.accent,
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '4px',
                fontSize: '20px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {type}
            </div>
          )}
          {category && (
            <div
              style={{
                color: '#888888',
                fontSize: '20px',
                fontWeight: 400,
              }}
            >
              / {category}
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? '48px' : title.length > 30 ? '64px' : '80px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: '-2px',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer with branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Logo circle */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: scheme.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              K
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                Kris Yotam
              </span>
              <span
                style={{
                  color: '#888888',
                  fontSize: '16px',
                }}
              >
                krisyotam.com
              </span>
            </div>
          </div>

          {/* Decorative element */}
          <div
            style={{
              width: '100px',
              height: '4px',
              backgroundColor: scheme.accent,
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
