// next.config.mjs

import withMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/* ============================================================================
   CORE NEXT.JS CONFIG
   Focus: clean routing, stable builds, MDX support, archive passthrough
============================================================================ */

const baseConfig = {
  reactStrictMode: true,

  // Next.js 16+ uses Turbopack by default (handles minification automatically)
  typescript: { ignoreBuildErrors: false },

  // Strip console.log/warn/info/debug in production, keep console.error for diagnostics
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: false,

  // Turbopack disabled - MDX not fully supported yet

  /* ============================================================================
     REWRITES
     Maps URLs to internal destinations without changing the browser location.
     Also proxies /doc/* to Hetzner object storage.
  ============================================================================ */
  async rewrites() {
    return [
      // --- vanity URLs to MDX content ---
      { source: '/me',     destination: '/notes/on-myself/about-kris' },
      { source: '/logo',   destination: '/notes/on-myself/about-my-logo' },

      { source: '/about',  destination: '/notes/website/about-this-website' },
      { source: '/design', destination: '/notes/website/design-of-this-website' },
      { source: '/donate', destination: '/notes/website/donate' },
      { source: '/faq',    destination: '/notes/website/faq' },

      // --- short URLs ---
      { source: '/roti',   destination: '/rules-of-the-internet' },

      // --- feed URLs ---
      { source: '/rss.xml',  destination: '/feeds/rss.xml' },
      { source: '/atom.xml', destination: '/feeds/atom.xml' },
      { source: '/feed.json', destination: '/feeds/feed.json' },

      // --- /doc, /src, /archive ---
      // Handled by nginx directory listing (local files on server)
    ]
  },


  /* ==========================================================================
     REDIRECTS
     Permanent redirects for external destinations (301). Keep separate from
     rewrites so browser URL updates to the destination host.
  ========================================================================== */
  async redirects() {
    return [
      {
        source: '/clippings',
        destination: 'https://fabric.so/p/clippings-5Rgtx9QgJW1kq0zfOvujaw',
        permanent: true,
      },
    ]
  },

  /* ============================================================================
     IMAGE HANDLING
     Optimized images with WebP/AVIF conversion, long cache TTL.
     All external image domains whitelisted via remotePatterns.
  ============================================================================ */
  images: {
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // QR code generation
      { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/**' },
      // Image hosting services
      { protocol: 'https', hostname: 'i.postimg.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pinimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud', pathname: '/**' },
      // Search engine image proxies
      { protocol: 'https', hostname: 'external-content.duckduckgo.com', pathname: '/**' },
      { protocol: 'https', hostname: 'imgs.search.brave.com', pathname: '/**' },
      { protocol: 'https', hostname: 'kagi.com', pathname: '/proxy/**' },
      // Content platforms
      { protocol: 'https', hostname: 'substackcdn.com', pathname: '/**' },
      // YouTube thumbnails
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      // Unsplash images
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Book covers (Open Library)
      { protocol: 'https', hostname: 'covers.openlibrary.org', pathname: '/**' },
      // Spotify album art
      { protocol: 'https', hostname: 'i.scdn.co', pathname: '/**' },
      // External sites with images
      { protocol: 'https', hostname: 'tezukaosamu.net', pathname: '/**' },
      { protocol: 'https', hostname: 'understandingslavery.com', pathname: '/**' },
      // Wikipedia images
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      // Recipe images
      { protocol: 'https', hostname: 'cookingwithcassandra.com', pathname: '/**' },
      // Own domain (doc storage)
      { protocol: 'https', hostname: 'krisyotam.com', pathname: '/doc/**' },
      { protocol: 'https', hostname: 'www.krisyotam.com', pathname: '/doc/**' },
    ],
  },

  /* ============================================================================
     BUILD OUTPUT
     Standalone output for portability.
  ============================================================================ */
  output: 'standalone',
  transpilePackages: ['react-syntax-highlighter'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  /* ============================================================================
     OUTPUT FILE TRACING
     Include MDX content files in standalone build for API routes that read them.
  ============================================================================ */
  outputFileTracingIncludes: {
    '/api/verse/content': ['./src/app/(content)/verse/content/**/*.mdx'],
  },

  /* ============================================================================
     WEBPACK EXTENSIONS
     MDX raw import support + canvas externalization + frontmatter stripping
  ============================================================================ */
  webpack(config) {
    // Raw MDX import support
    config.module.rules.push({
      test: /\.mdx\?raw$/,
      type: 'asset/source',
    })

    config.externals = [...(config.externals || []), { canvas: 'canvas' }]

    return config
  },

  /* ============================================================================
     SECURITY HEADERS
     Frame protection + basic CSP
     Allows iframing only from own domains (for TOC preview, etc.)
  ============================================================================ */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://krisyotam.com https://*.krisyotam.com https://kyotam.com https://*.kyotam.com https://krisyotam.net https://*.krisyotam.net;"
          },
        ],
      },
    ]
  },
}

/* ============================================================================
   MDX PIPELINE
   GitHub-flavored markdown + math + KaTeX rendering
============================================================================ */
const nextConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkGfm, { strict: true, singleTilde: false }],
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex],
  },
})(baseConfig)

export default nextConfig
