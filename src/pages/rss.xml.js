import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { excerpt, postUrl, publishedPosts, sortByDate } from '../utils/post';

export async function GET(context) {
  // 注意：RSS 是对外产物，草稿一律不含（哪怕本地 dev 也不带）
  const posts = sortByDate(publishedPosts(await getCollection('posts')));

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    trailingSlash: true,
    customData: '<language>zh-cn</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: excerpt(post, 200),
      link: postUrl(post),
      categories: post.data.tags,
    })),
  });
}
