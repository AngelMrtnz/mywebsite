/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set basePath from environment variable
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Optimize for static generation
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
