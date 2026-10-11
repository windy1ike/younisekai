---
title: frontmatter 模板（此文件以 _ 开头，不会生成页面）
directoryTitle: frontmatter 模板
published: 2026-01-01
description: 复制这段 frontmatter 作为新文章的起点。文件名以 _ 开头，因此不会被构建成页面。
category: 内容创作
tags: [写作技巧]
lang: "zh_CN"
pinned: false
author: 游音
comment: false
draft: false
---

这是给作者自己看的模板文件：因为文件名以 `_` 开头，构建时会被内容集合忽略，也不会出现在任何列表里。

复制下面这段到新文章开头即可：

```yaml
---
title: 文章标题
directoryTitle: ""            # 侧栏目录树中的显示名，留空回退为 title
published: 2026-01-01
updated: ""                   # 可选，与 published 不同时会显示更新信息
description: 一句话摘要，会出现在列表卡片与搜索结果里
cover: /assets/images/covers/cover-01.svg
coverInContent: false         # 是否在正文顶部再渲染一次封面
category: 内容创作            # 嵌套分类写成数组：[技术笔记, 前端]
tags: [Markdown, 排版]        # 2~4 个标签比较合适
lang: "zh_CN"
pinned: false
author: 游音
sourceLink: ""                # 转载或引用时填原始链接
licenseName: ""               # 留空则使用站点默认协议
licenseUrl: ""
comment: true
draft: false
encrypted: false              # 加密文章改为 true 并填写 password
password: ""
copyProtection:
    blockSelection: false
    blockClipboard: false
    blockContextMenu: false
    blockDevTools: false
# routeName: "short-path"     # 需要额外短地址时取消注释
---
```

另外，`npm run new-post -- "文章标题"` 会自动生成一份同样字段的空文章，可以直接用它代替手工复制。
