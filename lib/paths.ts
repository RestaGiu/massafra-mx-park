export const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

export function withBasePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function withoutBasePath(path: string) {
  if (!basePath || !path.startsWith(`${basePath}/`)) return path;
  return path.slice(basePath.length) || "/";
}
