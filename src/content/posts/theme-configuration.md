---
title: 主题与站点配置：改一个 YAML 就够了
directoryTitle: 主题与配置
published: 2026-06-08
updated: 2026-07-30
description: 站点信息、主题色相、壁纸模式、导航菜单、侧栏挂件、文章卡片与评论，全部集中在一个配置文件里，这里逐项说明怎么改。
cover: /assets/images/covers/cover-05.svg
coverInContent: false
category: 主题定制
tags: [主题定制, 站点配置]
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

## 站点基础信息

| 字段 | 示例值 | 说明 |
| --- | --- | --- |
| `site.siteURL` | `https://younisekai.example.com/` | 站点根地址，**必须以斜杠结尾**；RSS、Atom、站点地图与分享卡片都依赖它，部署前务必改成自己的域名 |
| `site.title` | `younisekai` | 站点标题，显示在导航栏左上角与浏览器标签页 |
| `site.subtitle` | `异世界手记` | 站点副标题，用于默认描述与页脚 |
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

整套配色由 `site.themeColor.hue` 一个数字推导出来，取值 0–360：

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
```

明度与饱和度由主题在 CSS 变量层统一处理，浅色与暗色模式都会自动得到可用的对比度，不需要你手调具体颜色值。

## 壁纸与首屏

| 字段 | 可选值 | 说明 |
| --- | --- | --- |
| `site.wallpaper.mode` | `banner` / `fullscreen` / `none` | 横幅、全屏壁纸、纯色背景 |
| `site.wallpaper.src.desktop` | 路径或数组 | 桌面壁纸，路径相对 `/public`；**数组长度大于 1 时自动轮播** |
| `site.wallpaper.src.mobile` | 路径或数组 | 移动端壁纸，规则同上 |
| `site.wallpaper.position` | `top` / `center` / `bottom` | 壁纸的裁切重心 |
| `site.wallpaper.carousel.enable` | 布尔 | 是否轮播；关闭时多图会随机显示一张 |
| `site.wallpaper.carousel.interval` | 秒 | 轮播间隔 |
| `site.wallpaper.carousel.kenBurns` | 布尔 | 缓慢推近的 Ken Burns 效果 |
| `site.wallpaper.banner.homeText.enable` | 布尔 | 是否只在首页显示横幅文字 |
| `site.wallpaper.banner.homeText.title` | 字符串 | 横幅大标题 |
| `site.wallpaper.banner.homeText.subtitle` | 字符串或数组 | 副标题，数组会依次轮播 |
| `site.wallpaper.banner.homeText.typewriter.enable` | 布尔 | 副标题打字机效果（含 `speed`、`deleteSpeed`、`pauseTime`） |
| `site.wallpaper.banner.credit.enable` | 布尔 | 是否显示横幅图片来源（`text`、`url`） |
| `site.wallpaper.banner.navbar.transparentMode` | `semi` / `full` / `semifull` | 导航栏透明策略：半透明加圆角、完全透明、滚动时动态变化 |
| `site.wallpaper.banner.waves.enable` | 布尔 | 横幅底部水波纹效果；`performanceMode` 可简化动画以省性能 |
| `site.wallpaper.fullscreen.opacity` | 0–1 | 全屏壁纸模式下内容面板的不透明度 |
| `site.wallpaper.fullscreen.blur` | 像素 | 全屏壁纸的模糊程度 |
| `site.wallpaper.fullscreen.zIndex` | 整数 | 全屏壁纸的层级 |

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
| `children` | 子链接数组，可继续嵌套 |

:::caution
预设名写错（多一个空格、大小写不一致、引用了不存在的预设）会在启动时直接抛出 `Unknown LinkPreset` 并中断构建。改完导航先用 `npm run dev` 跑一次最保险。
:::

## 侧边栏挂件

侧栏分左右两栏，每一栏都是一个挂件数组。可用类型：

| `type` | 作用 | 常用附加字段 |
| --- | --- | --- |
| `directory` | 按内容集合自动生成的目录树 | `position` |
| `categories` | 文章分类树 | `depth`（展开层数）、`responsive.collapseThreshold` |
| `tags` | 标签云 | `responsive.collapseThreshold` |
| `toc` | 当前文章的目录 | `depth`（1–6） |
| `statistics` | 站点统计 | `visibility` |
| `profile` | 资料卡（内容来自 `profile` 段） | `visibility` |
| `announcement` | 公告卡（内容来自 `announcement` 段） | `visibility` |

每一项都支持下面三个通用字段：

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

## 资料卡与公告

```yaml
profile:
    avatar: "/assets/images/avatar.svg"        # 相对 /public 目录
    name: "younisekai"
    bio: "在异世界的间隙里，写点代码，也写点故事。"
    links:
        - name: "GitHub"
          icon: "fa6-brands:github"
          url: "https://github.com/yourname/younisekai"
        - name: "RSS"
          icon: "fa6-solid:rss"
          url: "/rss.xml"

announcement:
    title: "异世界公告"
    content: "欢迎来到 younisekai，这里记录着我的代码、文字与旅途。"
    closable: true          # 允许访客关闭公告
    link:
        enable: true
        text: "了解更多"
        url: "/about/"
        external: false
```

资料卡的社交链接支持站内地址（如 `/rss.xml`）与站外地址，图标同样是 Iconify 名称。

## 文章卡片、许可与评论

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
| `post.comment.enable` | 评论总开关 |
| `post.comment.provider` | `waline` 或 `twikoo`；留空则自动选择已填好必填项的那个 |
| `post.comment.waline.serverURL` | Waline 服务端地址 |
| `post.comment.twikoo.envId` | Twikoo 环境 ID |

:::note
评论是唯一依赖外部服务的功能：要么把服务端地址与 `enable` 一起配好，要么保持关闭。关闭时页面上不会留下任何占位区域。
:::

## 其它开关

| 配置段 | 作用 |
| --- | --- |
| `footer.enable` | 是否注入自定义页脚 HTML（备案号之类），内容写在 `footer.customHtml` |
| `particle.enable` | 背景粒子：`particleNum` 数量、`size` / `opacity` / `speed` 的取值范围、`limitTimes` 越界次数、`zIndex` 层级 |

## 改配置的推荐流程

1. **只改 YAML，不动 `src/` 里的源码**——升级模板时会轻松很多。
2. 改完先 `npm run dev` 看效果，再 `npm run build` 验证一次构建。
3. 站点地址、站点标题、导航、侧栏这四项是「先定下来」的配置项，越早改越省事。
4. 用 Git 记录每次配置改动，出问题能一键回退。

配置之外的东西（新增挂件类型、改配色算法、加新页面）属于源码级定制，建议单独开分支，并在提交信息里写清动机，方便日后与上游对照。
