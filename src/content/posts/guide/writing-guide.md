---
title: 写作指南：frontmatter 全解析
directoryTitle: 写作指南
published: 2026-03-18
updated: 2026-05-06
description: 逐项解释文章开头的每个 frontmatter 字段，并说清草稿、分类、标签、封面与复制保护到底是怎么生效的。
cover: /assets/images/covers/cover-02.svg
coverInContent: false
category: 内容创作
tags: [Markdown, 写作技巧, 排版]
lang: "zh_CN"
author: KazeYouni
sourceLink: ""
comment: true
draft: false
---

一篇文章的开头两行 `---` 之间，就是 frontmatter：它不参与正文排版，却决定了文章出现在哪里、长什么样、给谁看。

## 一篇文章的最小结构

```markdown
---
title: 我的第一篇笔记
published: 2026-03-18
description: 一句话说清这篇写的是什么。
---

正文从这里开始。
```

只写这三个字段就能发布。其余字段按需添加，全部缺省值都是「不启用」。

## 字段总览

| 字段 | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `title` | 字符串 | 必填 | 文章标题，同时用于列表页、RSS 与浏览器标题 |
| `directoryTitle` | 字符串 | 空 | 侧栏目录树中显示的名字；留空时回退为 `title` |
| `published` | 日期 | 空 | 发布日期，用于排序；留空时回退到文件的 Git 首次提交时间 |
| `updated` | 日期 | 空 | 更新日期；填写后会显示「上次编辑」卡片与文章底部的差异信息 |
| `description` | 字符串 | 空 | 摘要，显示在列表卡片、分享卡片与搜索结果里 |
| `cover` | 字符串 | 空 | 封面图，见下方「封面怎么填」 |
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
| `copyProtection` | 对象 | 全部 `false` | 页面级复制保护开关，见下文 |
| `routeName` | 字符串 | 空 | 额外的自定义地址（不替换默认地址） |

:::tip
`prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 这四个字段由构建过程自动填充，用来生成文章底部的上一篇/下一篇跳转，**不要在 frontmatter 里手写**。
:::

## 日期怎么写

推荐 ISO 8601 的 `YYYY-MM-DD`，需要精确到时间就写 `YYYY-MM-DDTHH:mm:ss`。`published` 决定排序，`updated` 只影响「最后修改于多久之前」的展示：

```yaml
published: 2026-03-18
updated: 2026-05-06
```

:::note
没有写 `published` 时，构建会依次尝试读取该文件的 Git 首次提交时间、文件创建时间。为了排序稳定，公开发布的文章建议都显式写上日期。
:::

## 分类与标签

分类是「树」，标签是「云」，两者用途不同：分类回答「这篇属于哪个板块」，标签回答「这篇讲到了哪些点」。

```yaml
# 单层分类
category: 内容创作

# 嵌套分类：写在数组里，用「 / 」连接展示
category: [技术笔记, 前端]

# 标签可以写成数组
tags: [Markdown, 排版]

# 也可以写成逗号分隔的字符串，效果相同
tags: Markdown, 排版
```

嵌套分类在本站的表现：侧栏的「文章类别」会按层级展开，点击后跳转到归档页的筛选结果，地址形如 `/archive/?category=技术笔记%20%2F%20前端`。也就是说嵌套分类是**整体匹配**的，点「技术笔记 / 前端」只会筛出同时属于这两层的文章。

## 封面怎么填

`cover` 支持三种写法，按前缀区分：

```yaml
cover: /assets/images/covers/cover-01.svg   # 以 / 开头：public 目录下的文件
cover: ./cover.svg                          # 以 ./ 开头：与文章同目录的文件
cover: https://example.com/cover.png        # 以 http 开头：网络图片
```

至于 `coverInContent`：

- `coverInContent: false`（默认）：封面只出现在**列表卡片**上，正文里不会再出现一次大图。
- `coverInContent: true`：封面额外渲染在**正文标题与元信息之下**，形成「题图」效果，适合长文。

两者可以同时给，也可以只给 `cover`，甚至完全不给——没封面时列表卡片会使用默认封面。

## 草稿机制

```yaml
draft: true
```

- 开发模式下草稿**照常显示**，方便你边写边预览。
- 生产构建（`npm run build`）会跳过所有草稿，RSS、站点地图、搜索结果与侧栏目录树里都不会出现它们。
- 想让人在看得到、但暂时不想进列表，可以用 `pinned` + 不写 `description` 之类的组合，不过那属于权宜之计，正式做法仍是草稿开关。

## 加密与复制保护

正文加密只需要两个字段：

```yaml
encrypted: true
password: "younisekai"
```

构建时会把渲染好的正文用 AES 加密后写进页面，只有在访客输入正确密码时才会在浏览器端解密展开。演示与注意事项见[给文章加一把锁](/posts/encrypted-note/)。

复制保护是四个互不影响的小开关：

```yaml
copyProtection:
    blockSelection: true      # 禁止选中文本
    blockClipboard: true      # 拦截复制、剪切、粘贴
    blockContextMenu: true    # 禁止右键菜单
    blockDevTools: true       # 屏蔽 F12、Ctrl+U、Ctrl+S
```

四项默认都是 `false`，按需开启；每一项的具体行为见[复制保护四种开关](/posts/copy-protection/)。

## 作者、来源与许可

```yaml
author: KazeYouni
sourceLink: https://example.com/original
licenseName: CC BY 4.0
licenseUrl: https://creativecommons.org/licenses/by/4.0/
```

版权卡片会优先使用这里填的值，`licenseName` 留空时则回落到站点配置里的默认协议。转载、翻译或引用他人内容时，把 `sourceLink` 填上是最基本的礼貌。

## 被忽略的文件

`src/content/posts/` 下**以 `_` 开头的文件不会生成页面**，可以放心用来放模板、素材说明和草稿片段。本仓库里的 `_frontmatter-template.md` 就是这么一份可直接复制的模板。
