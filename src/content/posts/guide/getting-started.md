---
title: 快速上手：从本地到线上
directoryTitle: 快速上手
published: 2026-03-09
updated: 2026-04-02
description: 环境准备、本地开发、新建内容、构建与部署的完整流程，附常用脚本命令速查与上线前检查清单。
cover: "./cover-getting-started.svg"
coverInContent: false
category: 入门指南
tags: [入门, Astro, 站点配置]
lang: "zh_CN"
routeName: "start"
author: 游音
comment: true
draft: false
---

这一篇只讲「怎么把它跑起来并发布出去」。所有命令都在项目根目录执行。

## 环境准备

| 依赖 | 版本要求 | 说明 |
| --- | --- | --- |
| Node.js | `>= 20.3.0` | 构建、脚本与 Astro 都依赖它，版本写在 `package.json` 的 `engines` 里 |
| 包管理器 | npm / pnpm / yarn 任选 | 仓库内附带 `package-lock.json`，用 npm 最省事 |
| Git | 任意较新版本 | 文章的发布日期在缺省时会回退到文件的 Git 首次提交时间 |

:::note
搜索索引、图片处理这些都跑在本地构建阶段，不需要额外安装数据库或服务端环境。真正需要联网的只有两处：Mermaid 图表（运行时从 CDN 取库）与 GitHub 卡片（运行时请求 GitHub API）。
:::

## 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器（默认 http://localhost:4321/）
npm run dev
```

开发服务器带热更新：改 Markdown、改 JSON、改样式，浏览器里会立刻反映出来。文章出现在 `/posts/<文件名>/`，数据集合分别对应 `/projects/`、`/skills/`、`/timeline/`、`/diary/`、`/albums/`。

## 常用脚本速查

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成图标数据后启动开发服务器 |
| `npm run build` | 先生成图标数据，再执行 Astro 构建并调用 Pagefind 生成搜索索引 |
| `npm run preview` | 本地预览构建产物（建议每次发版前跑一遍） |
| `npm run check` | Astro 官方检查：内容集合 schema、组件引用、类型问题 |
| `npm run type-check` | 只跑 TypeScript 类型检查，不产出文件 |
| `npm run new-post -- "文章标题"` | 按 schema 生成一篇带完整 frontmatter 的空文章 |
| `npm run assets` | 重新生成资源配置相关的产物 |
| `npm run check-stylus` | 检查内联 Stylus 样式能否正常编译 |

## 用脚本新建一篇文章

手写 frontmatter 容易漏字段，所以仓库里准备了一个小脚本：

```bash
# 在 posts 根目录建一篇文章
npm run new-post -- "我的第一篇笔记"

# 放在子目录里（目录不存在会自动创建）
npm run new-post -- "guide/写作速查"

# 顺便把标签也写好
npm run new-post -- "读书笔记" --tags 读书,随笔

# 也可以显式指定扩展名
npm run new-post -- "随笔.mdx"
```

脚本会把文件写到 `src/content/posts/` 下，并填好与内容集合 schema 一致的全部字段，接着你只要改内容即可。

## 目录与命名约定

- **文章**：`src/content/posts/` 下的 `.md` 或 `.mdx` 文件，**文件名就是网址**。放在子目录里网址也会带上子目录，例如本文件位于 `posts/guide/getting-started.md`，默认地址是 `/posts/guide/getting-started/`。
- **数据**：项目、技能、历程、日记、相册、友链各占一个目录，**文件名就是条目的 id**，请保持唯一。
- **以 `_` 开头的文件会被忽略**：`src/content/posts/_草稿模板.md` 不会生成页面，适合放模板、片段和素材说明。
- 目录名与文件名建议用英文小写加连字符，避免网址里出现需要转义的中文。

### 侧栏目录树里的显示名

侧栏目录树会用两种方式取名：**目录节点**直接用目录名，**文章节点**则优先用 frontmatter 里的 `directoryTitle`，没写就回退到 `title`。所以「目录名保持英文、显示名交给 `directoryTitle`」是推荐做法：

```yaml
---
title: 快速上手：从本地到线上
directoryTitle: 快速上手
---
```

### 自定义文章地址

给文章加上 `routeName` 之后，它在默认地址之外**额外**多出一个更短的地址：

```yaml
---
title: 快速上手：从本地到线上
routeName: "start"
---
```

上面这段配置会让这篇同时可以通过 `/posts/start/` 访问（默认的 `/posts/guide/getting-started/` 依然有效）。适合把常被引用的文章挂一个短地址，比如 `/posts/start/`、`/posts/faq/`。

## 构建与部署

```bash
npm run build      # 产出 dist/，并在其中生成 pagefind/ 搜索索引
npm run preview    # 用本地服务器预览 dist/ 的实际效果
```

构建脚本会自动识别部署平台并把索引写进对应的产物目录：GitHub Actions、Cloudflare Pages、Netlify 用 `dist/`，Vercel 用 `.vercel/output/static/`。纯静态部署时，`dist/` 整个目录丢到任意静态托管（对象存储 + CDN、Nginx、GitHub Pages 都行）即可。

:::tip
如果部署平台支持缓存，记得把 `dist/pagefind/` 一起上传。少了它，页面还在，但搜索框会一直转圈。
:::

仓库里还带了 `Dockerfile` 与 `docker-compose.yml`，想自建服务器的话可以直接构建镜像运行。

## 上线前检查清单

- [ ] `npm run check` 没有报错
- [ ] 站点的 `siteURL` 已改成自己的域名（影响 RSS、站点地图与分享卡片）
- [ ] `npm run new-post` 建的那几篇示例文章已替换成自己的内容
- [ ] 想隐藏的示例文章加上 `draft: true`，或直接删掉文件
- [ ] `cover` 指向的图片确实存在（本地相对路径用 `./xxx.svg`，`public` 目录里的用 `/assets/...`）
- [ ] 需要加密的文章同时设置了 `encrypted: true` 与 `password`
- [ ] 评论等外部服务要么配置好，要么在配置里显式关掉

## 常见问题

**构建成功但文章不见了？**
先看 `draft`。生产构建会跳过所有 `draft: true` 的文章，开发模式则仍然显示，方便边写边看。

**封面图没显示？**
检查路径写法：以 `/` 开头表示 `public` 目录下的文件，以 `./` 开头表示与文章同目录的文件，以 `http` 开头表示网络图片。

**想换主题色、改侧栏组件顺序？**
这些都在站点总配置文件里，字段说明见[主题与站点配置](/posts/theme-configuration/)。
