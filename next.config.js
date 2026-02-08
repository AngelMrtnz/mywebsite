/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set basePath for GitHub Pages (project repo)
  basePath: process.env.GITHUB_PAGES === 'true' ? '/mywebsite' : '',
  // Optimize for static generation
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
