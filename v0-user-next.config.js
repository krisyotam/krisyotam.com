/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    mdxRs: true,
  },
  // Add Vercel-specific optimizations
  output: "standalone",
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]
    return config
  },
  images: {
    domains: [
      'api.qrserver.com', 
      'i.postimg.cc', 
      'gateway.pinata.cloud'
    ],
  },
}

module.exports = nextConfig

