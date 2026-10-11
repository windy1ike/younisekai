import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章集合：src/content/posts/ 下的所有 .md 文件。
 * 下面的 schema 会在构建时校验每篇文章的 frontmatter，
 * 写错了会直接报错并告诉你哪个文件、哪个字段有问题。
 */
const posts = defineCollection({
  loader: glob({ pattern: ['**/*.md'], base: './src/content/posts' }),
  schema: z.object({
    /** 标题 */
    title: z.string().max(120),
    /** 摘要，列表页和搜索结果里显示；不写会自动从正文截取 */
    description: z.string().max(300).optional(),
    /** 发布日期，格式 YYYY-MM-DD */
    pubDate: z.coerce.date(),
    /** 最后修改日期，可选 */
    updatedDate: z.coerce.date().optional(),
    /** 标签，例如 ['随笔', '读书'] */
    tags: z.array(z.string()).default([]),
    /** 草稿：true 时不会出现在任何页面和 RSS 里 */
    draft: z.boolean().default(false),
  }),
});

/**
 * 单页内容：src/content/pages/ 下的 .md，用于「关于」等固定页面。
 * 想改「关于」页内容，直接编辑 src/content/pages/about.md 即可。
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { posts, pages };
