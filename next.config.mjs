// nextconfig.mjs

import withMDX from '@next/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

let userConfig;
try {
  userConfig = await import('./v0-user-next.config');
} catch {
  // ignore if not present
}

/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  transpilePackages: ['react-syntax-highlighter'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Alias next/image → next/future/image globally
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/image$': 'next/future/image',
    };

    // Add support for raw MDX imports
    config.module.rules.push({
      test: /\.mdx\?raw$/,
      type: 'asset/source',
    });

    return config;
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
        ],
      },
    ];
  },
};

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

let nextConfig = mdxConfig(baseConfig);

if (userConfig) {
  const uc = userConfig.default || userConfig;
  for (const key in uc) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = { ...nextConfig[key], ...uc[key] };
    } else {
      nextConfig[key] = uc[key];
    }
  }
}

export default nextConfig;