const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const withBase = (path: string) => {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
};
