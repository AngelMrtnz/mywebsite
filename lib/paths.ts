// lib/paths.ts
export const getBasePath = () => {
  if (typeof window !== 'undefined') {
    // Client-side: get from window location or next router
    return '/mywebsite';
  }
  return '/mywebsite';
};

export const getPublicPath = (path: string) => {
  return `${getBasePath()}${path}`;
};
