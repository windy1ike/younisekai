---
title: 你好，younisekai
directoryTitle: 你好，younisekai
published: 2026-03-01
updated: 2026-03-04
description: 本站的第一篇文章。说说这个模板到底是什么、目录长什么样，以及怎样在十分钟内发出属于你自己的第一篇。
cover: /assets/images/covers/cover-01.svg
coverInContent: false
category: 站点公告
tags: [Astro, 静态站点, 入门]
lang: "zh_CN"
pinned: true
author: 游音
comment: true
draft: false
---

欢迎来到这里。这是本站的第一篇文章，也是这套模板的自我介绍。

如果你刚刚把项目克隆下来，`npm install` 之后还不知道从哪下手，那么读完这一篇，你应该就能写出并发出自己的第一篇内容了。

## younisekai 是什么

一句话：**一个「写完 Markdown 就能发」的静态博客模板**。

它用 [Astro](https://astro.build/) 做构建，用 Tailwind CSS 排版，用 Svelte 写交互组件，最终产出的是一堆纯静态文件——没有数据库，没有运行时服务端，`dist/` 目录丢到任何静态托管上就能跑。

- **内容是文件**：文章是 Markdown，项目、技能、历程、日记、相册是 JSON，全部放在 `src/content/` 里，可以用 Git 管理、可以随时整体迁移。
- **自带后台**：接上内容管理系统之后，可以在浏览器里直接写文章、改数据，不用装编辑器。
- **该有的细节都有**：暗色模式、全站搜索、无限级目录树、代码高亮与折叠、文章加密、复制保护、阅读进度与字数统计。
- **零后端依赖**：搜索索引在构建时生成，文章加密在浏览器端完成，评论等外部服务默认关闭、需要时再打开。

:::tip
这套模板是移植并改造自开源项目 [Spr-Aachen/Twilight](https://github.com/Spr-Aachen/Twilight)（MIT 许可），在此基础上重新设计了中文内容结构、数据集合页面与示例文档。协议与致谢写在[关于页面](/about/)里。
:::

## 目录结构

```
项目根目录/
├── public/                     # 直接拷贝进产物的静态资源
│   └── assets/images/          # 封面、头像、占位图、壁纸
├── src/
│   ├── components/             # 组件（卡片、侧栏挂件、评论……）
│   ├── content/                # 所有内容与数据
│   │   ├── posts/              # 文章（Markdown）
│   │   ├── projects/           # 项目（JSON + 封面图）
│   │   ├── skills/             # 技能（JSON）
│   │   ├── timeline/           # 历程（JSON）
│   │   ├── diary/              # 日记（JSON + 配图）
│   │   ├── albums/             # 相册（JSON + 图片）
│   │   ├── friends/            # 友链（JSON）
│   │   ├── about.md            # 「关于」页正文
│   │   └── friends.md          # 「友链」页正文
│   ├── layouts/                # 页面骨架
│   ├── pages/                  # 路由：文件即页面
│   ├── styles/                 # 样式与主题变量
│   └── utils/                  # 读取与整理内容的工具函数
├── astro.config.mjs            # 构建与插件配置
└── younisekai.config.yaml      # 站点、主题、侧栏、评论等总配置
```

## 内容集合速查

| 想改什么 | 去哪里改 | 一个文件对应 |
| --- | --- | --- |
| 一篇文章 | `src/content/posts/*.md` | 一篇文章 |
| 一个项目 | `src/content/projects/<目录>/intro.json` | 一个项目卡片 |
| 一项技能 | `src/content/skills/*.json` | 一张技能卡 |
| 一段历程 | `src/content/timeline/*.json` | 时间线上的一个节点 |
| 一条日记 | `src/content/diary/<目录>/*.json` | 一条带图的短动态 |
| 一本相册 | `src/content/albums/<目录>/*.json` | 一个相册与其中的照片 |
| 一个友链 | `src/content/friends/*.json` | 友链页上的一张卡片 |
| 关于 / 友链页正文 | `src/content/about.md`、`src/content/friends.md` | 一个单页 |

:::note
页面是按目录约定生成的，所以**文件名就是数据的一部分**：文章的文件名决定它的网址，数据文件的名字决定它在列表里的 id。取名时用英文小写加连字符，最省心。
:::

## 十分钟发出第一篇

1. **安装依赖**：在项目根目录执行 `npm install`。
2. **新建文件**：在 `src/content/posts/` 下建一个 Markdown 文件，例如 `my-first-note.md`——文件名会成为网址的一部分。
3. **写 frontmatter**：文件开头两行 `---` 之间填写标题、日期、分类等信息，最少写 `title`、`published`、`description` 就够。
4. **写正文**：常规 Markdown 语法即可，需要图表、提示框、数学公式时参考[排版速查](/posts/markdown-showcase/)与[图表与公式](/posts/diagrams-and-math/)。
5. **本地预览**：`npm run dev`，打开终端提示的地址，文章位于 `/posts/my-first-note/`。
6. **构建发布**：`npm run build`，把生成的 `dist/` 上传到任意静态托管即可。

## 接下来看什么

- 想先把环境和部署跑通：[快速上手：从本地到线上](/posts/guide/getting-started/)
- 想搞清楚每个 frontmatter 字段：[写作指南：frontmatter 全解析](/posts/guide/writing-guide/)
- 想知道正文能用哪些语法：[排版速查表](/posts/markdown-showcase/)
- 想换主题色、改侧栏挂件：[主题与站点配置](/posts/theme-configuration/)

写博客最难的一步从来不是技术，而是「打开编辑器」。既然第一篇已经在这里了，第二篇就顺手写掉吧。
