// next.config.mjs
import withMDX from '@next/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/* ─── Consolidated Next.js configuration ───────────────────── */
const baseConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Ensure build-time error reporting is enabled
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // Static optimization and timeouts
  staticPageGenerationTimeout: 120,

  // Don't generate source maps in production
  productionBrowserSourceMaps: false,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com', pathname: '/v1/**' },
    ],
    domains: ['api.qrserver.com', 'i.postimg.cc', 'gateway.pinata.cloud'],
  },

  experimental: {
    // Disable unused experimental flags:
    // serverActions: true,
    // mdxRs: true,
    
    // Keep only build performance improvements:
    webpackBuildWorker: true,
  },

  output: 'standalone',
  transpilePackages: ['react-syntax-highlighter'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  webpack(config) {
    /* Alias next/image → next/future/image */
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/image$': 'next/future/image',
    };

    /* Raw‑MDX imports ( `import content from "./foo.mdx?raw"` ) */
    config.module.rules.push({ test: /\.mdx\?raw$/, type: 'asset/source' });

    /* External native module */
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];

    return config;
  },

  /* Simple security headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

/* ─── MDX wrapper (Math + KaTeX) ───────────────────────────── */
const nextConfig = withMDX({
  extension: /\.mdx?$/,
  options: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
})(baseConfig);

export default nextConfig;
