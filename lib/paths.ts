// lib/paths.ts
// Public path prefix that's known at build time
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const getPublicPath = (path: string) => {
  return `${BASE_PATH}${path}`;
};
