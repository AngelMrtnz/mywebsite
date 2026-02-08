// lib/paths.ts
export const getPublicPath = (path: string) => {
  // Get the base path from environment or detect from current location
  if (typeof window !== 'undefined') {
    // On GitHub Pages: add the /mywebsite prefix
    if (window.location.pathname.includes('/mywebsite')) {
      return `/mywebsite${path}`;
    }
  }
  // In development or on other hosts: use path as-is
  return path;
};
