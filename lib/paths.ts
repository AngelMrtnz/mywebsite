// The site is served from /mywebsite on GitHub Pages (set in .env.production).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefixes a file in /public with the base path. External URLs are returned as-is. */
export function asset(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${BASE_PATH}${path}`;
}
