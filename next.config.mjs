// next.config.mjs
import withMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/* ─── Consolidated Next.js configuration ───────────────────── */
const baseConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  staticPageGenerationTimeout: 120,
  productionBrowserSourceMaps: false,

  /* ─── Redirects (URL changes, browser-visible) ───────────── */
  async redirects() {
    return [
      {
        source: '/music',
        destination: 'https://www.last.fm/user/krisyotam',
        permanent: true,
      },
    ]
  },

  /* ─── Rewrites (vanity URLs, internal routing only) ─────────
     These map public-facing paths to internal App Router MDX
     locations without changing the browser URL.
     Edit `destination` values freely.
  ─────────────────────────────────────────────────────────── */
  async rewrites() {
    return [
      /* on-myself */
      {
        source: '/me',
        destination: '/notes/on-myself/about-kris',
      },
      {
        source: '/logo',
        destination: '/notes/on-myself/about-my-logo',
      },

      /* website */
      {
        source: '/about',
        destination: '/notes/website/about-this-website',
      },
      {
        source: '/design',
        destination: '/notes/website/design-of-this-website',
      },
      {
        source: '/donate',
        destination: '/notes/website/donate',
      },
      {
        source: '/faq',
        destination: '/notes/website/faq',
      },
    ]
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/v1/**' },
    ],
    domains: ['api.qrserver.com', 'i.postimg.cc', 'gateway.pinata.cloud'],
  },

  experimental: {
    webpackBuildWorker: true,
  },

  output: 'standalone',
  transpilePackages: ['react-syntax-highlighter'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/image$': 'next/future/image',
    }

    config.module.rules.push({ test: /\.mdx\?raw$/, type: 'asset/source' })

    config.externals = [...(config.externals || []), { canvas: 'canvas' }]

    return config
  },

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

/* ─── MDX wrapper (GFM Tables + Math + KaTeX) ──────────────── */
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
