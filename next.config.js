/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable static optimization for all pages
  staticPageGenerationTimeout: 120,
  // Increase the build timeout
  buildTimeout: 300000,
  // Enable webpack build worker
  experimental: {
    webpackBuildWorker: true,
  },
}

module.exports = nextConfig 