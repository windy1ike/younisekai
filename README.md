# KazeYouni's Wonderland

个人博客：写自己的文字和笔记。文章就是磁盘上的 Markdown 文件，没有后台、没有数据库、没有登录。

用 [Astro](https://astro.build) 构建成纯静态站点，可以扔到任何静态托管上（GitHub Pages、Vercel、Netlify、自己的服务器）。

## 功能

- **Markdown 写作** —— 文章是 `src/content/posts/` 下的 `.md` 文件，文件名就是网址
- **frontmatter 校验** —— 字段写错会在构建时直接报错，并指出是哪个文件
- **草稿机制** —— `draft: true` 的文章只在本地预览出现，不会发布
- **标签 / 归档** —— 按标签聚合，按年份归档
- **全文搜索** —— 纯静态实现，构建时生成索引，无需第三方服务
- **深色模式** —— 跟随系统，也可以手动切换（记忆选择）
- **阅读体验** —— 目录导航、阅读进度条、代码高亮与复制按钮、标题锚点、中文排版优化
- **RSS 订阅**、**站点地图**、**404 页面**

## 快速开始

需要 Node.js 20 或更高版本。

```bash
npm install      # 安装依赖
npm run dev      # 启动本地预览，默认 http://localhost:4321
```

改任何文件都会立刻刷新；`Ctrl + C` 停止。

## 写一篇新文章

方式一，用脚本创建（推荐）：

```bash
npm run new -- "文章标题"
npm run new -- "读书笔记" --tags 读书,随笔
npm run new -- "系列文章第一节" --dir notes      # 放进子目录，网址会是 /posts/notes/xxx/
npm run new -- "已经写好的" --publish            # 直接是非草稿
```

方式二，直接在 `src/content/posts/` 里新建 `.md` 文件（下面有模板）。

### frontmatter 字段

每个文件开头用 `---` 包起来的部分：

```yaml
---
title: '文章标题'          # 必填
description: '一句话摘要'   # 选填，列表页/搜索结果用；不写会自动从正文截取
pubDate: 2026-10-10        # 必填，发布日期
updatedDate: 2026-10-12    # 选填，修改日期
tags: ['随笔', '读书']      # 选填，标签
draft: false               # 选填，true = 草稿
---
```

### 草稿怎么工作

| 位置 | `draft: true` 的文章 |
| --- | --- |
| `npm run dev` 列表 / 搜索 | 出现，带「草稿」标记 |
| `npm run build` 正式产物 | 不生成页面，列表、归档、搜索、RSS 里都没有 |
| RSS | 永远不含草稿 |

想临时把草稿也构建出来看看，可以设置环境变量 `BUILD_DRAFTS=1` 再 build。

### 文件名与网址

文件名决定网址：`开始写点东西.md` → `/posts/开始写点东西/`。

- 中文文件名可以直接用，网址里会自动转义
- 文件名里的**英文字母会被转成小写**：`Markdown-排版速查.md` → `/posts/markdown-排版速查/`
- 放进子目录就相当于分类：`posts/notes/读书笔记.md` → `/posts/notes/读书笔记/`
- 别用 `/ \ : * ? " < > |` 这些字符

### 图片

放在 `public/` 目录下，比如 `public/images/photo.jpg`，正文里这样引用：

```markdown
![图片说明](/images/photo.jpg)
```

## 目录结构

```
├─ src/
│  ├─ content/
│  │  ├─ posts/                ← 文章都放这里（含子目录）
│  │  └─ pages/about.md        ← 「关于」页的内容
│  ├─ pages/                   ← 页面路由
│  │  ├─ index.astro           首页
│  │  ├─ posts/[...id].astro   文章详情
│  │  ├─ archive.astro         归档（按年）
│  │  ├─ tags/                 标签总览 / 单个标签
│  │  ├─ search.astro          搜索页
│  │  ├─ about.astro           关于页
│  │  ├─ rss.xml.js            RSS
│  │  └─ search.json.ts        搜索索引（构建时生成）
│  ├─ layouts/BaseLayout.astro 全站骨架：meta、主题、脚本
│  ├─ components/              页头、页脚、文章卡片、目录
│  ├─ styles/global.css        全站样式（配色、排版都在这里）
│  ├─ utils/post.ts            日期格式化、摘要、阅读时长、排序等
│  ├─ consts.ts                站点配置 + 全站文案（改文字主要就改这里）
│  └─ content.config.ts        文章 frontmatter 的校验规则
├─ shims/                      见文末「已知问题」
├─ scripts/new-post.mjs        新建文章的脚本
└─ astro.config.mjs            站点配置（域名、Markdown、代码高亮）
```

## 改成自己的

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、简介、作者、导航菜单、首页文章数 | `src/consts.ts` 里的 `SITE` 和 `NAV` |
| 页面上出现的任何固定文字 | `src/consts.ts` 里的 `TEXT` |
| 文章正文 | `src/content/posts/*.md` |
| 「关于」页 | `src/content/pages/about.md` |
| 配色、字体、字号、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 域名（影响 RSS / sitemap / 绝对链接） | `astro.config.mjs` 里的 `site` |
| 代码高亮主题 | `astro.config.mjs` 里的 `shikiConfig` |
| 网站图标 | `public/favicon.svg` |

### 关于 `TEXT`：改界面文字不用碰模板代码

页面上所有固定文案（「草稿」「目录」「复制」按钮、各页标题和提示语、404 文案等）都集中在 `src/consts.ts` 的 `TEXT` 对象里，改了立刻全站生效，不会碰到任何 `.astro` 模板。

```ts
export const TEXT = {
  draftBadge: '草稿',                              // 想改成「未发布」直接改引号里的内容
  minutes: (n: number) => `${n} 分钟`,             // 括号里的 n 是页面传进来的数字
  archiveCount: (posts: number, tags: number) => `共 ${posts} 篇 · ${tags} 个标签`,
  // ...
};
```

带 `(参数) =>` 的是函数，括号里的参数由页面传进来。**改的时候只改字符串里的中文就行**，`${...}` 和引号别删——它们负责把数字填进去。

Markdown 支持的写法和效果，可以直接看站内那篇《Markdown 排版速查》——它本身就是样例。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览，热更新 |
| `npm run build` | 生成静态站点到 `dist/` |
| `npm run preview` | 预览 `dist/` 的构建结果 |
| `npm run new -- "标题"` | 新建文章 |
| `npx astro sync` | 只重新生成内容类型（内容集合报错时可以跑一下） |

## 部署

`npm run build` 之后的 `dist/` 目录就是完整网站，纯静态，任何静态托管都能放。

**部署前记得改 `astro.config.mjs` 里的 `site` 为自己域名**，否则 RSS 和 sitemap 里的链接是 `example.com`。

### GitHub Pages

仓库里已经放好了 `.github/workflows/deploy.yml`，推到 GitHub 后：

1. 仓库 **Settings → Pages → Build and deployment** 里把 Source 选成 **GitHub Actions**
2. 把 `astro.config.mjs` 里的 `site` 改成 `https://<你的用户名>.github.io`
3. 如果站点地址是 `https://<用户名>.github.io/<仓库名>/`（项目站点），还要加上 `base: '/<仓库名>'`
4. 推到 `main` 分支，剩下的自动完成

### Vercel / Netlify

连上仓库就行，构建命令 `npm run build`，输出目录 `dist`。

### 自己的服务器

```bash
npm run build
# 把 dist/ 里的内容传到服务器，交给 nginx 之类的静态服务
```

## 备份

要备份的只有：`src/`、`public/`、`astro.config.mjs`、`package.json`（也就是整个项目目录，除了 `node_modules/` 和 `dist/`）。

用 git 管理最省事：

```bash
git init
git add .
git commit -m "开始写博客"
```

## 已知问题：为什么会有 `shims/` 目录

当前装的 Astro 7 + Vite 8 在 **dev 模式**下会把 `node_modules` 里的依赖内联进 module runner 执行，而其中的 CommonJS 代码在 ESM 上下文里会出错，典型报错：

- `require is not defined`（例如 `yaml`、`picomatch`）
- `Class extends value undefined is not a constructor or null`（例如 `eventemitter3`）

`shims/` 目录里是为这些包写的 ESM 包装（用 Node 的 `require` 拿到真正的 CommonJS 实现再转发出去），`astro.config.mjs` 里通过 `resolve.alias` 挂上。

**以后如果 dev 报出类似的错**，按同样办法加一个：

1. 在 `shims/` 下新建 `<包名>.mjs`：

   ```js
   import { createRequire } from 'node:module';
   const require = createRequire(import.meta.url);
   const mod = require('<包名>');
   export default mod;
   // 如果报错是具名导出为 undefined，再补上具名导出：
   // export const { someName } = mod;
   ```

2. 在 `astro.config.mjs` 的 `CJS_ONLY_DEPS` 数组里加上包名

注意这些 shim 只影响 dev；生产构建（`npm run build`）本身能正确处理 CommonJS。

## 许可

内容版权归作者所有；代码随便用。
