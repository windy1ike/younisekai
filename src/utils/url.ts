/**
 * 站点部署在子路径时（例如 GitHub Pages 的项目站点 /blog/），
 * 所有绝对路径都要带上 base 前缀，否则链接和静态资源会 404。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
