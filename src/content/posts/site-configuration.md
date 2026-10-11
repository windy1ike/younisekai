---
title: 站点配置与进阶功能
directoryTitle: 站点配置
published: 2026-10-11
description: 站点信息、主题色相、壁纸、导航菜单、侧栏挂件、评论、复制保护、草稿与加密，全部集中在一个 YAML 里，这里逐项说明怎么改。
cover: /assets/images/covers/cover-05.svg
coverInContent: false
category: 使用指南
tags: [站点配置, 主题, 进阶]
lang: "zh_CN"
author: KazeYouni
comment: true
draft: false
---

这套模板的设计原则是：**日常调整不碰源码**。站点长什么样、导航有几级、侧栏放哪些卡片、要不要开评论，都由项目根目录下的一个 YAML 文件决定。

## 配置文件在哪

| 项目 | 说明 |
| --- | --- |
| 文件位置 | 项目根目录的 `younisekai.config.yaml` |
| 谁在读它 | `src/config.ts` 用 `?raw` 读入，做归一化后导出给页面与组件使用 |
| 生效时机 | **构建时**读取，改完请重启开发服务器（或重新构建），热更新不会重新解析 YAML |
| 敏感信息 | 不放这里。后台登录用的 GitHub OAuth 凭据走 `.env`（见 `.env.example`），YAML 只放可以公开的站点配置 |

:::warning
不要在 YAML 里随意增删层级。每一项的位置都是有意义的，写错层级时要么该字段被忽略，要么直接抛出配置错误。
:::

## 后台能改什么，配置文件改什么

后台入口是**站点地址 + `/studio/`**，界面用 Sveltia CMS，配置写在根目录的 `.decap.yml` 里，字段与 `src/content.config.ts` 的 schema 一一对应。它管的是**内容**：

| 想改什么 | 去哪里改 |
| --- | --- |
| 文章 | 后台「文章」集合，或直接编辑 `src/content/posts/*.md` |
| 项目 / 技能 / 历程 / 日记 / 相册 / 友链 | 后台对应的集合，或编辑 `src/content/**/*.json` |
| 关于页、友链页正文 | 后台的单文件集合，或编辑 `src/content/about.md`、`src/content/friends.md` |
| 站点信息、导航菜单、侧栏挂件、资料卡、公告 | **`younisekai.config.yaml`**（目前不在后台的表单里） |

在后台保存时，改动会以一次 **commit** 的形式提交回仓库，CI 检测到提交后自动重新构建并发布——所以后台更像一个「会写文件的表单」，最终产物依然是一个纯静态站点。

:::note
后台的表单只显示常用的十几个字段，其余（语言、作者、许可证、更新日期、加密密码等）在 `.decap.yml` 里用 `widget: hidden` 保留，保存时会原样写回文件。想让站点信息之类的配置项也在后台可改，需要往 `.decap.yml` 里加一个 `files` 类型的集合指向 `younisekai.config.yaml`。
:::

线上登录需要 GitHub OAuth（`ENABLE_CMS_OAUTH=1` + OAuth App 凭据），因此要部署在支持服务端渲染的平台上；纯静态托管只能用编辑器改文件，或本地跑 `npx decap-server` 配合 `npm run dev` 写稿。

## 站点基础信息

| 字段 | 示例值 | 说明 |
| --- | --- | --- |
| `site.siteURL` | 形如 `https://你的域名/` | 站点根地址，**必须以斜杠结尾**；RSS、Atom、站点地图与分享卡片都依赖它 |
| `site.title` | `YouniSekai` | 站点标题，显示在导航栏左上角与浏览器标签页 |
| `site.subtitle` | `存于风中` | 站点副标题，用于默认描述与页脚 |
| `site.lang` | `zh_CN` | 站点语言，可选 `en` / `ja` / `zh_hans` / `zh_hant`；`zh_CN`、`zh_TW` 这类地区写法会自动归一化 |
| `site.keywords` | 字符串数组 | 站点关键词，用于生成 `<meta name="keywords">` |
| `site.timeZone` | `8` | UTC 偏移小时数（-12 ~ 12），用于「几小时前」这类相对时间 |
| `site.defaultTheme` | `dark` | 默认主题：`system` 跟随系统、`light` 浅色、`dark` 深色 |
| `site.favicon` | 见下 | 站点图标数组，留空则使用内置默认图标 |

字体与图标的写法：

```yaml
site:
    font:
        # 标识会用于生成 .font-<标识> 工具类，请勿包含空格
        NotoSansSC:
            src: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
            family: "Noto Sans SC"
    favicon:
        - src: "/favicon/icon-light.svg"   # 路径相对 /public 目录
          theme: "light"                   # 适用主题：light / dark
          sizes: "any"                     # SVG 矢量图写 any
        - src: "/favicon/icon-dark.svg"
          theme: "dark"
          sizes: "any"
```

## 主题色：只改一个色相

整套配色由 `site.themeColor.hue` 一个数字推导出来，取值 0–360。导航栏还带了一个色相滑块，访客也能随手换：

| 色相 | 大致观感 | 适合的站点气质 |
| --- | --- | --- |
| `0` | 红 | 强烈、有攻击性 |
| `30` | 橙 | 温暖、有食欲 |
| `150` | 绿 | 自然、平静 |
| `200` | 青 | 清爽、偏科技 |
| `265` | 蓝紫 | 冷静、偏理性（本站默认值） |
| `300` | 紫 | 神秘、偏创作 |
| `345` | 粉 | 柔和、偏生活 |

```yaml
site:
    themeColor:
        hue: 265
    defaultTheme: "dark"    # system | light | dark
```

明度与饱和度由主题在 CSS 变量层统一处理，浅色与暗色模式都会自动得到可用的对比度，不需要手调具体颜色值。深浅色除了默认值，访客也能在导航栏切换，选择会记在浏览器里。

## 壁纸与首屏

`site.wallpaper.mode` 有三种模式：`banner` 横幅、`fullscreen` 全屏壁纸、`none` 纯色背景，访客可在导航栏随时切换。

| 字段 | 可选值 | 说明 |
| --- | --- | --- |
| `site.wallpaper.src.desktop` | 路径或数组 | 桌面壁纸，路径相对 `/public`；**数组长度大于 1 时自动轮播** |
| `site.wallpaper.src.mobile` | 路径或数组 | 移动端壁纸，规则同上 |
| `site.wallpaper.position` | `top` / `center` / `bottom` | 壁纸的裁切重心 |
| `site.wallpaper.carousel.enable` | 布尔 | 是否轮播；关闭时多图会随机显示一张 |
| `site.wallpaper.carousel.interval` | 秒 | 轮播间隔 |
| `site.wallpaper.carousel.kenBurns` | 布尔 | 缓慢推近的 Ken Burns 效果 |
| `site.wallpaper.banner.homeText.title` | 字符串 | 横幅大标题 |
| `site.wallpaper.banner.homeText.subtitle` | 字符串或数组 | 副标题，数组会依次轮播（含打字机的 `speed`、`deleteSpeed`、`pauseTime`） |
| `site.wallpaper.banner.credit.enable` | 布尔 | 是否显示横幅图片来源（`text`、`url`） |
| `site.wallpaper.banner.navbar.transparentMode` | `semi` / `full` / `semifull` | 导航栏透明策略：半透明加圆角、完全透明、滚动时动态变化 |
| `site.wallpaper.banner.waves.enable` | 布尔 | 横幅底部水波纹；`performanceMode` 可简化动画以省性能 |
| `site.wallpaper.fullscreen.opacity` | 0–1 | 全屏壁纸模式下内容面板的不透明度（另有 `blur`、`zIndex`） |

首屏加载页由 `site.loadingOverlay` 控制：`enable` 开关、`waitForFonts`（等字体加载）、`waitForImages`（等首图解码）、`maxWait`（最长等待秒数），标题与转圈动画各自有 `enable` 与 `interval`。

## 导航菜单

`navbar.links` 是一个数组，每一项可以是**预设名**（字符串），也可以是自定义对象。

可用的预设名：`Home`、`Archive`、`Projects`、`Skills`、`Timeline`、`Diary`、`Albums`、`Friends`、`About`（定义在 `src/constants/link-presets.ts`）。

```yaml
navbar:
    links:
        - "Home"                 # 一级：预设
        - "Archive"
        - # 一级：自定义，点击后进入中转页
          name: "展览"
          url: "/exhibition/"
          icon: "material-symbols:person"
          description: "收藏我的创作、技能与旅途片段"
          children:              # 子链接可以是预设名，也可以是自定义对象，层级不限
              - "Projects"
              - "Skills"
              - "Timeline"
              - "Diary"
              - "Albums"
        - "Friends"
        - "About"
```

| 自定义字段 | 说明 |
| --- | --- |
| `name` | 导航显示名 |
| `url` | 目标地址；填 `/exhibition/` 这类站内地址时会自动生成一个中转页，点击后进入卡片式入口 |
| `icon` | Iconify 图标名，例如 `material-symbols:person` |
| `description` | 中转页卡片上的说明文字 |
| `external` | 是否为站外链接（站外会在新标签页打开） |
| `children` | 子链接数组，可继续嵌套，多级菜单就是这么来的 |

:::caution
预设名写错（多一个空格、大小写不一致、引用了不存在的预设）会在启动时直接抛出 `Unknown LinkPreset` 并中断构建。改完导航先用 `npm run dev` 跑一次最保险。
:::

## 侧栏挂件

侧栏分左右两栏，每一栏都是一个挂件数组，增删挂件就是增删数组项。可用类型：

| `type` | 作用 | 常用附加字段 |
| --- | --- | --- |
| `directory` | 按内容集合自动生成的目录树 | `position` |
| `categories` | 文章分类树 | `depth`（展开层数）、`responsive.collapseThreshold` |
| `tags` | 标签云 | `responsive.collapseThreshold` |
| `toc` | 当前文章的目录 | `depth`（1–6） |
| `statistics` | 站点统计（文章数、分类数、标签数、总字数、运行天数） | `visibility` |
| `profile` | 资料卡（内容来自 `profile` 段） | `visibility` |
| `announcement` | 公告卡（内容来自 `announcement` 段） | `visibility` |

每一项都支持三个通用字段：

```yaml
sidebar:
    components:
        left:
            - type: "categories"
              position: "sticky"        # top 跟随内容顶部 | sticky 吸顶
              depth: 3                  # 展开到第三层
              responsive:
                  collapseThreshold: 5  # 超过 5 项时默认折叠
        right:
            - type: "profile"
              position: "top"
              visibility:
                  mode: "exclude"       # include 只在匹配页面显示 / exclude 只在非匹配页面显示
                  paths: ["^/posts/", "^/archive"]   # 正则字符串
```

:::tip
`visibility.paths` 里填的是**正则字符串**：`^/$` 表示只在首页显示，`^/posts/` 表示所有文章页。想让某个挂件只在文章页出现，用 `mode: include` 配合 `["^/posts/"]`。
:::

资料卡与公告的内容分别在 `profile` 与 `announcement` 两段里配置：

```yaml
profile:
    avatar: "/assets/images/avatar.svg"        # 相对 /public 目录
    name: "KazeYouni"
    bio: "在异世界的间隙里，写点代码，也写点故事。"
    links:
        - name: "GitHub"
          icon: "fa6-brands:github"
          url: "https://github.com/你的用户名"
        - name: "RSS"
          icon: "fa6-solid:rss"
          url: "/rss.xml"

announcement:
    title: "异世界公告"
    content: "欢迎来到 YouniSekai，这里记录着我的代码、文字与旅途。"
    closable: true          # 允许访客关闭公告
    link:
        enable: true
        text: "了解更多"
        url: "/about/"
        external: false
```

## 文章卡片与许可证

| 字段 | 说明 |
| --- | --- |
| `post.card.cover.side` | 列表卡片里封面的位置：`left` 或 `right` |
| `post.card.cover.width` | 封面占卡片宽度的比例 |
| `post.card.cover.showContent` | 封面上是否叠加标题、标签与摘要 |
| `post.card.cover.showDefaultCover` | 文章没写封面时是否显示默认封面 |
| `post.card.titleSize` | 卡片标题字号，Tailwind 文本类，例如 `text-2xl` |
| `post.showLastModified` | 是否显示「最后编辑」卡片 |
| `post.expressiveCode.theme` | 代码高亮主题 |
| `post.license.enable` | 是否在文章底部显示版权卡片 |
| `post.license.name` / `url` | 全站默认许可协议，可被文章的 `licenseName` / `licenseUrl` 覆盖 |

## 评论与访问统计

评论是唯一依赖外部服务的功能，默认**关闭**：要么把服务端地址与 `enable` 一起配好，要么保持关闭。关闭时页面上不会留下任何占位区域。

```yaml
post:
    comment:
        enable: false          # 打开时才加载评论
        provider:              # waline | twikoo；留空则自动选择已填好必填项的那个
        waline:
            serverURL: ""      # 自备的 Waline 服务端地址
        twikoo:
            envId: ""          # 自备的 Twikoo 环境 ID
```

Waline 与 Twikoo 都需要自己部署服务端；显式指定的 `provider` 没配置好时构建会直接报错，避免上线后评论区空着。

访问统计目前**没有接入**第三方服务：侧栏的「站点统计」挂件是纯 Astro 实现的本地统计（文章数、分类数、标签数、总字数、运行天数），不依赖外部接口，也不收集访客数据。想加浏览量之类的功能，需要自己接一个统计服务并在组件里调用。

## 复制保护四种开关

复制保护在**文章 frontmatter** 里开启，四个开关互相独立：

```yaml
copyProtection:
    blockSelection: true      # 禁止选中文本
    blockClipboard: true      # 拦截复制、剪切、粘贴
    blockContextMenu: true    # 禁止右键菜单
    blockDevTools: true       # 屏蔽 F12、Ctrl+U、Ctrl+S
```

| 开关 | 实际行为 | 生效方式 |
| --- | --- | --- |
| `blockSelection` | 禁用文本选中（`user-select: none`），但输入框与文本域保持可选中 | 注入一条全局样式 |
| `blockClipboard` | 拦截 `copy`、`cut`、`paste` 三个事件并阻止默认行为 | 注册事件监听 |
| `blockContextMenu` | 拦截 `contextmenu` 事件，右键不再弹出菜单 | 注册事件监听 |
| `blockDevTools` | 拦截 `F12`，以及按下 `Ctrl` 时的 `U`（查看源代码）与 `S`（保存页面） | 注册键盘监听 |

四项默认都是 `false`，按需逐项开启，比「一键全开」更好：

| 场景 | 建议 |
| --- | --- |
| 原创长文、连载小说、需要防搬运的稿件 | 可以开 `blockClipboard` 与 `blockContextMenu` |
| 教读者复制代码的技术文章 | 只开 `blockContextMenu`，**不要**开 `blockClipboard` |
| 加密后的私人笔记 | 四项全开，配合 `encrypted` 使用 |
| 想让内容被引用、被分享的公开文章 | 保持默认全关，复制与引用都是好事 |

:::note
这些保护都是**浏览器端**的。只要愿意关掉 JavaScript，或者直接在源码层面抓取，任何前端限制都能被绕过。它的定位是「提高随手复制的成本」，而不是「防止内容被拿走」。
:::

## 草稿机制

```yaml
draft: true
```

| 场景 | 草稿文章的表现 |
| --- | --- |
| `npm run dev`（开发模式） | **照常显示**，可以边写边预览排版效果 |
| `npm run build`（生产构建） | **完全跳过**，不会生成任何页面 |
| 首页、归档、分类、标签列表 | 生产构建中不出现；开发模式中出现 |
| RSS / Atom / 站点地图 / 搜索索引 / 侧栏目录树 | 生产构建中不出现 |

适合用草稿的场景：写到一半的长文、图还没做好的文章、暂时拿不定主意的选题、准备大改但暂时没时间的存档。想发布就把 `draft` 改成 `false`，顺手检查 `published`、`description`、`tags` 与 `category`；想彻底删掉，直接从 `src/content/posts/` 里移除文件即可——内容即文件，没有别的清理动作。

## 加密文章的开启方式

加密只需要两个字段，写在**需要加密的那篇文章**的 frontmatter 里：

```yaml
encrypted: true
password: "换成你自己的密码"
```

- 只有两个字段都写了才会加密；只写 `encrypted: true` 而没有密码时，文章按普通文章渲染；
- 加密动作发生在**构建时**：模板先把正文渲染成 HTML，再用密码做 AES 加密，把密文写进页面，访客输入正确密码后才在浏览器端解密展开；
- 加密文章不会进入站点地图与搜索结果，也适合配合四项复制保护一起用。

适用场景是「半成品分享、私人记录、内部资料」这类**防随手翻看**的需求；银行密码、私钥这类真正敏感的信息不要放在前端加密里。完整演示见[加密文章演示](/posts/encrypted-demo/)。

## 改配置的推荐流程

1. **只改 YAML，不动 `src/` 里的源码**——升级模板时会轻松很多。
2. 改完先 `npm run dev` 看效果，再 `npm run build` 验证一次构建。
3. 站点地址、站点标题、导航、侧栏这四项是「先定下来」的配置项，越早改越省事。
4. 用 Git 记录每次配置改动，出问题能一键回退。

配置之外的东西（新增挂件类型、改配色算法、加新页面）属于源码级定制，建议单独开分支，并在提交信息里写清动机，方便日后与上游对照。
