// lib/paths.ts
import { useRouter } from 'next/navigation';

export const getPublicPath = (path: string) => {
  // In development: just use the path as-is
  // In production on GitHub Pages: basePath is automatically handled by Next.js
  // However, for client-side fetch, we need to add it manually
  if (typeof window !== 'undefined') {
    // Check if we're on GitHub Pages (contains 'angelmrtnz.github.io')
    if (window.location.hostname.includes('github.io')) {
      return `/mywebsite${path}`;
    }
  }
  return path;
};
