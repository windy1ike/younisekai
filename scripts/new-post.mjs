#!/usr/bin/env node
/**
 * 新建一篇文章的脚手架。
 *
 * 用法：
 *   npm run new -- "文章标题"
 *   npm run new -- "读书笔记" --tags 读书,随笔
 *   npm run new -- "长文系列第一节" --dir notes      # 放到 src/content/posts/notes/ 下
 *   npm run new -- "已经写完的文章" --publish        # 直接写成非草稿
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(root, 'src/content/posts');

const argv = process.argv.slice(2);
const options = { tags: [], draft: true, dir: '' };
const words = [];

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === '--draft') options.draft = true;
  else if (arg === '--publish') options.draft = false;
  else if (arg === '--tags') {
    options.tags = (argv[i + 1] ?? '')
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    i += 1;
  } else if (arg === '--dir') {
    options.dir = (argv[i + 1] ?? '').trim();
    i += 1;
  } else words.push(arg);
}

const title = words.join(' ').trim();

if (!title) {
  console.error(`
用法：
  npm run new -- "文章标题" [--tags 标签1,标签2] [--dir 子目录] [--publish]

默认写出来的文章是草稿（draft: true），本地预览能看到，正式发布不会带上。
写完想发布时，把 frontmatter 里的 draft 改成 false，或者在新建时加 --publish。
`);
  process.exit(1);
}

// 用标题直接当文件名和网址，去掉不能做文件名的字符
const slug = title
  .replace(/[\\/:*?"<>|#%{}$'`]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .slice(0, 60);

const targetDir = options.dir ? join(POSTS_DIR, options.dir) : POSTS_DIR;
const filePath = join(targetDir, `${slug}.md`);

try {
  await access(filePath, constants.F_OK);
  console.error(`✗ 文件已存在：${filePath}`);
  process.exit(1);
} catch {
  // 不存在，可以创建
}

// 用本地日期，避免 UTC 导致日期差一天
const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');
const tags = options.tags.length > 0 ? `[${options.tags.map((tag) => `'${tag}'`).join(', ')}]` : '[]';

const template = `---
title: '${title.replace(/'/g, "''")}'
description: ''
pubDate: ${today}
tags: ${tags}
draft: ${options.draft}
---

在这里开始写正文。写完把上面的 \`draft\` 改成 \`false\` 就会正式发布。

## 一个小标题

正文随便写，Markdown 都支持：**加粗**、*斜体*、\`行内代码\`、[链接](https://example.com)。

- 列表项一
- 列表项二

> 引用也支持。

\`\`\`js
console.log('代码块带高亮');
\`\`\`
`;

await mkdir(targetDir, { recursive: true });
await writeFile(filePath, template, 'utf8');

const relative = filePath.slice(root.length + 1).replace(/\\/g, '/');
console.log(`✓ 已创建 ${relative}`);
console.log(`  草稿状态：${options.draft ? '是（发布前记得改成 false）' : '否（构建时会发布）'}`);
console.log('  运行 npm run dev 后访问 http://localhost:4321 预览');
