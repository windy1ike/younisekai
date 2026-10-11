import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { excerpt, formatDate, postUrl, sortByDate, toISODate, toPlainText, visiblePosts } from '../utils/post';

/**
 * 搜索索引：构建时生成 /search.json，前端搜索页按需拉取。
 * 不依赖任何第三方搜索服务，纯静态也能搜。
 */
export const GET: APIRoute = async () => {
  const posts = sortByDate(visiblePosts(await getCollection('posts')));

  const payload = posts.map((post) => ({
    title: post.data.title,
    url: postUrl(post),
    date: toISODate(post.data.pubDate),
    dateLabel: formatDate(post.data.pubDate),
    tags: post.data.tags,
    excerpt: excerpt(post, 160),
    // 只索引前 6000 字，索引文件不会太大
    text: toPlainText(post.body).slice(0, 6000),
  }));

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
