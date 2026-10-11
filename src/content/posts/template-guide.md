---
title: 模板使用指南
directoryTitle: ""
published: 2026-10-11
description: YouniSekai 是什么、目录长什么样、十分钟怎么写出第一篇，以及 frontmatter 每个字段的完整说明。
cover: /assets/images/covers/cover-01.svg
coverInContent: false
category: 使用指南
tags: [YouniSekai, Astro, 入门]
lang: "zh_CN"
pinned: true
author: KazeYouni
comment: true
draft: false
---

欢迎来到 YouniSekai。这一篇既是本站的自我介绍，也是这套模板的使用手册：读完它，你应该就能写出并发布自己的第一篇内容。

## 这个站点是什么

一句话：**一个「写完 Markdown 就能发」的静态博客**。

它用 [Astro](https://astro.build/) 做构建，用 Tailwind CSS 排版，用 Svelte 写交互组件，最终产出的是一堆纯静态文件——没有数据库，没有运行时服务端，`dist/` 目录丢到任何静态托管上就能跑。

- **内容是文件**：文章是 Markdown，项目、技能、历程、日记、相册、友链是 JSON，全部放在 `src/content/` 里，可以用 Git 管理、可以随时整体迁移。
- **自带后台**：接上内容管理系统之后，可以在浏览器里直接写文章、改数据，不用装编辑器。
- **该有的细节都有**：暗色模式、全站搜索、无限级目录树、代码高亮与折叠、文章加密、复制保护、阅读进度与字数统计。
- **零后端依赖**：搜索索引在构建时生成，文章加密在浏览器端完成，评论等外部服务默认关闭、需要时再打开。

YouniSekai 由 KazeYouni 一个人维护：写代码，也写点故事。技术栈是 Astro + Tailwind CSS + Svelte，后台用 Sveltia CMS。站点本身的来历与致谢写在[关于页面](/about/)里。

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
| 一个项目 | `src/content/projects/<目录>/<文件>.json` | 一个项目卡片 |
| 一项技能 | `src/content/skills/*.json` | 一张技能卡 |
| 一段历程 | `src/content/timeline/*.json` | 时间线上的一个节点 |
| 一条日记 | `src/content/diary/<目录>/*.json` | 一条带图的短动态 |
| 一本相册 | `src/content/albums/<目录>/*.json` | 一个相册与其中的照片 |
| 一个友链 | `src/content/friends/*.json` | 友链页上的一张卡片 |
| 关于 / 友链页正文 | `src/content/about.md`、`src/content/friends.md` | 一个单页 |

:::note
页面是按目录约定生成的，所以**文件名就是数据的一部分**：文章的文件名决定它的网址，数据文件的名字决定它在列表里的 id。取名时用英文小写加连字符，最省心。
:::

## 十分钟写出第一篇

### 环境准备

| 依赖 | 版本要求 | 说明 |
| --- | --- | --- |
| Node.js | `>= 20.3.0` | 构建、脚本与 Astro 都依赖它，版本写在 `package.json` 的 `engines` 里 |
| 包管理器 | npm / pnpm / yarn 任选 | 仓库内附带 `package-lock.json`，用 npm 最省事 |
| Git | 任意较新版本 | 文章的发布日期在缺省时会回退到文件的 Git 首次提交时间 |

搜索索引、图片处理这些都跑在本地构建阶段，不需要额外安装数据库或服务端环境。真正需要联网的只有两处：Mermaid 图表（运行时从 CDN 取库）与 GitHub 卡片（运行时请求 GitHub API）。

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器（默认 http://localhost:4321/）
npm run dev
```

开发服务器带热更新：改 Markdown、改 JSON、改样式，浏览器里会立刻反映出来。文章出现在 `/posts/<文件名>/`，数据集合分别对应 `/projects/`、`/skills/`、`/timeline/`、`/diary/`、`/albums/`。

### 两种新建文章的方式

**方式一：用脚本生成。** 手写 frontmatter 容易漏字段，所以仓库里准备了一个小脚本：

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

**方式二：手写文件。** 在 `src/content/posts/` 下新建一个 Markdown 文件（例如 `my-first-note.md`），开头两行 `---` 之间填 frontmatter，正文照常写 Markdown。最少写 `title`、`published`、`description` 三个字段就能发布：

```markdown
---
title: 我的第一篇笔记
published: 2026-10-11
description: 一句话说清这篇写的是什么。
---

正文从这里开始。
```

### 常用脚本速查

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

## frontmatter 字段表

一篇文章的开头两行 `---` 之间，就是 frontmatter：它不参与正文排版，却决定了文章出现在哪里、长什么样、给谁看。字段名与 `src/content.config.ts` 中的 schema 一一对应，写错了构建会直接报出来。

| 字段 | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `title` | 字符串 | 必填 | 文章标题，同时用于列表页、RSS 与浏览器标题 |
| `directoryTitle` | 字符串 | 空 | 侧栏目录树中显示的名字；留空时回退为 `title` |
| `published` | 日期 | 空 | 发布日期，用于排序；留空时回退到文件的 Git 首次提交时间 |
| `updated` | 日期 | 空 | 更新日期；填写后会显示「上次编辑」卡片与文章底部的差异信息 |
| `description` | 字符串 | 空 | 摘要，显示在列表卡片、分享卡片与搜索结果里 |
| `cover` | 字符串 | 空 | 封面图，见下方「封面与图片」 |
| `coverInContent` | 布尔 | `false` | 是否在正文顶部再渲染一次封面大图 |
| `category` | 字符串或数组 | 空 | 分类，数组即嵌套分类 |
| `tags` | 数组或逗号分隔字符串 | 空 | 标签，用于标签云与归档筛选 |
| `lang` | 字符串 | 空 | 内容语言，例如 `zh_CN`；用于 RSS 与 HTML 的语言标记 |
| `pinned` | 布尔 | `false` | 是否置顶到文章列表最前 |
| `author` | 字符串 | 空 | 作者名，显示在版权卡片里；留空则用站点资料页的名字 |
| `sourceLink` | 字符串 | 空 | 原文或来源链接，填写后版权卡片会指向它 |
| `licenseName` | 字符串 | 空 | 本篇文章的许可协议名称，例如 `CC BY 4.0` |
| `licenseUrl` | 字符串 | 空 | 许可协议链接 |
| `comment` | 布尔 | `true` | 这篇文章是否允许评论；实际是否显示还取决于站点配置里的评论总开关 |
| `draft` | 布尔 | `false` | 草稿标记，生产构建会跳过草稿 |
| `encrypted` | 布尔 | `false` | 是否对正文加密 |
| `password` | 字符串 | 空 | 解锁密码，与 `encrypted: true` 配对使用 |
| `copyProtection` | 对象 | 全部 `false` | 页面级复制保护开关，见[站点配置与进阶功能](/posts/site-configuration/) |
| `routeName` | 字符串 | 空 | 额外的自定义地址（不替换默认地址） |

:::tip
`prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 这四个字段由构建过程自动填充，用来生成文章底部的上一篇/下一篇跳转，**不要在 frontmatter 里手写**。
:::

### 日期怎么写

推荐 ISO 8601 的 `YYYY-MM-DD`，需要精确到时间就写 `YYYY-MM-DDTHH:mm:ss`。`published` 决定排序，`updated` 只影响「最后修改于多久之前」的展示：

```yaml
published: 2026-10-11
```

没有写 `published` 时，构建会依次尝试读取该文件的 Git 首次提交时间、文件创建时间。为了排序稳定，公开发布的文章建议都显式写上日期。

## 目录、分类与标签的规则

- **文章**：`src/content/posts/` 下的 `.md` 或 `.mdx` 文件，**文件名就是网址**。放在子目录里网址也会带上子目录，例如 `posts/guide/start.md` 的地址是 `/posts/guide/start/`。
- **数据**：项目、技能、历程、日记、相册、友链各占一个目录，**文件名就是条目的 id**，请保持唯一。
- **以 `_` 开头的文件会被忽略**：`src/content/posts/_frontmatter-template.md` 不会生成页面，适合放模板、片段和素材说明。
- 目录名与文件名建议用英文小写加连字符，避免网址里出现需要转义的中文。

分类是「树」，标签是「云」，两者用途不同：分类回答「这篇属于哪个板块」，标签回答「这篇讲到了哪些点」。

```yaml
# 单层分类
category: 使用指南

# 嵌套分类：写在数组里，用「 / 」连接展示
category: [技术笔记, 前端]

# 标签可以写成数组
tags: [Markdown, 排版]

# 也可以写成逗号分隔的字符串，效果相同
tags: Markdown, 排版
```

嵌套分类在侧栏的「文章类别」里会按层级展开，点击后跳转到归档页的筛选结果，地址形如 `/archive/?category=技术笔记%20%2F%20前端`。也就是说嵌套分类是**整体匹配**的，点「技术笔记 / 前端」只会筛出同时属于这两层的文章。

### 侧栏目录树里的显示名

侧栏目录树用两种方式取名：**目录节点**直接用目录名，**文章节点**则优先用 frontmatter 里的 `directoryTitle`，没写就回退到 `title`。所以「目录名保持英文、显示名交给 `directoryTitle`」是推荐做法。本篇文章的 `directoryTitle` 留空，目录树里就直接显示 `title`。

### 自定义文章地址

给文章加上 `routeName` 之后，它在默认地址之外**额外**多出一个更短的地址：

```yaml
---
title: 模板使用指南
routeName: "guide"
---
```

上面这段配置会让这篇同时可以通过 `/posts/guide/` 访问（默认的 `/posts/template-guide/` 依然有效）。适合把常被引用的文章挂一个短地址。

## 封面与图片

`cover` 支持三种写法，按前缀区分：

```yaml
cover: /assets/images/covers/cover-01.svg   # 以 / 开头：public 目录下的文件
cover: ./cover.svg                          # 以 ./ 开头：与文章同目录的文件
cover: "https://图床地址/cover.png"          # 以 http 开头：网络图片
```

至于 `coverInContent`：

- `coverInContent: false`（默认）：封面只出现在**列表卡片**上，正文里不会再出现一次大图。
- `coverInContent: true`：封面额外渲染在**正文标题与元信息之下**，形成「题图」效果，适合长文。

图片本身有两种存放位置：

| 写法 | 图片放哪 | 适合什么 |
| --- | --- | --- |
| `/assets/images/...` | `public/assets/images/` 下 | 全站复用的封面、头像、占位图 |
| `./xxx.png` | 与 Markdown 文件同一个目录 | 跟着这篇文章一起搬家的配图 |

:::tip
以 `/` 开头的路径是「绝对路径」，指向 `public` 目录；以 `./` 开头的是「内容相对路径」，构建时会被一并处理。一旦相对路径写错，构建会直接报 `ImageNotFound` 而不是静默跳过。
:::

## 草稿机制

```yaml
draft: true
```

- 开发模式（`npm run dev`）下草稿**照常显示**，方便你边写边预览。
- 生产构建（`npm run build`）会跳过所有草稿：不会生成页面，也不会进入列表、RSS、站点地图、搜索索引与侧栏目录树。
- 想「暂不发布」又不想每次部署都惦记着它，用草稿比用注释更安全：注释掉的 frontmatter 会导致字段缺失，而草稿是一个受支持的正式状态。

## 上线前检查清单

- [ ] `npm run check` 没有报错
- [ ] 站点的 `siteURL` 已改成自己的域名（影响 RSS、站点地图与分享卡片）
- [ ] 示例文章已替换成自己的内容，或加上 `draft: true`
- [ ] `cover` 指向的图片确实存在（本地相对路径用 `./xxx.svg`，`public` 目录里的用 `/assets/...`）
- [ ] 需要加密的文章同时设置了 `encrypted: true` 与 `password`
- [ ] 评论等外部服务要么配置好，要么在配置里显式关掉

下一篇可以接着看[Markdown 与扩展语法速查](/posts/markdown-extensions/)，把提示框、图表与公式用起来；想调主题色、换侧栏挂件，就去[站点配置与进阶功能](/posts/site-configuration/)。
