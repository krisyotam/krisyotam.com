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

  // keep builds stable on low memory hosts
  swcMinify: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: false,

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

      // next.config.js

      {
        source: '/doc/:path*.:ext',
        destination: 'https://hel1.your-objectstorage.com/doc/:path*.:ext',
      },
      {
        source: '/src/:path*.:ext',
        destination: 'https://hel1.your-objectstorage.com/src/:path*.:ext',
      },
      {
        source: '/archive/:path*.:ext',
        destination: 'https://hel1.your-objectstorage.com/public-archive/:path*.:ext',
      },
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
     Local image optimization disabled to avoid memory cost.
     External domains allowed for embeds & QR generator.
  ============================================================================ */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/v1/**' },
    ],
    domains: ['api.qrserver.com', 'i.postimg.cc', 'gateway.pinata.cloud'],
  },

  /* ============================================================================
     EXPERIMENTAL + BUILD
     Disables worker threads for Webpack for tiny hosts.
     Standalone output for portability.
  ============================================================================ */
  experimental: {
    webpackBuildWorker: false,
  },

  output: 'standalone',
  transpilePackages: ['react-syntax-highlighter'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  /* ============================================================================
     WEBPACK EXTENSIONS
     MDX raw import support + canvas externalization
  ============================================================================ */
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/image$': 'next/future/image',
    }

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
  ============================================================================ */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
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
