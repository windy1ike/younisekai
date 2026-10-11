# 追加报告：Fork 对比结果 + 架构演进（更新前次报告的 §6、§9 与「不确定」第 15 项）

前次报告发出后，我通过 **jsDelivr 直连文件服务**（`https://cdn.jsdelivr.net/gh/<owner>/<repo>@<branch>/<path>`）绕过了 `raw.githubusercontent.com` 与 GitHub API 的中断，成功完成了 fork 对比。**「不确定」章节第 15 项现已解决**，并且发现了一个对复刻非常关键的架构演进事实。

---

## 1. Fork 对比结论（已验证）

三个 fork **全部使用旧的 `public/admin/config.yml` 布局**，而**上游 `main` 已改为根目录 `.decap.yml`**。三者均无 `public/admin/index.html`（该 HTML 由集成注入）。

| 仓库 | `public/admin/config.yml` | `.decap.yml` | `.pages.yml` | backend | 数据目录 | 媒体目录 |
|---|---|---|---|---|---|---|
| **上游 main** | ❌ 不存在 | ✅ 15.6 KB | ✅ 8.7 KB | `github` + `auth_endpoint: oauth` | `src/content/*` | `public/assets/images` → `/assets/images` |
| liangshengmoran/Twilight | ✅ 6.0 KB | ❌ | ❌ | `github` + `oauth` | **`src/data/{projects,skills,timeline,diary,friends}`** | `public/images` → `/images` |
| fuxikofu/yielu | ✅ 7.5 KB | ❌ | ❌ | `github` + `oauth` | `src/content/posts` + `src/content/projects`（混用） | `public/images` → `/images` |
| JAlcocerT/Twilight | ✅ 1.7 KB | ❌ | ❌ | **`git-gateway`（Netlify Identity）** + `local_backend: true` | `src/content/posts` | `public/images` → `/images` |

**关键澄清（修正一个容易搞错的点）**：这些 fork 里 `public/admin/config.yml` 中的 `auth_endpoint: oauth` 恰恰**证明** `public/admin/config.yml` **就是** `astro-decap-cms-oauth` 集成所读取的配置文件（集成上游 README 原文即「Put your `config.yml` file in `public/admin/config.yml`」）。上游后来在 Spr-Aachen 自己的 fork 里新增了 `configPath` 选项，才把配置文件搬到了根目录 `.decap.yml`。所以：**`/admin` 页面来源始终是集成注入，但配置文件位置发生过迁移。**

**JAlcocerT/Twilight 是异类**：它用 `git-gateway`（Netlify Identity）而非 GitHub OAuth，且 posts frontmatter 沿用 **Fuwari 的字段名** `date` / `image`（而非 Twilight 的 `published` / `cover`），只有一个 `posts` 集合，其余集合在注释里。它自述「Forked from: https://github.com/Spr-Aachen/Twilight」，属于极早期形态，**不建议作为复刻参照**。

---

## 2. 架构演进史（重要 —— 决定你复刻哪一个版本）

`liangshengmoran/Twilight` 的 `package.json` + `src/config.ts` 大小（**13201 字节**）+ `twilight.config.yaml` **缺失**，共同证明它停在**较早期的 v1.x**，并暴露了以下清晰的迁移轨迹：

| 维度 | 早期 v1.x（fork 快照） | 当前 `main`（v1.3.x+） |
|---|---|---|
| **配置入口** | ❌ 无 YAML —— 配置**硬编码在 `src/config.ts`（13.2 KB）** | ✅ **`twilight.config.yaml`（15.5 KB）**，`src/config.ts` 缩为 5.1 KB 的加载器 |
| **Tailwind** | **v3.4.19** + `@astrojs/tailwind` + `postcss-nesting` | **v4.3.3** + `@tailwindcss/vite` + CSS-first `@theme`（无 config.js） |
| **Astro** | `5.16.3` | `5.18.2` |
| **CMS 集成** | `astro-decap-cms-oauth@^0.5.1`（上游 dorukgezici 包） | `decap-cms-oauth-astro@^0.1.3`（Spr-Aachen 自维护 fork，新增 `configPath`） |
| **CMS 配置位置** | `public/admin/config.yml` | 根目录 `.decap.yml` |
| **图片灯箱** | **`photoswipe@^5.4.4`** | **`@fancyapps/ui@^6.1.14`（Fancybox）** |
| **密码保护** | `bcryptjs@^3.0.3` + `crypto-js` | 仅 `crypto-js` |
| **提示块** | `remark-github-admonitions-to-directives` | `rehype-callouts@^2.2.0` |
| **媒体目录** | `public/images` → `/images` | `public/assets/images` → `/assets/images` |
| **散装数据目录** | `src/data/{projects,skills,timeline,diary,friends}` | `src/content/{projects,skills,timeline,diary,friends}` |
| **代码检查** | `lint`/`format` = **Biome 2.2.4** | 已删除（README 中划掉） |
| **构建前置** | `dev: "astro dev"`（无前置） | `dev`/`build` 前均跑 `node scripts/generate-icons.js` |
| 已移除的依赖 | `overlayscrollbars`、`marked`、`@fontsource/roboto` | — |
| 版本更新的依赖 | `katex 0.16.27` / `satori 0.18.3` / `sharp 0.34.5` / `@iconify/svelte 4.2.0` | `0.18.2` / `0.29.0` / `0.35.3` / `5.2.2` |
| 截图存放 | `docs/image/*.jpg` | 移到文档站 `/preview/*.jpg` |
| 包管理器 | `packageManager: pnpm@9.14.4`（**但 README 仍教 `bun install`，属文档滞后**） | 同左，README 已改为 pnpm |

> 与上游 PR 标题可对应起来：**#58「Low-barrier configuration scheme」= `src/config.ts` → `twilight.config.yaml` 的迁移**；**#107「Refactored DecapCMS OAuth integration」= 换用自维护 `decap-cms-oauth-astro` 并搬迁配置到 `.decap.yml`**；**#114「Non-breaking PagesCMS support」= 引入 `.pages.yml`**。

**给复刻的建议**：以**当前 `main`** 为准（YAML 配置 + Tailwind v4 + `.decap.yml`）；若你希望降低实现难度，早期 v1.x 的 **Tailwind v3 + `src/config.ts` 常量**路线更简单，但会失去 `twilight.config.yaml` 这个"低门槛配置"卖点，且与文档、demo 不一致。

---

## 3. 仍需注意的遗留不确定项

- **liangshengmoran 快照对应的确切上游 commit / tag 未知**（无法用 API 比对，已被限流）。从依赖版本推断约在 **v1.1.1～v1.2.3 之间**。其 `src/config.ts` 为 13.2 KB，可作为"配置项全集"的旁证，但**未逐行读取**。
- **各 release（v1.0.0 / v1.1.1 / v1.2.3 / v1.3.5）的 release body 原文仍未取回** —— `releases.atom` 与 `github.com` HTML 均超时，REST API 限流。上述版本演进结论是**从代码差异反推**的，非官方 changelog。
- **fuxikofu/yielu 的完整 config.yml 只取了前 45 行**，其后半段（diary/friends/timeline 集合是否已迁到 `src/content`）未验证。
- 前次报告的其余未验证项（toc.ts 算法、statistics.svelte 指标、musicPlayer 内部、passwordProtection AES 细节、og 图模板、widget.ts 布局决策表、三个自研 Expressive Code 插件、`site.keywords`/`themeColor.fixed`/`post.showCoverInContent` 三个文档-类型不一致处、以及**全站可能缺少 `<link rel="canonical">`**）**状态不变，仍需复核**。

---

## 原始抓取素材路径

> 本节列出本次调研**实际发起过请求**的 URL。凡返回非 200 / 超时 / 被限流者均已标注。
> 抓取工具为 PowerShell `Invoke-WebRequest` / `Invoke-RestMethod`（配合 `web_search` 仅用于发现 URL 结构）。
> 本报告为「追加报告」，对应的主报告见同目录 `twilight-spec.md`。

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
fuxikofu/yielu 的完整 public/admin/config.yml  → 仅取到前 45 行（对应本报告第 3 节）
liangshengmoran 快照对应的确切 commit/tag       → compare API 不可用（对应本报告第 3 节）
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
