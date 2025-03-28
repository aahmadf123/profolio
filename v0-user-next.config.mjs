/** @type {import('next').NextConfig} */
const nextConfig = {
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
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
  },
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: false,
}

// Merge with user config if it exists
try {
  const userConfig = await import('./v0-user-next.config.mjs')
  if (userConfig.default) {
    Object.assign(nextConfig, userConfig.default)
  }
} catch (e) {
  // ignore error if user config doesn't exist
}

export default nextConfig

