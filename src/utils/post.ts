import type { CollectionEntry } from 'astro:content';
import { withBase } from './url';

export type Post = CollectionEntry<'posts'>;

/** 中文习惯的日期格式：2025年4月1日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** 归档用的短日期：04-01 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

/** 机器可读日期，用于 <time datetime> 和 RSS */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 文章链接 */
export function postUrl(post: Post): string {
  return withBase(`/posts/${post.id}/`);
}

/** 标签页链接 */
export function tagUrl(tag: string): string {
  return withBase(`/tags/${encodeURIComponent(tag)}/`);
}

/** 去掉 Markdown 语法，得到纯文本，用于摘要、搜索和阅读时长 */
export function toPlainText(markdown = ''): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')           // 代码块
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')                // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')     // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')   // 链接保留文字
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')        // 标题符号
    .replace(/^\s{0,3}>\s?/gm, '')             // 引用
    .replace(/^\s*[-*+]\s+/gm, '')             // 无序列表
    .replace(/^\s*\d+\.\s+/gm, '')             // 有序列表
    .replace(/[*_~]{1,3}/g, '')                // 强调符号
    .replace(/^\s*\|.*\|\s*$/gm, ' ')          // 表格
    .replace(/<[^>]+>/g, ' ')                  // HTML 标签
    .replace(/\s+/g, ' ')
    .trim();
}

/** 摘要：优先用 frontmatter 的 description，否则从正文截取 */
export function excerpt(post: Post, maxLength = 120): string {
  const source = post.data.description?.trim() || toPlainText(post.body);
  if (source.length <= maxLength) return source;
  return `${source.slice(0, maxLength).trimEnd()}…`;
}

/** 按发布日期倒序 */
export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 是否要带上草稿：开发时带，正式构建不带（设 BUILD_DRAFTS=1 可强制带上） */
export function includeDrafts(): boolean {
  return import.meta.env.DEV || process.env.BUILD_DRAFTS === '1';
}

/** 取可见文章：开发时含草稿，正式构建排除草稿 */
export function visiblePosts(posts: Post[]): Post[] {
  return includeDrafts() ? posts : posts.filter((post) => !post.data.draft);
}

/** 已发布的文章：草稿一律排除（RSS 这类对外产物用它） */
export function publishedPosts(posts: Post[]): Post[] {
  return posts.filter((post) => !post.data.draft);
}

/** 统计所有标签及出现次数，按次数倒序 */
export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

/** 上一篇 / 下一篇（按时间倒序的列表里，前一个是更新的） */
export function neighbors(posts: Post[], current: Post) {
  const index = posts.findIndex((post) => post.id === current.id);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}
