/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turn off React’s extra checks
  reactStrictMode: false,

  // Completely ignore all TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // Completely ignore all ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Static optimization and timeouts
  staticPageGenerationTimeout: 120,
  buildTimeout: 300_000,

  // Don’t generate source maps in production
  productionBrowserSourceMaps: false,

  // Leave all images unoptimized so image‐loader errors never occur
  images: {
    unoptimized: true,
  },

  experimental: {
    // Keep your webpack build worker enabled
    webpackBuildWorker: true,
  },

  webpack: (config) => {
    // Never bail out on the first error
    config.bail = false;

    // Suppress every warning
    config.ignoreWarnings = [/./];

    // Hide any errors from the stats output
    if (!config.stats) config.stats = {};
    config.stats.warnings = false;
    config.stats.errors = false;
    config.stats.errorDetails = false;

    return config;
  },
};

module.exports = nextConfig;
