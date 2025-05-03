/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add your webpack customizations here if needed
    return config
  },
  // Other Next.js config options
  experimental: {
    serverActions: true,
  },
  env: {
    // Add your environment variables here if needed
  }
}

export default nextConfig
