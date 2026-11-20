/** @type {import('next').NextConfig} */
module.exports = {
  // Served from https://angelmrtnz.github.io/mywebsite (see .env.production)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Plain HTML files for GitHub Pages
  output: 'export',
  images: { unoptimized: true },
};
