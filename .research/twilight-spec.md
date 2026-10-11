# Twilight (Spr-Aachen) 技术规格报告

> 调研方式说明：任务书假设「shell 无 HTTP 访问、只能用 web_search」。实测该前提**不成立** —— 本环境的 PowerShell 具有完整外网访问能力。因此本报告绝大部分内容来自**直接抓取仓库原始文件 / 官方文档源码 / 线上产物**，而非搜索摘要。凡属推断或未验证的内容，均在最后一节明确标注。
>
> 关键证据来源：
> - 仓库原始文件：`https://raw.githubusercontent.com/Spr-Aachen/Twilight/main/...`（320 个文件，GitHub Trees API 全量枚举）
> - 文档源码仓库：[Spr-Aachen/Twilight-Docs](https://github.com/Spr-Aachen/Twilight-Docs)（VuePress + vuepress-theme-plume）
> - 线上产物：[twilight.spr-aachen.com](https://twilight.spr-aachen.com)（含 `/admin/`、`/robots.txt`、`/sitemap-0.xml`、`/rss.xml`）
> - CMS OAuth 集成：[Spr-Aachen/astro-decap-cms-oauth](https://github.com/Spr-Aachen/astro-decap-cms-oauth)

---

## 0. 项目基本信息

| 项目 | 值 |
|---|---|
| 仓库 | [Spr-Aachen/Twilight](https://github.com/Spr-Aachen/Twilight) |
| 默认分支 | `main` |
| 许可 | MIT |
| 创建 / 最后推送 | 2025-10-14 / 2026-10-07 |
| Star / Fork | 338 / 115（调研时点） |
| 简介 | A CMS integrated static blog template \| 支持后台管理的静态博客模板 |
| Topics | `astro`, `blog-theme`, `content-management-system`, `serverless`, `site-template` |
| Demo | https://twilight.spr-aachen.com |
| 文档 | https://docs.twilight.spr-aachen.com （中文）/ `/en/` （英文镜像） |
| Releases | v1.0.0 (2026-01-16)、v1.1.1 (2026-02-04)、v1.2.3 (2026-04-26)、v1.3.5 (2026-08-16) |
| 原型 / 灵感 | 原型 [Fuwari](https://github.com/saicaca/fuwari)；灵感 Yukina、Mizuki |

⚠️ **注意版本陷阱**：`package.json` 里的 `"version"` 仍写着 `1.0.0`，与 release tag（最新 v1.3.5）不同步；`main` 分支内容比任何 release 都新。**重建时应以 `main` 为准**。

---

## 1. 技术栈

### 1.1 核心

| 类别 | 选型 | 版本 |
|---|---|---|
| SSG | **Astro** | `5.18.2`（精确锁定，非 `^`） |
| UI 交互框架 | **Svelte** | `^5.56.8`（经 `@astrojs/svelte@7.2.5`，使用 Runes：`$state`、`$props`） |
| CSS 框架 | **Tailwind CSS v4** | `^4.3.3`，经 `@tailwindcss/vite` 插件接入 |
| CSS 预处理器 | **Stylus** | `^0.64.0`（`src/styles/*.styl`） |
| 包管理器 | **pnpm** | `packageManager: pnpm@9.14.4` |
| Node | 文档要求 **>= 20**；Docker 用 `node:lts-alpine`；GH Actions 默认 Node 24 | — |
| 模块系统 | `"type": "module"` | — |
| TypeScript | `^5.9.3` + `@astrojs/check` | — |

Tailwind v4 **没有** `tailwind.config.js` —— 采用 CSS-first 的 `@theme` 块（见 §8）。PostCSS 仅用于 `postcss-import`。

### 1.2 完整依赖清单（摘自 package.json）

**dependencies**

```
@astrojs/check ^0.9.10          @astrojs/cloudflare ^12.6.13    @astrojs/mdx 4.3.14
@astrojs/netlify ^6.6.5         @astrojs/rss ^4.0.19            @astrojs/sitemap ^3.7.3
@astrojs/svelte 7.2.5           @astrojs/vercel ^9.0.5          @edgeone/astro ^1.1.5
@expressive-code/core ^0.44.1   @expressive-code/plugin-collapsible-sections ^0.44.1
@expressive-code/plugin-line-numbers ^0.44.1
@fancyapps/ui ^6.1.14           @fontsource-variable/jetbrains-mono ^5.3.0
@iconify-json/eos-icons ^1.2.4  @iconify-json/fa6-brands ^1.2.6
@iconify-json/fa6-regular ^1.2.4 @iconify-json/fa6-solid ^1.2.4
@iconify-json/ic ^1.2.4         @iconify-json/logos ^1.2.11
@iconify-json/material-symbols ^1.2.87
@iconify/svelte ^5.2.2          @swup/astro ^1.8.0
@tailwindcss/typography ^0.5.20 @tailwindcss/vite ^4.3.3
@types/js-yaml ^4.0.9           astro 5.18.2
astro-expressive-code ^0.44.1   astro-icon ^1.1.5               crypto-js ^4.2.0
dayjs ^1.11.21                  decap-cms-oauth-astro ^0.1.3    echarts ^6.1.0
hastscript ^9.0.1               js-yaml ^4.3.1                  katex ^0.18.2
markdown-it ^14.3.0             mdast-util-to-string ^4.0.0     node-html-parser ^7.1.0
pagefind ^1.5.2                 reading-time ^1.5.0             rehype-autolink-headings ^7.1.0
rehype-callouts ^2.2.0          rehype-components ^0.3.0        rehype-katex ^7.0.1
rehype-slug ^6.0.0              remark-directive ^4.0.0         remark-directive-rehype ^0.4.2
remark-math ^6.0.0              remark-sectionize ^2.1.0        sanitize-html ^2.17.6
satori ^0.29.0                  sharp ^0.35.3                   stylus ^0.64.0
svelte ^5.56.8                  tailwindcss ^4.3.3              typescript ^5.9.3
unist-util-visit ^5.1.0
```

**devDependencies**

```
@astrojs/ts-plugin ^1.10.10  @iconify-json/mdi ^1.2.3  @rollup/plugin-yaml ^4.1.2
@types/hast ^3.0.5           @types/markdown-it ^14.1.2 @types/mdast ^4.0.4
@types/sanitize-html ^2.16.1 postcss-import ^16.1.1
```

**npm scripts**

```json
"type-check":    "tsc --noEmit --isolatedDeclarations",
"check-stylus":  "node scripts/compile-inline-stylus.cjs",
"check":         "astro check",
"dev":           "node scripts/generate-icons.js && astro dev",
"build":         "node scripts/generate-icons.js && node scripts/build-with-pagefind.cjs",
"preview":       "astro preview",
"astro":         "astro",
"new-post":      "node scripts/new-post.js"
```

> README 中标记为 ~~删除线~~ 的 `pnpm lint` / `pnpm format`（Biome）**已不存在**。

### 1.3 astro.config.mjs 集成与 Markdown 管线

```js
integrations: [
  decapCmsOauth({ configPath: "./.decap.yml", decapCMSVersion: "3.9.0", enable: false }),
  swup({ theme: false, animationClass: "transition-swup-",
         containers: ["#swup-container","#left-sidebar","#right-sidebar","#middle-sidebar"],
         cache: true, preload: true, accessibility: true, updateHead: true,
         updateBodyClass: false, globalInstance: true,
         smoothScrolling: false, resolveUrl: (url) => url,
         animateHistoryBrowsing: false, skipPopStateHandling: ... }),
  icon({ include: { "fa6-brands":["*"], "fa6-regular":["*"], "fa6-solid":["*"], mdi:["*"] } }),
  expressiveCode({ themes: ["github-light","github-dark"],
                   themeCSSSelector: (t) => `[data-theme="${t}"]`,
                   plugins: [pluginCollapsibleSections(), pluginLineNumbers(),
                             pluginCollapseButton(), pluginCopyButton(), pluginLanguageBadge()], ... }),
  mdx(), sitemap(), svelte({ preprocess: vitePreprocess() }),
]
```

**Markdown 管线（顺序敏感，照抄）**

- `remarkPlugins`: `remarkMath`, `remarkReadingTime`, `remarkExcerpt`, `remarkDirective`, `remarkSectionize`, `parseDirectiveNode`, `remarkMermaid`
- `rehypePlugins`: `rehypeAutolinkHeadings`(behavior `append`, className `anchor`, 插入 `<span class="anchor-icon" data-pagefind-ignore>#</span>`) → `rehypeSlug` → `rehypeKatex` → `rehypeComponents`(`github`/`music`) → `rehypeCallouts`(theme `github`, `showIndicator:false`, 类名 `admonition` / `bdm-<type>` / `bdm-title` / `bdm-content`) → `rehypeAdmonitions` → `rehypeMermaid` → `rehypeLazyLoadMedia`

**其它全局设置**

```js
site: siteConfig.siteURL,
base: "/",
trailingSlash: "always",   // 所有 URL 带尾斜杠
adapter: /* 见 §7 环境变量自动选择 */
vite: { plugins: [tailwindcss()], build: { cssCodeSplit: true, cssMinify: "esbuild",
        minify: "esbuild", esbuildOptions: { drop: PROD ? ["console","debugger"] : [] } } }
```

---

## 2. 完整目录结构（320 文件）

```
Twilight/
├── .decap.yml                      # ★ Decap CMS 配置（后台字段定义，15.6 KB）
├── .pages.yml                      # ★ Pages CMS 配置（替代方案，8.7 KB）
├── _frontmatter.json               # Front Matter VS Code 扩展配置
├── .env                            # OAUTH_GITHUB_CLIENT_ID / SECRET（.gitignore 忽略）
├── .npmrc                          # manage-package-manager-versions = true
├── .dockerignore  .gitignore  LICENSE
├── astro.config.mjs                # ★ 集成 + Markdown 管线 + adapter 自动选择
├── twilight.config.yaml            # ★★ 站点主配置（15.5 KB，唯一数据源）
├── package.json  pnpm-lock.yaml    # pnpm-lock 554 KB
├── pagefind.yml                    # Pagefind 索引排除选择器
├── postcss.config.mjs              # 仅 postcss-import
├── svelte.config.js                # vitePreprocess({ script: true })
├── tsconfig.json                   # 路径别名 @/* @components/* @utils/* …
├── vercel.json                     # buildCommand/outputDirectory/headers/cleanUrls
├── docker-compose.yml  Dockerfile  # 构建 → nginx 静态托管
├── esa.jsonc                       # 腾讯 EdgeOne Pages 配置
│
├── .github/
│   ├── FUNDING.yml  dependabot.yml
│   ├── ISSUE_TEMPLATE/{01-bug_report.yml,02-feature_request.yml,03-custom_issue.yml}
│   ├── pull_request_template.md
│   └── workflows/{deploy.yml,dependabot-conflict-closer.yml}
│
├── docs/
│   └── README_ZH.md                # 中文 README
│
├── scripts/
│   ├── build-with-pagefind.cjs     # ★ Astro build → 按平台推导 Pagefind 输出目录 → npx pagefind
│   ├── compile-inline-stylus.cjs
│   ├── generate-icons.js           # ★ 扫描 .astro/.svelte/.json 中的 icon="x:y" → 生成 src/utils/icons.ts
│   └── new-post.js                 # pnpm new-post <filename> 生成 frontmatter 骨架
│
├── public/
│   ├── FooterConfig.html           # 页脚 HTML 注入示例
│   ├── _headers                    # Cloudflare/Netlify 响应头 + RSS/Atom CORS
│   ├── favicon/{icon-light.ico,icon-dark.ico}
│   ├── assets/
│   │   ├── images/{avatar.jpg, desktopWallpaper_1~3.jpg, mobileWallpaper_1~2.jpg, particle.png}
│   │   ├── css/{highlight-github-dark.min.css, twikoo.css}
│   │   ├── js/{highlight.min.js, marked.min.js, twikoo.all.min.js}
│   │   └── music/深海之息.{m4a,lrc}
│   └── pio/
│       ├── models/pio/{model.json,model.moc,motions/*.mtn,textures/*.png}   # Live2D 模型
│       └── static/{avatar.jpg, l2d.js, pio.css, pio.js}
│
└── src/
    ├── config.ts                   # ★ 加载 twilight.config.yaml，导出各段配置
    ├── content.config.ts           # ★ Astro 集合定义（posts / spec）
    ├── env.d.ts  global.d.ts
    │
    ├── content/                    # ★ 内容目录
    │   ├── about.md                #   关于页正文
    │   ├── friends.md              #   友链页头部说明
    │   ├── posts/                  #   文章（md）
    │   │   ├── copy-protection.md  draft.md  encryption.md  mermaids.md  videos.md
    │   │   └── guide/{Getting Started.md, Advanced Customization.md, Cover - *.jpg}
    │   ├── albums/example/jsonExample.json
    │   ├── diary/example/jsonExample.json
    │   ├── friends/{astro.json, spraachen.json, twilight-docs.json}
    │   ├── projects/Twilight/{intro.json, Twilight_Cover.jpg}
    │   ├── skills/{astro.json, git.json, svelte.json, tailwindcss.json}
    │   └── timeline/first-template-project.json
    │
    ├── components/
    │   ├── archivePanel.svelte           banner.astro          back2TopButton.astro
    │   ├── backwardButton.astro          comment.astro         configCarrier.astro
    │   ├── copyProtection.astro          fontLoader.astro      footer.astro
    │   ├── fullscreenWallpaper.astro     loadingOverlay.astro  musicPlayer.svelte (35 KB)
    │   ├── navbar.astro                  pagination.astro      pio.svelte
    │   ├── postPage.astro                sidebar.astro         tocButton.astro
    │   ├── comment/{twikoo.astro, waline.astro}
    │   ├── common/{DropdownItem.svelte, DropdownPanel.svelte, buttonLink.astro,
    │   │           buttonTag.astro, icon.astro, icon.svelte, iconifyLoader.astro,
    │   │           imageWrapper.astro, markdown.astro, passwordProtection.astro,
    │   │           typewriterText.astro}
    │   ├── data/{projectCard.astro, skillCard.astro, timelineItem.astro}
    │   ├── navbar/{displaySettings.svelte, lightDarkSwitch.svelte, navLinks.astro,
    │   │            navMenu.svelte, search.svelte, translator.svelte, wallpaperSwitch.svelte}
    │   ├── post/{license.astro, postCard.astro, postMeta.astro}
    │   └── sidebar/{announcement.astro, categories.astro, categoryItem.astro,
    │                directory.astro, directoryTree.svelte, profile.astro,
    │                statistics.astro, statistics.svelte (24 KB), tags.astro,
    │                toc.astro, toc.ts (16 KB), widgetLayout.astro}
    │
    ├── constants/
    │   ├── breakpoints.ts  category.ts  icon.ts  layout.ts  link-presets.ts
    │   └── pagination.ts  panelTop.ts  style.ts  transitions.ts
    │
    ├── i18n/
    │   ├── i18nKey.ts               # ★ I18nKey 枚举（约 250 个 key）
    │   ├── language.ts              # ★ LANGUAGE_CONFIG 14 种语言
    │   ├── translation.ts           # getTranslation / i18n()
    │   └── languages/{en.ts, zh_hans.ts, zh_hant.ts, ja.ts}
    │
    ├── layouts/{base.astro (26 KB), grid.astro}
    │
    ├── pages/                       # ★ 路由（见 §2.1）
    │   ├── 404.astro  [...]menu].astro  [...page].astro  about.astro
    │   ├── albums.astro  albums/[id]/index.astro  anime.astro  archive.astro
    │   ├── atom.astro  atom.xml.ts  diary.astro  friends.astro
    │   ├── og/[...slug].png.ts  posts/[...slug].astro  projects.astro
    │   ├── robots.txt.ts  rss.astro  rss.xml.ts  skills.astro  timeline.astro
    │
    ├── plugins/
    │   ├── expressive-code/{collapse-button.ts, copy-button.ts, language-badge.ts}
    │   ├── mermaid-render-script.js (17 KB)  rehype-admonitions.mjs
    │   ├── rehype-component-github-card.mjs  rehype-component-music-card.mjs (16 KB)
    │   ├── rehype-lazy-load-media.mjs  rehype-mermaid.mjs
    │   ├── remark-directive-rehype.js  remark-excerpt.js  remark-mermaid.js
    │   ├── remark-reading-time.mjs  translate.js (640 KB)  umami-share.js
    │
    ├── styles/
    │   ├── main.css (18 KB)          # ★ Tailwind v4 @theme + @layer + utilities
    │   ├── variables.styl (4.5 KB)   # ★ 全部颜色变量（由 --hue 派生）
    │   ├── markdown-extend.styl      markdown.css  grid.css  navbar.css
    │   ├── banner.css  transition.css  expressive-code.css  fancybox.css
    │   ├── albums.css  anime.css  musicplayer.css
    │
    ├── types/{config.ts (13.7 KB), translate.d.ts}
    │
    └── utils/
        ├── albums.ts  analytics.ts  category.ts  date.ts  diary.ts  directory.ts
        ├── fancybox.ts  friends.ts  hue.ts  icons.ts  language.ts  markdown.ts
        ├── music.ts  navigation.ts  particle.ts  post.ts  projects.ts  skills.ts
        ├── tag.ts  theme.ts  timeline.ts  url.ts  wallpaper.ts  widget.ts
```

### 2.1 路由表（依据线上 `sitemap-0.xml` + 源码核实）

| 文件 | 生成路由 |
|---|---|
| `[...page].astro` | `/`、`/2/`、`/3/`… （`paginate(posts, { pageSize: 8 })`，**首页即分页列表**） |
| `[...menu].astro` | 导航中含 `children` 的一级菜单自动生成中转页，slug 由 `navLink.url` 去斜杠得到（示例：`/exhibition/`） |
| `posts/[...slug].astro` | `/posts/<id 去扩展名>/`（子目录保留，如 `/posts/guide/getting-started/`）；若有 `routeName` 则**额外**生成 `/posts/<routeName>/` |
| `archive.astro` | `/archive/`，通过查询参数过滤：`?category=`、`?tag=`、`?uncategorized=true` |
| `albums.astro` / `albums/[id]/index.astro` | `/albums/`、`/albums/<albumId>/` |
| 其它 | `/about/`、`/anime/`、`/diary/`、`/friends/`、`/projects/`、`/skills/`、`/timeline/`、`/404` |
| 信息页 | `/rss/`、`/atom/`（人类可读的订阅说明页） |
| Feed | `/rss.xml`、`/atom.xml`（`APIRoute`） |
| 其它 API 路由 | `/robots.txt`、`/sitemap-index.xml` + `/sitemap-0.xml`（`@astrojs/sitemap`）、`/og/<slug>.png`（satori 生成，需 `generateOgImages: true`） |
| CMS 注入 | `/admin/`、`/oauth`、`/oauth/callback`（由 `decap-cms-oauth-astro` 集成注入，**不在 src/pages 中**） |

线上 sitemap 实测条目（21 条，含 `/admin/`）证实了上述路由形状。

> **没有** `/tags/`、`/categories/`、`/series/` 独立路由 —— 标签与分类全部走 `/archive/?tag=…` 与 `/archive/?category=…`。这是 Twilight 与 Fuwari 的明显差异点之一。

---

## 3. 内容模型

### 3.1 Astro 内容集合（`src/content.config.ts`）

**只有两个集合**：

```ts
posts: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" })
spec:  glob({ pattern: '[^_]*.{md,mdx}',     base: "./src/content" })   // about.md / friends.md 等单页
```

> ⚠️ **重要架构事实**：`projects` / `skills` / `timeline` / `friends` / `albums` / `diary` **不是 Astro 内容集合**，而是散落的 JSON 文件，由 `src/utils/{projects,skills,timeline,friends,albums,diary}.ts` 直接读取。集合 schema 只有 `posts` 和 `spec`。

### 3.2 文章 frontmatter 完整字段（逐字来自 schema）

```ts
title:           z.coerce.string()                      // 必需
directoryTitle:  string  = ""      // 侧栏目录树显示名，trim 后使用（空则回退到 title）
published:       optionalDate      // 日期或空串，空串 → undefined
updated:         optionalDate
description:     string  = ""
cover:           string  = ""      // 支持 http(s):// 、/public 绝对路径、或相对 .md 的 ./cover.jpg
coverInContent:  boolean = false   // 是否在正文中也显示封面
category:        string | string[] = ""   // 经 getCategoryPathParts 预处理，支持嵌套
tags:            string[] = []     // 经 parseTags：数组，或用逗号分隔的字符串
lang:            string  = ""      // 单篇语言覆盖
pinned:          boolean = false
author:          string  = ""
sourceLink:      string  = ""
licenseName:     string  = ""
licenseUrl:      string  = ""
comment:         boolean = true
draft:           boolean = false   // PROD 环境下 draft!==true 才纳入

/* 加密 */
encrypted:       boolean = false
password:        string  = ""

/* 复制保护 */
copyProtection: { blockSelection: false, blockClipboard: false,
                  blockContextMenu: false, blockDevTools: false }

/* 自定义固定链接 */
routeName:       string | undefined

/* 内部使用（构建时回填） */
prevTitle / prevSlug / nextTitle / nextSlug: string = ""
```

**实际 frontmatter 示例**（`src/content/posts/guide/Getting Started.md`）：

```yaml
---
title: Guide for Template - Getting Started
published: 2001-10-02
description: "How to use this blog template."
cover: "./Cover - Getting Started.jpg"
coverInContent: false
pinned: true
tags: []
category:
    - Guides:
        - Getting Started
draft: false
---
```

**嵌套分类**是 Twilight 的特色：三种等价写法
1. 字符串：`category: Guides`
2. 数组：`category: [Guides, Getting Started]`
3. YAML 嵌套映射：`category:\n  - Guides:\n      - Getting Started`

统一由 `getCategoryPathParts()` 归一为 `string[]`，并以 `CATEGORY_SEPARATOR = " / "` 连接成标签。无分类时回退到 `UNCATEGORIZED = "uncategorized"`（i18n 后显示）。

### 3.3 `src/config.ts` —— 配置加载器（不是配置数据）

**配置数据在根目录 `twilight.config.yaml`**，通过 Vite 的 `?raw` 导入后 `js-yaml` 解析：

```ts
import rawConfig from "../twilight.config.yaml?raw";
const config = yaml.load(rawConfig) as ConfigFile;
```

`src/config.ts` 负责导出：

| 导出 | 说明 |
|---|---|
| `siteConfig` | `config.site` |
| `analyticsConfig` | 合并 `import.meta.env.UMAMI_API_KEY` / `UMAMI_TRACKING_CODE` 兜底 |
| `navbarConfig` | 把字符串链接名（`"Home"`）规范化为 `LinkPreset` 枚举；未知名称直接抛错 |
| `sidebarConfig` / `profileConfig` / `announcementConfig` / `footerConfig` / `particleConfig` / `musicPlayerConfig` / `pioConfig` | 透传 |
| `postConfig` | 经 `resolveCommentConfig()` 处理后的文章配置 |

`resolveCommentConfig()` 逻辑（值得复刻）：显式 `provider` 必须已配置对应的必填项（Waline 看 `serverURL`，Twikoo 看 `envId`，纯空格视为未填），否则**构建期抛错**；未指定时按 `waline → twikoo` 顺序取第一个可用者；`lang` 留空则回退 `site.lang`。

### 3.4 其它内容 JSON 结构

```jsonc
// src/content/projects/<id>.json   文件名即项目 id
{ "title","description","image","category": "library|ai|software|website|game",
  "techStack": [], "status": "completed|in-progress|planned",
  "liveDemo","sourceCode","startDate","endDate","featured": bool, "tags": [] }

// src/content/skills/<id>.json
{ "name","description","icon":"logos:git-icon",
  "category": "ai|backend|client|frontend|database|engines|tools|others",
  "level": "beginner|intermediate|advanced|expert",
  "experience": { "years": 3, "months": 0 }, "projects": [], "certifications": [], "color": "#F05032" }

// src/content/timeline/<id>.json
{ "title","description","type": "education|work|project|achievement",
  "startDate","endDate","location","organization","position","skills": [],
  "achievements": [], "links": [{ "name","url","type": "certificate|project|other" }],
  "icon","color" }

// src/content/friends/<id>.json
{ "title","imgurl","desc","siteurl","tags": [] }     // 注意字段名是 imgurl/siteurl/desc，非标准

// src/content/albums/<id>.json
{ "title","description","cover","date","location","tags": [],
  "layout": "grid|masonry|list", "columns": 1..6,
  "photos": [{ "src","alt","title","description","tags": [], "date" }], "visible": bool }

// src/content/diary/<id>.json
{ "title","content","date","images": [] }
```

### 3.5 常量文件

```ts
// src/constants/layout.ts
NAVBAR_HEIGHT = 72          // px
NAVBAR_GAP = 1.25           // rem
NAVBAR_FOLLOW_DISTANCE = 0
BANNER_HEIGHT = 30          // vh
BANNER_HEIGHT_EXTEND = 36   // vh
BANNER_HEIGHT_HOME = 66     // vh
MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 0
SIDEBAR_TOP = 1             // rem
SIDEBAR_SPACING = 1         // rem
PAGE_WIDTH = 90             // rem

// src/constants/pagination.ts
PAGE_SIZE = 8

// src/constants/category.ts
UNCATEGORIZED = "uncategorized"

// src/constants/style.ts
LIGHT_MODE = "light"; DARK_MODE = "dark"; SYSTEM_MODE = "system"

// src/constants/transitions.ts
TINY 100 / FASTEST 120 / FAST 150 / NORMAL 200 / MEDIUM 300 /
SLOW 500 / SLOWER 600 / LONG 1000 / VERY_SLOW 1200   // ms
EASE_DEFAULT   = cubic-bezier(0.4, 0, 0.2, 1)
EASE_PAGE_IN   = cubic-bezier(0.25, 0.46, 0.45, 0.94)
EASE_PAGE_OUT  = cubic-bezier(0.55, 0.055, 0.675, 0.19)
```

`src/constants/link-presets.ts` 定义 `LinkPresets`，枚举顺序即 URL：

```ts
enum LinkPreset { Home=0, Archive=1, Projects=2, Skills=3, Timeline=4,
                  Diary=5, Albums=6, Anime=7, About=8, Friends=9 }
// Home /  Archive /archive/  Projects /projects/  Skills /skills/  Timeline /timeline/
// Diary /diary/  Albums /albums/  Anime /anime/  Friends /friends/  About /about/
// 每个预设带 icon（material-symbols:*）与 description
```

---

## 4. 站点配置面（`twilight.config.yaml` 全字段）

顶层段：`site` / `analytics` / `navbar` / `sidebar` / `profile` / `announcement` / `post` / `footer` / `particle` / `musicPlayer` / `pio`

### `site`
`siteURL`（**必须以斜杠结尾**）、`title`、`subtitle`、`keywords?`、`lang`（`SupportedLanguage`）、`timeZone`（-12..12）、`themeColor.hue`（0–360，默认 255）、`defaultTheme`（`system|light|dark`）、`favicon[]`（`{src, theme?, sizes?}`）、`bangumi.userId`、`generateOgImages`

- `site.translate`: `{ enable, service:"client.edge", showSelectTag, autoDiscriminate, ignoreClasses[], ignoreTags[] }`
- `site.font`: `Record<string, { src, family }>` —— `src` 可为 Google Fonts CSS 链接或本地字体文件路径
- `site.wallpaper`:
  - `mode`: `banner | fullscreen | none`
  - `src`: `string | string[] | { desktop?, mobile? }`（数组长度 > 1 自动轮播）
  - `position`: `top|center|bottom`；`carousel`: `{ enable, interval(s), kenBurns }`
  - `banner.homeText`: `{ enable, title, subtitle(string|string[]), typewriter:{enable,speed,deleteSpeed,pauseTime} }`
  - `banner.credit`: `{ enable, text, url }`
  - `banner.navbar.transparentMode`: `semi | full | semifull`
  - `banner.waves`: `{ enable, performanceMode }`
  - `fullscreen`: `{ zIndex, opacity(0-1), blur(px), navbar.transparentMode }`
- `site.loadingOverlay`: `{ enable, waitForFonts, waitForImages, maxWait(s), title:{enable,content,interval}, spinner:{enable,interval} }`

### `analytics`
`{ enabled, platform:"umami", umami:{ baseUrl, apiKey, code } }` —— 仅支持 Umami。

### `navbar.links[]`
元素可以是**预设名字符串**（`"Home"` / `"Archive"` / `"Projects"` / `"Skills"` / `"Timeline"` / `"Diary"` / `"Albums"` / `"Anime"` / `"About"` / `"Friends"`）或自定义对象：

```yaml
- name: "Exhibition"
  url: "/exhibition/"
  icon: "material-symbols:person"
  description: "A collection of my creative works and experiences"
  external: false
  children: [ "Projects", "Skills", "Timeline", "Diary", "Albums", "Anime" ]
```

**支持无限层级嵌套**（`children` 内元素同样可为预设或自定义对象）。含 `children` 的一级项会自动生成 `[...menu].astro` 中转页。

### `sidebar.components.{left,right}[]`
`{ type, enable, position: "top"|"sticky", style?, visibility?:{mode:"include"|"exclude", paths:[正则字符串]}, responsive?:{hidden:["mobile"|"tablet"|"desktop"], collapseThreshold}, depth? }`
`type` 取值：`profile | announcement | directory | categories | tags | statistics | toc | custom`
（`depth` 仅对 `toc` / `categories` 生效。）

### `profile`
`{ avatar, name, bio, links: [{ name, url, icon }] }`

### `announcement`
`{ title, content, type?: "info"|"warning"|"success"|"error", icon?, closable, link?:{enable,text,url,external} }`

### `post`
```yaml
card:
  cover: { side: "left"|"right", width: "33%", showContent: bool, showDefaultCover: bool }
  titleSize: "text-2xl"        # Tailwind 文本类
showLastModified: true
expressiveCode: { theme: "github-dark" }      # 支持 github-dark / dracula / one-dark …
license: { enable, name: "CC BY-NC-SA 4.0", url }
comment:
  enable: false
  provider:                     # "waline" | "twikoo"，留空自动选择
  waline: { serverURL, lang, pageSize?, reaction?: bool|string[], requiredMeta?: ["nick","mail","link"] }
  twikoo: { envId, region?, lang? }
```

### `footer`
`{ enable, customHtml }` —— 开启后可注入备案号等；配合 `public/FooterConfig.html`。

### `particle`
`{ enable, particleNum, limitTimes(-1=无限), size:{min,max}, opacity:{min,max}, speed:{horizontal:{min,max}, vertical:{min,max}, rotation, fadeSpeed}, zIndex }`

### `musicPlayer`
```yaml
enable: true
mode: "meting" | "local"
meting: { meting_api, server: netease|tencent|kugou|baidu|kuwo,
          type: playlist|album|artist|song|search, id }
local:  { playlist: [{ id, title, artist, cover, url, lrc?, duration }] }
autoplay: true
```

### `pio`（Live2D 看板娘）
`{ enable, models[], position:"left"|"right", width, height, mode:"static"|"fixed"|"draggable", hiddenOnMobile, dialog:{ welcome, touch[], home, skin:[前,后], close, link, custom?:[{selector,type:"read"|"link",text}] } }`

### i18n 语言
`src/i18n/language.ts` 的 `LANGUAGE_CONFIG` 定义 **14 种语言**：`en, zh_hant, zh_hans, ru, de, fr, es, tr, ar, ko, ja, th, vi, id`，每种含 `translateCode / displayName / locale / icon(国旗 emoji)`。
**本地 UI 翻译只有 4 种**：`en`、`zh_hans`、`zh_hant`、`ja`（`localTranslations`），其余语言依赖客户端翻译插件 `src/plugins/translate.js`（640 KB，来自 gitee `mail_osc/translate`）。
`LANGUAGE_REGION_MAP` 处理区域变体（`zh_cn→zh_hans`、`zh_hk/zh_tw→zh_hant`、`en_us/gb/au→en`、`ja_jp→ja`）。
`i18n(key)` → `getTranslation(getResolvedSiteLang())[key]`，找不到时回退英文。

> ⚠️ 文档 README 写「3 种 UI 语言（中/英/日）」，实际代码是 4 种（en + zh_hans + zh_hant + ja）。
>
> ⚠️ **i18n 不是路由前缀式**：实测 `https://twilight.spr-aachen.com/en/` 不存在。语言切换是**客户端翻译 + localStorage**，无 `/en/`、`/zh/` 路径。

---

## 5. 完整功能清单

### 5.1 主题 / 外观
| 功能 | 实现位置 | 备注 |
|---|---|---|
| 明暗主题切换 | `components/navbar/lightDarkSwitch.svelte` + `utils/theme.ts` | `light/dark/system` 三态；`<html class="dark">`；写 `localStorage.theme` |
| 防闪烁内联脚本 | `layouts/base.astro` L196–229 | `<head>` 内同步执行，设置 `.dark`、`--hue`、`data-theme`、`--banner-height-extend` |
| 主题过渡保护 | `main.css` `@utility is-theme-transitioning` | 切换瞬间 `transition:none !important`，避免闪屏 |
| 实时主题色（色相滑块） | `navbar/displaySettings.svelte` + `utils/hue.ts` | 写入 `--hue` 与 `localStorage.hue`；面板内含 `#colorSlider` 与彩虹条 |
| 壁纸三模式 | `fullscreenWallpaper.astro` / `banner.astro` + `utils/wallpaper.ts` | `banner`/`fullscreen`/`none`，运行时可通过 `wallpaperSwitch.svelte` 切换 |
| 壁纸轮播 + Ken Burns | `*.astro` 的 `.carousel-item` | 桌面/移动分别取图（`.desktop-item` / `.mobile-item`） |
| 全屏壁纸透明化 | `body.wallpaper-transparent` + `--card-bg-transparent` | 卡片改半透明 + `backdrop-blur-xs` |
| 加载遮罩 | `loadingOverlay.astro` | 可等待字体/首屏图片解码，带 `maxWait` 超时 |
| 打字机副标题 | `common/typewriterText.astro` | 速度/删除速度/停顿可配 |
| 横幅水波纹 | `banner.astro` 的 `#header-waves`（SVG） | `performanceMode` 可降级 |
| 粒子特效 | `utils/particle.ts` + `public/assets/images/particle.png` | 数量/尺寸/透明度/速度/层级全可配 |
| Live2D 看板娘 | `components/pio.svelte` + `public/pio/**` | 三种展现模式、换装、触摸对话、移动端可隐藏 |
| 自定义字体 | `fontLoader.astro` | 支持 CSS 链接或本地文件；代码字体用 JetBrains Mono Variable |
| 页面过渡动画 | `@swup/astro` + `styles/transition.css` | `animationClass: "transition-swup-"`，`onload-animation-up/down` |
| 返回顶部 / 浮动 TOC | `back2TopButton.astro` / `tocButton.astro` | 右下角浮动按钮 |

### 5.2 内容与检索
| 功能 | 实现 | 备注 |
|---|---|---|
| 全文搜索 | **Pagefind** | `pagefind.yml` + `scripts/build-with-pagefind.cjs`；前端 `navbar/search.svelte` 调 `window.pagefind.search(keyword)`；开发环境用 mock 数据 |
| Pagefind 标注 | post 页 | 标题 `data-pagefind-body data-pagefind-weight="10" data-pagefind-meta="title"`；锚点 `#` 图标 `data-pagefind-ignore` |
| 分页 | `[...page].astro` + `pagination.astro` | 每页 8 篇 |
| 置顶 | `utils/post.ts` | 先按 `pinned` 再按 `published` 倒序 |
| 归档 + 分类/标签筛选 | `archive.astro` + `archivePanel.svelte` | 查询参数 `?category=` / `?tag=` / `?uncategorized=true`；**无独立 tags/categories 路由** |
| 嵌套分类树 | `utils/category.ts` | `CATEGORY_SEPARATOR = " / "`，支持无限层 |
| 侧栏目录树 | `sidebar/directoryTree.svelte` + `utils/directory.ts` | 用 `directoryTitle` 覆盖显示名 |
| 文章目录 TOC | `sidebar/toc.ts`（16 KB）+ `toc.astro` | 三端复用（left/right/middle），可配 `depth` 1–6 |
| 上一篇 / 下一篇 | `utils/post.ts` 回填 `prevSlug/nextSlug` + `[...slug].astro` | 按排序序号相邻 |
| 字数 / 阅读时长 | `plugins/remark-reading-time.mjs` → `remarkPluginFrontmatter.words/minutes` | 用 `reading-time`，i18n 单复数 |
| 阅读进度条 | **未发现** | 见 §9 未验证 |
| 相关文章 | **未发现** | 无 related posts 实现 |
| RSS 2.0 | `pages/rss.xml.ts` | markdown-it 渲染 + `sanitize-html`；自动修正相对图片路径为构建后 `_astro` URL；排除 `encrypted` 文章 |
| Atom 1.0 | `pages/atom.xml.ts` | 同上 |
| 订阅说明页 | `pages/rss.astro` / `atom.astro` | 含「什么是 RSS」科普 + 一键复制链接 |
| Sitemap | `@astrojs/sitemap` | `/sitemap-index.xml` → `/sitemap-0.xml` |
| robots.txt | `pages/robots.txt.ts` | `Disallow: /_astro/` + Sitemap 指向 |
| `llms.txt` | **不存在** | 实测 404 |
| PWA / Service Worker | **不存在** | 无 manifest、无 SW |

### 5.3 Markdown 增强
- **KaTeX 数学**：`remark-math` + `rehype-katex`，支持 `$...$` / `$$...$$`
- **Mermaid 图表**：``` ```mermaid ``` → `remark-mermaid` + `rehype-mermaid` + `mermaid-render-script.js`
- **提示块 / Callouts**：`:::note / :::tip / :::important / :::warning / :::caution`（`rehype-callouts` theme `github` + 自定义 `rehype-admonitions`）
- **隐藏文本**：`:spoiler[文字]`（`main.css` 有 `--_spoiler-mask`）
- **代码块**：Expressive Code，含**复制按钮**（`copy-button.ts`）、**折叠**（`collapse-button.ts` + `pluginCollapsibleSections`）、**行号**（`pluginLineNumbers`）、**语言角标**（`language-badge.ts`）；`wrap: true`，`shellsession` 关闭行号
- **GitHub 仓库卡片**：`::github{repo="Owner/Repo"}` → `rehype-component-github-card.mjs`
- **音乐卡片**：`::music{...}` → `rehype-component-music-card.mjs`（16 KB，内联播放器 + 歌词）
- **自定义指令**：`remark-directive` + `remark-directive-rehype`
- **标题锚点**：`rehype-autolink-headings` + `rehype-slug`
- **图片懒加载 / 灯箱**：`rehype-lazy-load-media.mjs` + `@fancyapps/ui`（`utils/fancybox.ts`、`styles/fancybox.css`）
- **章节化**：`remark-sectionize`（用于 TOC 与锚点高亮）
- **摘要**：`remark-excerpt`

### 5.4 内容页面（超出常规博客的部分）
- **Projects**：卡片画廊，按 `category` / `status` / 技术栈筛选，含统计概览
- **Skills**：技能卡片 + 等级/分类分布图
- **Timeline**：教育/工作/项目/成就时间线，含年限统计
- **Diary**：短文字「说说」流，相对时间（x 分钟/小时/天前），支持多图
- **Albums**：相册列表 + 详情页，`grid`/`masonry`/`list` 三种布局，`columns` 1–6，Fancybox 灯箱
- **Anime**：番剧列表，接 **Bangumi API**（`site.bangumi.userId`），状态/年份/评分
- **Friends**：友链墙（图标 + 描述 + 标签）
- **About**：`src/content/about.md` 单页
- **归档页**：全部文章按年/月分组
- **404 页**：`404.astro`，超大主色 `404` + 图标 + 返回首页按钮

### 5.5 交互与其它
- **站内翻译器**：`navbar/translator.svelte` + `plugins/translate.js`，14 种目标语言，可忽略指定 class/tag
- **显示设置面板**：`displaySettings.svelte`（色相 + 主题 + 壁纸模式集中）
- **移动端抽屉菜单**：`navMenu.svelte`（`#nav-menu-panel`）
- **背景音乐播放器**：`musicPlayer.svelte`（35 KB）—— meting API 或本地歌单、歌词滚动、进度/音量、播放列表、迷你「球」形态与展开卡片、自动播放被拦截的降级提示（`musicAutoplayBlocked`）
- **统计挂件**：`sidebar/statistics.svelte`（24 KB）—— **ECharts 6** 热力图 + 雷达图，带时间尺度切换下拉；数据源为 **Umami API**（`utils/analytics.ts`）
- **评论**：**Waline** 与 **Twikoo** 二选一（`components/comment/{waline,twikoo}.astro`）；Twikoo 资源本地化在 `public/assets/js/twikoo.all.min.js`，样式 `public/assets/css/twikoo.css`
- **文章加密**：`common/passwordProtection.astro`，frontmatter `encrypted` + `password`，**客户端 AES**（`crypto-js`），含解锁/失败/重试等完整 i18n 状态
- **复制保护**：`copyProtection.astro`，四个独立开关（禁用选中 / 剪贴板 / 右键 / DevTools）
- **许可证卡片**：`post/license.astro`，支持 `licenseName` / `licenseUrl` 与全局默认
- **最后编辑卡片**：`showLastModified`，用 `updated || published`，客户端按语言渲染相对时间
- **JSON-LD**：post 页注入 `BlogPosting` 结构化数据（含 headline / keywords / author / datePublished / inLanguage）
- **SEO / OpenGraph**：`og:site_name`、`og:url`、`og:title`、`og:description`、`og:type`（文章为 `article`）、`og:image`（可选）、`twitter:card=summary_large_image`
- **动态 OG 图**：`pages/og/[...slug].png.ts` 用 **satori** 生成（需 `generateOgImages: true`）
- **页脚**：`footer.astro`，虚线上边框 + 版权年份（`#copyright-year`）+ 社交链接 + 可选 HTML 注入
- **CDN / 缓存头**：`vercel.json` 与 `public/_headers` 为 `/_astro/`、`/assets/`、`/favicon/`、`/pio/` 设 `max-age=31536000, immutable`；安全头 `X-Content-Type-Options` / `X-Frame-Options: DENY` / `X-XSS-Protection` / `Referrer-Policy`

---

## 6. CMS / 后台管理

Twilight 提供**两套并存、互不冲突**的后台方案。

### 6.1 方案 A：Decap CMS（主推，含 OAuth）

**配置文件**：根目录 `.decap.yml`（15.6 KB，**不是** `public/admin/config.yml`）

**接入方式**：`astro.config.mjs` 中

```js
import decapCmsOauth from "decap-cms-oauth-astro";
decapCmsOauth({
  configPath: "./.decap.yml",   // Decap CMS 配置路径
  decapCMSVersion: "3.9.0",
  enable: false,                // 设为 true 才启用 OAuth（需 .env）
})
```

该集成（`decap-cms-oauth-astro@^0.1.3`，Spr-Aachen fork 自 `dorukgezici/astro-decap-cms-oauth`）自动注入三个路由：

| 路由 | 作用 |
|---|---|
| `/admin` | Decap CMS 仪表盘 HTML |
| `/oauth` | OAuth 登录入口 |
| `/oauth/callback` | OAuth 回调 |

集成可选项与默认值：
```ts
{ decapCMSSrcUrl: "", decapCMSVersion: "3.3.3", adminDisabled: false,
  adminRoute: "/admin", oauthDisabled: false,
  oauthLoginRoute: "/oauth", oauthCallbackRoute: "/oauth/callback" }
```
> 若设置 `decapCMSSrcUrl`（或 `PUBLIC_DECAP_CMS_SRC_URL`），则可换成 **Sveltia CMS**：`https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js`。此时 `decapCMSVersion` 被忽略。

**线上 `/admin/` 实测 HTML 关键行**（已核对，可作复刻目标）：

```html
<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url">
<title>Content Manager</title>
<meta name="robots" content="noindex">
<script src="https://unpkg.com/decap-cms@^3.9.0/dist/decap-cms.js"></script>
```

`/admin/config.yml` 由集成在构建期从 `.decap.yml` 生成 —— 实测其内容与仓库 `.decap.yml` 一致（`backend.name: github`、`repo: Spr-Aachen/Twilight` 等）。

**`.decap.yml` 结构**

```yaml
backend:
  name: github
  repo: <owner>/<repo>
  branch: main
  site_domain: <your-domain>
  base_url: https://<your-domain>
  auth_endpoint: oauth          # 由集成提供的路由
locale: en
media_folder: "public/assets/images"
public_folder: "/assets/images"
collections: [ ... ]
editor: { preview: true }
```

**collections 一览（9 个）**

| name | label | folder / file | 格式 | 关键字段 |
|---|---|---|---|---|
| `posts` | Posts | `src/content/posts` | md | `title, published, updated, description, cover(image), tags(list), category(string), draft(bool), body(markdown)`；`nested.depth: 10`、`subfolders: false`、`meta.path.index_file: _index`、`slug: {{slug}}` |
| `diary` | Diary | `src/content/diary` | json | `path: {{slug}}/{{slug}}`，`slug: {{year}}-{{month}}-{{day}}-{{hour}}-{{minute}}`；字段 `title, content, date, images(list of image)` |
| `albums` | Albums | `src/content/albums` | json | `title, description, cover, date, location, tags, layout(select grid/masonry/list), columns(number 1-6), photos(list{src,alt,title,description,tags,date}), visible` |
| `projects` | Projects | `src/content/projects` | json | `title, description, image, category(select), techStack(list), status(select), liveDemo, sourceCode, startDate, endDate, featured, tags` |
| `skills` | Skills | `src/content/skills` | json | `name, description, icon, category(select), level(select), experience{object years,months}, projects, certifications, color` |
| `timeline` | Timeline | `src/content/timeline` | json | `title, description, type(select), startDate, endDate, location, organization, position, skills, achievements, links(list{name,url,type}), icon, color` |
| `friends` | Friends | `src/content/friends` | json | `title, imgurl, desc, siteurl, tags` |
| `page_friends` | Friends Page | `src/content/friends.md` | file | `body(markdown)` |
| `page_about` | About Page | `src/content/about.md` | file | `body(markdown)` |

### 6.2 方案 B：Pages CMS（零 OAuth）

配置文件：根目录 `.pages.yml`。使用流程（文档原文）：访问 [app.pagescms.org](https://app.pagescms.org) → `Install GitHub App` → `Install` → 找到仓库 `Open`。
结构为 `media[]`（5 个媒体目录，含 `input`/`output` 映射）+ `content[]`（与 Decap 对应的 collection/file 定义，frontmatter 用 `type: rich-text` 而非 `widget: markdown`）。
上游 PR #114 标题即「Non-breaking PagesCMS support」。

### 6.3 OAuth 认证流程（Decap 路线）

1. **创建 GitHub OAuth App**：GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL：站点生产 URL
   - **Authorization callback URL：`https://<你的域名>/oauth/callback`**
2. Generate a new client secret
3. 写 `.env`：
   ```env
   OAUTH_GITHUB_CLIENT_ID=...
   OAUTH_GITHUB_CLIENT_SECRET=...
   ```
   （该文件已被 `.gitignore` 忽略；仓库内 `.env` 仅含两个空键作为模板）
4. 把 `astro.config.mjs` 中 `decapCmsOauth({ enable: false })` 改为 `true`
5. 更新 `.decap.yml` 的 `repo` / `branch` / `site_domain` / `base_url`
6. 推送到 GitHub，**部署到支持 SSR 的平台**并把 `.env` 内容导入平台环境变量
7. 访问 `https://<你的域名>/admin` 进入后台

> 也可用 GitHub **App** 代替 OAuth App，此时额外需要 `OAUTH_GITHUB_REPO_ID`，权限选 `content:write`。

**已明确记录的部署硬要求**：
- 后台功能**依赖 SSR**（`enable: true` 时不能用纯静态托管 / GitHub Pages）
- `.env` 必须在**部署前**导入平台环境变量
- README 中文版警告：「经用户反馈，目前包括 ESA 在内的部分平台无法正常使用后台功能，请尽量选择 GitHub, Cloudflare, Netlify, Vercel 等推荐部署的平台」
- 文档「故障排除」列出的三类问题：OAuth 认证失败（Client ID/Secret、回调 URL）、无法访问后台（环境变量未导入、平台不支持 SSR）、内容保存失败（仓库权限、分支名）

> 实测澄清：demo 站 `https://twilight.spr-aachen.com/admin/` 返回 **200**（后台 HTML 正常），而 `/oauth` 不可用 —— 与 `enable: false` 的语义一致：**`enable` 只控制 OAuth 路由，`/admin` 路由仍会被注入**。

---

## 7. 部署指引

### 7.1 构建产物与环境变量

| 项 | 值 |
|---|---|
| 安装命令 | `pnpm install` |
| 构建命令 | `pnpm build`（= `node scripts/generate-icons.js && node scripts/build-with-pagefind.cjs`）<br>文档另写 `astro build` / `npm run build` |
| 输出目录 | `dist`（**Vercel 例外：`.vercel/output/static`**） |
| 开发端口 | `http://localhost:4321` |
| 环境变量 | `OAUTH_GITHUB_CLIENT_ID`、`OAUTH_GITHUB_CLIENT_SECRET`（`OAUTH_GITHUB_REPO_ID` 仅 GitHub App）；`UMAMI_API_KEY`、`UMAMI_TRACKING_CODE`（`src/config.ts` 中作为 `analytics.umami.apiKey/code` 的兜底）；`PUBLIC_DECAP_CMS_SRC_URL`、`PUBLIC_DECAP_CMS_VERSION` |
| 平台探测变量 | `GITHUB_ACTIONS`、`CF_PAGES`、`NETLIFY`、`EDGEONE`、`VERCEL` |

**Adapter 自动选择**（`astro.config.mjs`，照抄即可复刻）：

```js
const adapter = process.env.GITHUB_ACTIONS
  ? undefined                                   // GitHub Pages 纯静态
  : (process.env.CF_PAGES   ? cloudflarePages()
  : (process.env.NETLIFY    ? netlify()
  : (process.env.EDGEONE    ? edgeone()
  :                            vercel({ mode: "serverless" }) )));
```

**Pagefind 输出目录同理自动推导**（`scripts/build-with-pagefind.cjs`）：

```js
{ default:'dist', github:'dist', cloudflare:'dist', netlify:'dist',
  edgeone:'dist', vercel:'.vercel/output/static' }
```

### 7.2 各平台要点（摘自官方文档）

- **GitHub Pages**：仓库 `Settings → Pages → Build and deployment → Source = GitHub Actions`；内置 workflow 在 push 到 `main` 时触发；自定义域名改 `public/CNAME` 并加 `<用户名>.github.io` 的 CNAME 记录。→ **无 SSR，后台 OAuth 不可用**
- **Cloudflare Pages**：`Workers and Pages → Create application → Pages → Import an existing Git repository`；构建命令 `astro build` 或 `npm run build`，输出 `dist`；需要后台则把 `.env` 导入环境变量
- **Netlify**：`Add a new site → Import an existing project`，参数同上
- **Vercel**：直接导入项目；`vercel.json` 已内置 build/output/headers/`cleanUrls`
- **自建服务器**：`npm run build` → 压缩 `dist` → 上传 → Nginx/Apache 静态托管
- **Docker**：多阶段 `node:lts-alpine` 构建 → `nginx:alpine` 提供；`docker-compose.yml` 映射 `127.0.0.1:8070:80`
- **EdgeOne Pages（腾讯）**：`esa.jsonc` 定义 `installCommand`/`buildCommand`/`assets.directory: ./dist`、`notFoundStrategy: singlePageApplication`

### 7.3 CI 细节

`.github/workflows/deploy.yml`：`actions/checkout@v7` + `withastro/action@v6`（自动探测 pnpm 与构建命令，注释里默认 node-version 24）+ `actions/deploy-pages@v5`；权限 `contents:read, pages:write, id-token:write`。
另有 `dependabot.yml` 与 `dependabot-conflict-closer.yml`。

### 7.4 迁移文档

`Twilight-Docs` 的 `docs/zh/4.transfer/` 提供 10 篇迁移指南：Gridea 导入、Halo、Hexo、HTML 导入、Hugo、Jekyll、Markdown 导入、Typecho、WordPress、Z-Blog。（英文镜像下**无** `4.transfer` 目录。）

---

## 8. 视觉风格 / 设计语言

### 8.1 设计令牌

**Tailwind v4 `@theme`（注意断点被改写，非 Tailwind 默认值）**

```css
@theme {
  --breakpoint-sm: 512px;    /* 默认 640 */
  --breakpoint-md: 768px;
  --breakpoint-lg: 1280px;   /* 默认 1024 */
  --breakpoint-xl: 1920px;   /* 默认 1280 */
  --transition-duration-300: 300ms;
  --transition-duration-600: 600ms;
}
@custom-variant dark (&:is(.dark *));
```

`src/constants/breakpoints.ts` 在运行时从 CSS 变量 `--breakpoint-*` 反读这些值（fallback 512/768/1280/1920）。

**尺寸**

```
--radius-large: 1rem
侧栏宽: 17.5rem（每侧）
PAGE_WIDTH: 90rem
NAVBAR_HEIGHT: 72px
```

### 8.2 配色系统 —— **一切由单一 `--hue` 派生**

这是 Twilight（继承自 Fuwari）最核心的视觉特征：整个调色板是 `oklch(L C var(--hue))` 的函数，用户拖动色相滑块即可换肤。

```stylus
define({
  --primary:        oklch(0.70 0.14 var(--hue))  oklch(0.75 0.14 var(--hue))
  --page-bg:        oklch(0.95 0.01 var(--hue))  oklch(0.16 0.014 var(--hue))
  --card-bg:        white                        oklch(0.23 0.015 var(--hue))
  --card-bg-transparent: rgba(255,255,255,.8)    rgba(23,23,23,.8)
  --btn-content:    oklch(0.55 0.12 var(--hue))  oklch(0.75 0.1  var(--hue))
  --btn-regular-bg: oklch(0.95 0.025 var(--hue)) oklch(0.33 0.035 var(--hue))
  --btn-regular-bg-hover:  oklch(0.9 0.05 var(--hue))  oklch(0.38 0.04 var(--hue))
  --btn-regular-bg-active: oklch(0.85 0.08 var(--hue)) oklch(0.43 0.045 var(--hue))
  --btn-plain-bg-hover:    oklch(0.95 0.025 var(--hue)) oklch(0.30 0.035 var(--hue))
  --btn-plain-bg-active:   oklch(0.98 0.01 var(--hue))  oklch(0.27 0.025 var(--hue))
  --btn-card-bg-hover:     oklch(0.98 0.005 var(--hue)) oklch(0.3 0.03 var(--hue))
  --btn-card-bg-active:    oklch(0.9 0.03 var(--hue))   oklch(0.35 0.035 var(--hue))
  --deep-text:      oklch(0.25 0.02 var(--hue))
  --title-active:   oklch(0.6 0.1 var(--hue))
  --line-divider:   black(0.08)   white(0.08)
  --line-color:     black(0.1)    white(0.1)
  --meta-divider:   black(0.2)    white(0.2)
  --content-meta:   black(0.6)    white(0.6)
  --inline-code-bg: var(--btn-regular-bg)
  --inline-code-color: var(--btn-content)
  --selection-bg:   oklch(0.90 0.05 var(--hue)) oklch(0.40 0.08 var(--hue))
  --codeblock-selection: oklch(0.90 0.06 var(--hue)) oklch(0.45 0.06 var(--hue))
  --codeblock-bg:   oklch(0.96 0.015 var(--hue)) oklch(0.18 0.015 var(--hue))
  --codeblock-topbar-bg: oklch(0.93 0.03 var(--hue)) oklch(0.12 0.015 var(--hue))
  --license-block-bg: black(0.03) var(--codeblock-bg)
  --link-underline: oklch(0.93 0.04 var(--hue)) oklch(0.40 0.08 var(--hue))
  --link-hover:     oklch(0.95 0.025 var(--hue)) oklch(0.40 0.08 var(--hue))
  --link-active:    oklch(0.90 0.05 var(--hue)) oklch(0.35 0.07 var(--hue))
  --float-panel-bg: white oklch(0.19 0.015 var(--hue))
  --scrollbar-bg / -hover / -active          // 依赖明暗
  --color-selection-bar: rainbow-light rainbow-dark
  --admonitions-color-{tip,note,important,warning,caution}   // 固定色相 180/250/310/60/25
  --toc-badge-bg / --toc-btn-hover / --toc-btn-active / --toc-item-active
  --toc-width: calc((100vw - var(--page-width)) / 2 - 1rem)
  --display-light-icon: 1 0 ;  --display-dark-icon: 0 1
})
:root      { --radius-large: 1rem }
```

选择器约定：**亮色 = `:root`，暗色 = `:root.dark`**（注意不是 `:root[data-theme=dark]`）。`data-theme` 属性另作他用 —— 它给 Expressive Code 用，取值为 `github-light` / `github-dark`。

`rainbow-light = linear-gradient(to right, oklch(0.80 0.10 0), … 每 30° … 360)`；`rainbow-dark` 同构，明度改 0.70。

### 8.3 字体

- 代码：`'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`（字号 `0.875rem`，行高 `1.5rem`）
- 正文：由 `site.font` 配置注入（demo 用 Zen Maru Gothic，通过 Google Fonts CSS 链接）；`<head>` 内 preconnect 到 `fonts.googleapis.com` / `fonts.gstatic.com` / `code.iconify.design`

### 8.4 布局结构

**三栏网格**（同一套 HTML 适配桌面/移动，靠 CSS grid 类切换）：

```html
<body class="min-h-screen is-home enable-banner">
  <div id="loading-overlay">…</div>
  <div id="config-carrier">                       <!-- 把配置传给客户端 JS 的载体 -->
  <div class="top-gradient-highlight">
  <div id="top-row">                              <!-- 导航栏层 -->
    <div id="navbar-wrapper"><div id="navbar">…</div></div>
  </div>
  <div id="fullscreen-wallpaper-wrapper">…</div>  <!-- 全屏壁纸模式 -->
  <div id="banner-wrapper"><div id="banner-carousel">…</div>
       <div class="banner-text-overlay"><h1 class="banner-title"></h1>
            <h2 class="banner-subtitle"><span class="typewriter"></span></h2></div>
       <div id="header-waves">…SVG…</div>
  </div>
  <div id="main-grid"
       class="grid grid-cols-1
              md:grid-cols-[17.5rem_1fr]
              lg:grid-cols-[17.5rem_1fr_17.5rem]">
    <div id="left-sidebar">…<div id="sidebar-sticky">widgets…</div></div>
    <main id="swup-container">
      <div id="grid-class-carrier">
        <div id="content-wrapper">…页面内容…</div>
        <div class="footer col-span-2">…</div>
      </div>
    </main>
    <div id="right-sidebar">…<div id="sidebar-sticky">widgets…</div></div>
    <div id="middle-sidebar">…</div>              <!-- 移动端专用单列 -->
  </div>
  <div class="toc-floating-container">…</div>
  <div class="back-to-top-wrapper"><button id="back-to-top-btn">…</button></div>
  <div class="music-player fixed bottom-4 right-4">…</div>
  <div id="page-height-extend" class="hidden h-[300vh]"></div>
</body>
```

要点：
- 侧栏宽度 **17.5rem**；`md`（768px）起显示左栏，`lg`（1280px）起显示左+右栏
- 侧栏挂件统一包在自定义元素 `<widget-layout id="<type>-<side>">` 内，id 形如 `#directory-left`、`#toc-wrapper-right`、`#statistics-middle`、`#profile-right`、`#announcement-left`、`#categories-middle`、`#tags-left`
- 挂件按 `position: top | sticky` 分两组，sticky 组用 `sticky top-[calc(var(--sidebar-top)-var(--main-content-top))]`
- `body.class` 动态切换：`is-home`、`enable-banner`、`wallpaper-transparent`、`mobile-no-sidebar`、`mobile-both-sidebar`
- Swup 接收者是 `#swup-container` 与三个 `#*-sidebar`
- 卡片基类：`.card-base` = `rounded-(--radius-large) overflow-hidden bg-(--card-bg) transition-colors duration-150`
- 浮动面板基类：`.float-panel` = `bg-(--float-panel-bg) rounded-(--radius-large) shadow-xl dark:shadow-none border border-black/5 dark:border-white/10 py-2 min-w-48`
- 按钮基类：`.btn-regular`（实心）/ `.btn-plain`（幽灵）/ `.btn-card`，均含 `active:scale-95` 类微交互

**首页内容流**：加载遮罩 → 壁纸/横幅（标题 + 打字机副标题 + 波浪）→ 导航栏（滚动后从透明变为实底）→ 左栏（目录树/分类/标签）→ 主区文章卡片列表（每张 30ms 递增 `animation-delay`）→ 分页 → 页脚。**首页没有独立 hero 区块**，横幅即 hero；也没有「精选文章」区块 —— 靠 `pinned` 置顶实现。

**文章卡片**（`post/postCard.astro`）：左/右封面（宽 `33%`，`side` 可配）+ 标题（`titleSize`）+ 摘要 + `postMeta`（日期 / 更新日期 / 分类面包屑 / 标签）；无封面时可显示默认封面（`showDefaultCover`）。

**文章页结构**（`#post-container.card-base`）：

```
[字数 + 阅读时长]                    ← material-symbols 图标 + 数字
[标题]  text-3xl，左侧 1px 主色竖条（md:before:w-1 before:bg-(--primary)）
[PostMetadata]  日期 / 更新日期 / 分类面包屑 / 标签
[虚线分隔]  border-(--line-divider) border-dashed
[封面]  仅当 coverInContent = true（或 cover 为空时显示分隔线）
[PasswordProtection 包裹]
  [Markdown 正文]  .prose.custom-md.markdown
  [License 卡片]   仅当 postConfig.license.enable
[Comment]                         ← 评论在卡片之外
[Last Modified 卡片]              仅当 showLastModified
[上一篇 / 下一篇]
```

TOC 出现在三个位置（left / right / middle）之一，由 `utils/widget.ts` 的 `widgetManager.getGridLayout()` 按布局与当前路径决定；移动端还有浮动 TOC 按钮（`.toc-floating-btn` + `.toc-floating-panel`）。

### 8.5 动效

| 名称 | 用途 |
|---|---|
| `onload-animation-up` / `onload-animation-down` | 元素入场（上/下滑入 + 淡入），配合内联 `animation-delay` 做逐项错峰 |
| `transition-swup-fade` | Swup 页面切换淡入淡出 |
| `scale-animation` | 按钮点击缩放 |
| `is-theme-transitioning` | 明暗切换瞬间全局禁用过渡 |
| Ken Burns | 壁纸轮播缓慢缩放 |
| 粒子 | canvas 粒子飘落/飘动 |
| 波浪 | 横幅底部 SVG 波浪，随主题色同步（`#header-waves svg use { fill: currentColor }`） |
| 打字机 | `typewriterText.astro` |
| 时长/缓动常量 | 见 §3.5 `transitions.ts` |

---

## 9. 「必须是 Twilight」的辨识特征（vs 通用 Astro 博客）

按辨识度从强到弱：

1. **单一 `--hue` 驱动全站 oklch 调色板 + 导航栏实时色相滑块**。这是最强指纹：任何 Twilight 站都能拖出色相条换肤，且 `oklch(0.70 0.14 var(--hue))` 之类的公式出现在 CSS 里。
2. **`/admin` 后台 + GitHub OAuth（`/oauth`、`/oauth/callback`）内置**，配置文件放在**根目录 `.decap.yml`**（而非 `public/admin/config.yml`）。这是"支持后台管理的静态博客模板"这一卖点的实现核心。
3. **三栏 17.5rem 网格 + 可配置挂件系统**：`widget-layout` 自定义元素、`left/right` 双栏、`position: top|sticky`、`visibility.mode: include|exclude` + 正则路径、`responsive.collapseThreshold`。
4. **banner 模式的双段式高度**：`BANNER_HEIGHT 30vh + BANNER_HEIGHT_EXTEND 36vh`（首页合计 66vh），并用 JS 把 `--banner-height-extend` 吸附到 4 的倍数「避免文字模糊」。
5. **首页靠 `pinned` 置顶而非精选区块**；文章卡片封面固定 `33%` 宽、可左可右。
6. **归档页承担所有分类/标签筛选**（`/archive/?category=`、`?tag=`、`?uncategorized=true`），**没有** `/tags/`、`/categories/` 独立路由。
7. **嵌套分类**（`category: [A, B]` 或 YAML 嵌套映射，以 `" / "` 连接）。
8. **富页面全家桶**：Projects / Skills / Timeline / Diary / Albums / Anime / Friends —— 尤其 **Anime 页接 Bangumi API**、**Diary 是 JSON 短文字流**、**Albums 有 grid/masonry/list 三布局**。
9. **Live2D 看板娘（PIO）** 与**右下角音乐播放器「球」**（meting API 或本地歌单 + 滚动歌词）。
10. **四种 Markdown 专有语法**：`::github{repo="…"}`、`::music{…}`、`:::note/tip/important/warning/caution`、`:spoiler[…]`。
11. **文章级 AES 密码加密**（`encrypted` + `password`）与**四开关复制保护**（`copyProtection.*`）。
12. **Expressive Code 三件套自研插件**：折叠按钮、复制按钮、语言角标，且 `themeCSSSelector` 绑到 `[data-theme="github-dark|github-light"]`。
13. **Umami 统计 + ECharts 热力图/雷达图侧栏挂件**。
14. **站内客户端翻译器**（14 种目标语言，可忽略指定 class/tag），而非路由级 i18n。
15. **构建期图标内联**：`scripts/generate-icons.js` 扫描 `icon="prefix:name"` 从 `@iconify-json/*` 生成 `src/utils/icons.ts`，避免运行时图标请求。
16. **`twilight.config.yaml` 作为唯一配置入口**（而非 `src/config.ts` 写死常量）—— 这是相对 Fuwari 的明显重构。

---

## 不确定 / 未验证的点

以下内容**本次未能完全确认**，重建前建议二次核对：

### 高优先级（会影响复刻正确性）
1. **`src/pages/posts/[...slug].astro` 的上一篇/下一篇区段**：已确认使用 `entry.data.nextTitle`（L354）与 `entry.data.prevTitle`（L373），但未逐行读取该区块的完整 DOM/样式。
2. **`src/components/sidebar/toc.ts`（16 KB）内部算法**：仅知它被 left/right/middle 三处复用、支持 `depth`、使用 `#front-matter-of-posts` 形式的 section id（来自 `rehype-slug` + `remark-sectionize`）。滚动高亮、折叠、`toc-hide` 类的具体触发条件未读。
3. **`src/components/sidebar/statistics.svelte`（24 KB）**：从线上 DOM 确认使用 ECharts 渲染 `heatmap-section` 与两个 `radar-section`，带时间尺度下拉（`time-scale-select`）和 loading 遮罩；但具体取哪些 Umami 指标、雷达图维度未确认。
4. **`src/components/musicPlayer.svelte`（35 KB）**：仅从 DOM 确认 orb/expanded 双态、歌词容器、进度条、音量、播放列表、meting↔local 切换。播放列表解析、歌词 LRC 解析细节未读。
5. **`src/components/common/passwordProtection.astro` 的 AES 具体方案**：确认使用 `crypto-js` 且为客户端解密，但**密钥派生方式、加密发生在构建期还是运行期、密文存放位置均未确认**。
6. **`src/pages/og/[...slug].png.ts`（13 KB）的 satori 模板**：仅知存在且由 `site.generateOgImages` 控制，未读具体排版与字体加载方式。
7. **`src/utils/widget.ts`（17 KB）的 `widgetManager.getGridLayout()`**：已知它接受 `(headings, pathname)` 并返回 `gridCols` 及各栏 CSS 类；具体布局决策表（何时三栏、何时单栏、何时把 TOC 放 middle）未读。
8. **`pluginCollapseButton` / `pluginCopyButton` / `pluginLanguageBadge` 的实现细节**（三个自研 Expressive Code 插件）未读源码。
9. **`src/plugins/translate.js`（640 KB）**：已知是 gitee `mail_osc/translate` 的产物，确认 `service: "client.edge"`；但该 service 指向哪个翻译端点、离线词典规模未核实。

### 中优先级（配置面细节）
10. **`site.keywords` 与 `themeColor.fixed`**：出现在 `src/types/config.ts` 类型定义与文档文字中，但**未出现在仓库随附的 `twilight.config.yaml`**；`fixed: true` 是否真正生效（禁止访客改色）未验证。
11. **`post.showCoverInContent`**：官方文档 `core.md` 里描述了该全局项，但 `PostConfig` 类型中**没有**它 —— 疑似文档过期，实际只有文章级 `coverInContent`。未 100% 确认。
12. **`site.favicon: []` 为空时的实际行为**：`src/constants/icon.ts` 提供 `defaultFavicons` 双图标（light/dark，均 `96x96`，带 `media="(prefers-color-scheme: …)"`），线上确认已生效；但空数组 → 默认值的回退代码路径未逐行确认。
13. **`inLanguage` 与 `lang` 的实际渲染影响**：`post.lang` 会写入 JSON-LD 的 `inLanguage` 并作为 `<GridLayout lang>` 传入；是否影响 `<html lang>` 或翻译行为未确认。
14. **`routeName` 自定义固定链接**：确认会**额外**生成一条 `/posts/<routeName>/` 路由（即原 slug 路由仍存在，产生内容重复），这看起来是设计如此，但未找到文档说明。是否应加 canonical 未确认。**并且：本次在 `src/layouts/base.astro` 中 grep `canonical` 无任何命中 —— 可能全站都没有 `<link rel="canonical">`。** 这一点值得重点复核，因为它同时影响 SEO 与上面的重复内容问题。

### 低优先级（外部信息）
15. **Fork 对比未完成**。GitHub API 与 `raw.githubusercontent.com` 在调研中途被限流/超时（`403 rate limit exceeded`、连接超时）。已确认的事实仅有：
    - [liangshengmoran/Twilight](https://github.com/liangshengmoran/Twilight) 是 **Spr-Aachen/Twilight 的 fork**（`fork: true`, `parent: Spr-Aachen/Twilight`），默认分支 `main`，最后推送 2025-12-29（**落后于上游 2026-10-07**）。其 jsDelivr 上的 `README.md` 可访问（4494 字节），但**未取回内容**。
    - [fuxikofu/yielu](https://github.com/fuxikofu/yielu) 与 [JAlcocerT/Twilight](https://github.com/JAlcocerT/Twilight) **完全未验证**。仅从搜索索引得知 JAlcocerT/Twilight 的仓库简介写作 "A DecapCMS integrated static astro blog template"，暗示它是一个更早期的、仅含 Decap CMS 的变体（可能是 v1.0 之前的形态）。
    - **未能确认任何 fork 是否包含 `public/admin/config.yml` 或 `public/admin/index.html`。** 上游 `main` 分支**确认没有** `public/admin/` 目录 —— 后台页面由 `decap-cms-oauth-astro` 集成在构建期注入。上游早期版本（v1.0.0，2026-01-16）是否使用过 `public/admin/config.yml` 布局，未验证。
16. **各 release 的完整更新说明（release body）未取回**。GitHub REST API 触发限流、`releases.atom` 超时。因此 §0 的版本号清单准确，但**每个版本的具体改动内容未知**。
17. **`src/content/posts/mermaids.md` 与 `guide/Advanced Customization.md` 全文未读**（后者 4.2 KB，很可能包含大量高级配置说明，建议优先补读）。
18. **`src/i18n/i18nKey.ts` 的精确 key 数量**：已获取完整枚举列表（分类为：加载/导航/文章/统计/公告/评论/统计计数/主题/壁纸/项目/技能/时间线/短文/相册/番剧/友链/RSS/Atom/密码保护/最后编辑/音乐播放器），但未逐个数总数（估约 250 个）。**`series` 是本枚举中唯一无对应 frontmatter 字段的 key**，判定"系列文章"功能**未实现**。
19. **`src/i18n/languages/{en,zh_hans,zh_hant,ja}.ts` 的具体译文**未逐条读取（各约 11–12.7 KB）。重建时需要补齐 en 与 zh_hans 两份。
20. **英文文档镜像的完备性**：`Twilight-Docs` 的 `docs/en/` 只有 7 个 markdown（guide×3、config×3、press README），而 `docs/zh/` 有 21 个（多出 `docs/zh/4.transfer/` 全部 10 篇迁移指南）。即**英文文档不含迁移指南**。已确认，非不确定项，但列出以便你安排内容翻译优先级。

### 搜索工具相关
21. 任务书要求「用 web_search 提取真实片段并引用 URL」。实测 `web_search` 在本环境**只返回 URL 列表、不返回正文片段**（多次中文/英文/site 限定查询均如此）。因此所有实质内容均来自直接抓取，引用的是**原始源地址**而非搜索摘要。搜索结果对**发现文档的 URL 结构**仍有价值，例如正是搜索命中 `docs.twilight.spr-aachen.com/config/cms/#_1-create-a-github-oauth-app` 这一锚点，才促使我改为直接抓取。

---

## 原始抓取素材路径

> 本节列出本次调研**实际发起过请求**的 URL。凡返回非 200 / 超时 / 被限流者均已标注。
> 抓取工具为 PowerShell `Invoke-WebRequest` / `Invoke-RestMethod`（配合 `web_search` 仅用于发现 URL 结构）。

### A. 上游仓库原始文件（`raw.githubusercontent.com/Spr-Aachen/Twilight/main/`）

前缀统一为 `https://raw.githubusercontent.com/Spr-Aachen/Twilight/main/`，以下仅列相对路径：

**根级配置**
```
package.json            README.md               docs/README_ZH.md
twilight.config.yaml    astro.config.mjs        tsconfig.json
svelte.config.js        postcss.config.mjs      pagefind.yml
.npmrc                  .env                    .gitignore
.decap.yml              .pages.yml              _frontmatter.json
vercel.json             docker-compose.yml      Dockerfile
esa.jsonc
```

**src 配置 / 内容模型**
```
src/config.ts
src/content.config.ts
src/types/config.ts
src/i18n/language.ts    src/i18n/translation.ts   src/i18n/i18nKey.ts
src/constants/link-presets.ts  src/constants/layout.ts      src/constants/breakpoints.ts
src/constants/category.ts      src/constants/icon.ts        src/constants/pagination.ts
src/constants/panelTop.ts      src/constants/style.ts       src/constants/transitions.ts
```

**src/utils**
```
src/utils/url.ts  src/utils/category.ts  src/utils/tag.ts  src/utils/post.ts
src/utils/navigation.ts  src/utils/hue.ts  src/utils/theme.ts
```

**src/styles**
```
src/styles/variables.styl   src/styles/main.css
```

**src/pages**
```
src/pages/[...page].astro   src/pages/[...menu].astro   src/pages/robots.txt.ts
src/pages/archive.astro     src/pages/rss.xml.ts        src/pages/posts/[...slug].astro
```

**src/components / layouts**
```
src/layouts/base.astro          src/components/postPage.astro
src/components/post/postMeta.astro   src/components/navbar/search.svelte
```

**src/content 样例**
```
src/content/about.md
src/content/friends.md
src/content/posts/guide/Getting Started.md
src/content/posts/draft.md
src/content/posts/encryption.md
src/content/posts/copy-protection.md
src/content/posts/videos.md
src/content/projects/Twilight/intro.json
src/content/skills/astro.json
src/content/skills/svelte.json
src/content/timeline/first-template-project.json
src/content/friends/astro.json
src/content/diary/example/jsonExample.json
src/content/albums/example/jsonExample.json
```

**scripts / CI / public**
```
scripts/new-post.js   scripts/build-with-pagefind.cjs   scripts/generate-icons.js
.github/workflows/deploy.yml
public/_headers       public/FooterConfig.html
```

### B. 文档源码仓库（`raw.githubusercontent.com/Spr-Aachen/Twilight-Docs/main/`）

```
docs/zh/1.guide/1.intro.md          docs/zh/1.guide/2.get-started.md
docs/zh/2.config/core.md            docs/zh/2.config/cms.md
docs/zh/2.config/content.md         docs/zh/3.press/cms.md
docs/zh/3.press/file.md             docs/zh/3.press/folder.md
```
（`docs/zh/1.guide/3.deployment.md` 内容经渲染页 HTML 抓取，见 D 项；`docs/en/**` 未逐篇抓取，仅通过 Trees API 枚举文件名）

### C. CMS OAuth 集成仓库（`raw.githubusercontent.com/Spr-Aachen/astro-decap-cms-oauth/main/`）

```
package.json   README.md
```

### D. 官方文档站渲染页（HTML 抓取 + 标签剥离）

```
https://docs.twilight.spr-aachen.com/guide/intro/
https://docs.twilight.spr-aachen.com/guide/get-started/
https://docs.twilight.spr-aachen.com/guide/deployment/
```

### E. 线上 Demo 站（HTML / XML / 文本）

```
https://twilight.spr-aachen.com/                              → 200，主页完整 HTML（含 <head> 与 <body> DOM 骨架）
https://twilight.spr-aachen.com/posts/guide/getting-started/   → 200，文章页 DOM 骨架
https://twilight.spr-aachen.com/archive/                       → 200
https://twilight.spr-aachen.com/404                            → 200
https://twilight.spr-aachen.com/admin/                         → 200，Decap CMS 后台 HTML（关键证据）
https://twilight.spr-aachen.com/admin/config.yml               → 200，集成生成的 Decap 配置
https://twilight.spr-aachen.com/admin                           → 308 Permanent Redirect
https://twilight.spr-aachen.com/robots.txt                     → 200
https://twilight.spr-aachen.com/sitemap-index.xml              → 200
https://twilight.spr-aachen.com/sitemap-0.xml                  → 200，21 条 URL（路由表证据）
https://twilight.spr-aachen.com/rss.xml                        → 200
https://twilight.spr-aachen.com/atom.xml                       → 200
https://twilight.spr-aachen.com/llms.txt                       → 失败（连接被意外关闭，佐证无 llms.txt）
https://twilight.spr-aachen.com/oauth                           → 失败（连接被意外关闭，佐证 enable:false）
https://twilight.spr-aachen.com/en/                             → 失败（连接被意外关闭，佐证无 i18n 路径前缀）
```

### F. jsDelivr 备用 CDN（`raw.githubusercontent.com` 中断后的替代通道，全部成功）

```
https://cdn.jsdelivr.net/gh/Spr-Aachen/Twilight@main/src/pages/404.astro
https://cdn.jsdelivr.net/gh/Spr-Aachen/Twilight@main/src/layouts/grid.astro
https://cdn.jsdelivr.net/gh/Spr-Aachen/Twilight@main/src/pages/rss.xml.ts
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/README.md
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/public/admin/config.yml
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/astro.config.mjs
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/package.json
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/pnpm-lock.yaml
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/docs/image/Desktop.jpg
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/_frontmatter.json
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/pagefind.yml
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/src/content.config.ts
https://cdn.jsdelivr.net/gh/liangshengmoran/Twilight@main/src/config.ts
https://cdn.jsdelivr.net/gh/fuxikofu/yielu@main/public/admin/config.yml
https://cdn.jsdelivr.net/gh/fuxikofu/yielu@main/astro.config.mjs
https://cdn.jsdelivr.net/gh/fuxikofu/yielu@main/package.json
https://cdn.jsdelivr.net/gh/JAlcocerT/Twilight@main/public/admin/config.yml
https://cdn.jsdelivr.net/gh/JAlcocerT/Twilight@main/astro.config.mjs
https://cdn.jsdelivr.net/gh/JAlcocerT/Twilight@main/package.json
https://cdn.jsdelivr.net/gh/JAlcocerT/Twilight@main/README.md
```
路径存在性探测（liangshengmoran，均返回 absent）：
```
src/data/projects/example.json   src/content/projects/example.json
bun.lockb                        package-lock.json                twilight.config.yaml
```
jsDelivr 元数据 API（3 个 fork 均返回空，未能取得文件树）：
```
https://data.jsdelivr.com/v1/package/gh/{liangshengmoran/Twilight,fuxikofu/yielu,JAlcocerT/Twilight}
https://data.jsdelivr.com/v1/packages/gh/{同上}@main
```

### G. GitHub REST API（部分被限流）

成功：
```
https://api.github.com/repos/Spr-Aachen/Twilight
https://api.github.com/repos/Spr-Aachen/Twilight/git/trees/main?recursive=1        ← 320 文件全量枚举
https://api.github.com/repos/Spr-Aachen/Twilight/branches
https://api.github.com/repos/Spr-Aachen/Twilight/releases?per_page=10
https://api.github.com/repos/Spr-Aachen/Twilight/tags?per_page=20
https://api.github.com/users/Spr-Aachen/repos?per_page=100&sort=updated
https://api.github.com/repos/Spr-Aachen/Twilight-Docs/git/trees/main?recursive=1
https://api.github.com/repos/Spr-Aachen/astro-decap-cms-oauth/git/trees/main?recursive=1
https://api.github.com/repos/liangshengmoran/Twilight
```
被限流 / 失败：
```
https://api.github.com/repos/Spr-Aachen/Twilight/releases                       → 403 rate limit exceeded
https://api.github.com/repos/liangshengmoran/Twilight/commits?per_page=1&sha=main → 403
https://api.github.com/repos/fuxikofu/yielu                                     → 403
https://api.github.com/repos/JAlcocerT/Twilight                                 → 403
https://github.com/Spr-Aachen/Twilight/releases.atom                            → 超时
https://github.com/Spr-Aachen/Twilight/releases                                 → 连接失败
```

### H. web_search 查询（仅用于发现 URL 结构；本环境不返回正文片段）

```
Twilight Spr-Aachen Astro blog theme github
docs.twilight.spr-aachen.com guide intro 主题介绍
Twilight Spr-Aachen 静态博客模板 支持后台管理 功能特性 暗色模式 搜索
Twilight astro tailwindcss Sveltia CMS 集成 后台管理 config.yml
Twilight 博客模板 目录结构 src content config src/config.ts
twilight.spr-aachen.com demo 首页
What are the features of Twilight Astro blog template by Spr-Aachen?
Twilight 主题介绍 特点 功能 文档 快速开始 安装
docs.twilight.spr-aachen.com guide 快速开始 安装 pnpm
docs.twilight.spr-aachen.com config core 站点配置说明
docs.twilight.spr-aachen.com config cms 后台管理系统配置 GitHub OAuth App
docs.twilight.spr-aachen.com press folder 文件夹方案 文章
```
由搜索结果定位到的关键 URL（随后改为直接抓取）：
```
https://docs.twilight.spr-aachen.com/guide/intro/
https://docs.twilight.spr-aachen.com/guide/get-started/
https://docs.twilight.spr-aachen.com/guide/deployment/
https://docs.twilight.spr-aachen.com/config/core/
https://docs.twilight.spr-aachen.com/config/cms/#_1-create-a-github-oauth-app
https://docs.twilight.spr-aachen.com/config/content/
https://docs.twilight.spr-aachen.com/press/file/
https://docs.twilight.spr-aachen.com/press/folder/
https://docs.twilight.spr-aachen.com/press/cms/
https://docs.twilight.spr-aachen.com/en/
https://docs.twilight.spr-aachen.com/en/guide/intro/
https://docs.twilight.spr-aachen.com/en/config/cms/#_1-create-a-github-oauth-app
https://linux.do/t/topic/1049203            （【开源】Twilight: 静态博客模板）
https://linux.do/t/topic/1470763            （v1.0.0 发布）
https://linux.do/t/topic/1574205            （v1.1.1 发布）
https://linux.do/u/spr-aachen/activity
https://template0.com/item/twilight
```

### I. 本次调研**未**成功取得的内容（对应「不确定」清单）

```
各 release 的 release body 原文                → API 限流 + atom/HTML 均失败（对应第 16 项）
fuxikofu/yielu 的完整 public/admin/config.yml  → 仅取到前 45 行（对应追加报告第 3 节）
liangshengmoran 快照对应的确切 commit/tag       → compare API 不可用（对应追加报告第 3 节）
src/components/sidebar/toc.ts 全文              → 仅由文件体积与线上 DOM 推断
src/components/sidebar/statistics.svelte 全文   → 仅由线上 DOM 推断
src/components/musicPlayer.svelte 全文          → 仅由线上 DOM 推断
src/components/common/passwordProtection.astro  → 未读
src/pages/og/[...slug].png.ts 全文              → 未读
src/utils/widget.ts 全文                        → 未读
src/plugins/translate.js 全文（640 KB）          → 未读
src/i18n/languages/{en,zh_hans,zh_hant,ja}.ts   → 未读
src/content/posts/guide/Advanced Customization.md → 未读
src/content/posts/mermaids.md                   → 未读
src/plugins/expressive-code/{collapse-button,copy-button,language-badge}.ts → 未读
Twilight-Docs 的 docs/en/** 逐篇内容             → 仅经 Trees API 枚举文件名
```

### J. 调研过程中落盘的临时文件

本次调研**未主动写盘**保存原始抓取内容；但 DSH 工具框架在输出过长时自动转存了两个「溢出文件」（由 harness 生成，**非我创建**），内容为线上 Demo 站的 DOM 骨架转储：

```
C:\Users\KazeYouni\AppData\Local\Temp\dsh-spill-9YoN1Z\session-5b4945ff959f\b774fcaf344d-pwsh.txt   (60,390 字节)
    ← 对应：twilight.spr-aachen.com 主页 <body> 完整 DOM 骨架（含 #main-grid 三栏网格、全部挂件 id、音乐播放器、页脚、浮动 TOC/返回顶部）

C:\Users\KazeYouni\AppData\Local\Temp\dsh-spill-9YoN1Z\session-5b4945ff959f\3393a09bdbbb-pwsh.txt   (52,252 字节)
    ← 对应：404.astro / grid.astro / rss.xml.ts 三个文件源码（jsDelivr 抓取，含 GridLayout 全量 props 与 rss.xml.ts 图片路径修正逻辑）
```
同目录下另有本次会话之外产生的 `session-a990b0744845\7bf64951928a-grep.txt`（55,703 字节，非本次调研产物）。

> ⚠️ 上述路径位于系统临时目录，**可能被系统清理**。若需长期留存，建议复制到本 `.research\` 目录下。
