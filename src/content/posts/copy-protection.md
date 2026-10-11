---
title: 复制保护四种开关
directoryTitle: 复制保护
published: 2026-07-22
updated: 2026-07-22
description: blockSelection、blockClipboard、blockContextMenu、blockDevTools 四项复制保护各自做什么、怎么验证、什么时候不该开。
copyProtection:
    blockSelection: true
    blockClipboard: true
    blockContextMenu: true
    blockDevTools: true
category: 主题定制
tags: [复制保护, 站点配置]
lang: "zh_CN"
author: KazeYouni
comment: true
draft: false
---

你正在看的这一页，四项复制保护**全部开启**。可以顺手试一下：拖选这段文字、按 `Ctrl+C`、点右键、按 `F12`——四种操作都会被拦下来。

## 怎么配置

```yaml
copyProtection:
    blockSelection: true      # 禁止选中文本
    blockClipboard: true      # 拦截复制、剪切、粘贴
    blockContextMenu: true    # 禁止右键菜单
    blockDevTools: true       # 屏蔽 F12、Ctrl+U、Ctrl+S
```

四个开关**互相独立**，默认全部为 `false`。按需要逐项开启，比「一键全开」更好：全开之后读者想复制一段代码示例都做不到，体验会明显变差。

## 四项开关分别做什么

| 开关 | 实际行为 | 生效方式 |
| --- | --- | --- |
| `blockSelection` | 全站禁用文本选中（`user-select: none`），但输入框与文本域保持可选中 | 注入一条全局样式 |
| `blockClipboard` | 拦截 `copy`、`cut`、`paste` 三个事件并阻止默认行为 | 注册事件监听 |
| `blockContextMenu` | 拦截 `contextmenu` 事件，右键不再弹出菜单 | 注册事件监听 |
| `blockDevTools` | 拦截 `F12`，以及按下 `Ctrl` 时的 `U`（查看源代码）与 `S`（保存页面） | 注册键盘监听 |

:::note
这些保护都是**浏览器端**的。只要愿意关掉 JavaScript，或者直接在源码层面抓取，任何前端限制都能被绕过。它的定位是「提高随手复制的成本」，而不是「防止内容被拿走」。
:::

## 逐项验证

打开本页后可以按下面的方式自检：

1. **选中**：试着用鼠标拖选这段话（包括代码块与表格），选中高亮不会出现；但页面上的搜索框仍可正常输入与选中。
2. **复制**：按 `Ctrl+C` 不会把内容写进剪贴板；`Ctrl+X`、`Ctrl+V` 同样被拦截。
3. **右键**：右键单击页面任意位置都不会出现菜单。
4. **开发者工具**：按 `F12`、`Ctrl+U`、`Ctrl+S` 都不会触发对应动作。

```js
// 被拦截的就是这三类事件，核心只有几行
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    if (e.key === "F12") e.preventDefault();
});
```

## 该不该开

| 场景 | 建议 |
| --- | --- |
| 原创长文、连载小说、需要防搬运的稿件 | 可以开 `blockClipboard` 与 `blockContextMenu` |
| 教读者复制代码的技术文章 | 只开 `blockContextMenu`，**不要**开 `blockClipboard` |
| 加密后的私人笔记 | 四项全开，配合 `encrypted` 使用 |
| 想让内容被引用、被分享的公开文章 | 保持默认全关，复制与引用都是好事 |

:::tip
开了 `blockSelection` 之后，读者的浏览体验影响最大——没法选取文字，就没法用翻译插件、也没法做笔记。如果不是明确不想被复制的内容，建议保留默认值。
:::

## 与加密的分工

- **加密（`encrypted` + `password`）**：管「能不能读」，正文在解锁前是密文；
- **复制保护（`copyProtection`）**：管「读了之后能不能带走」，作用于整个页面。

两者可以叠加，也可以只用一种。加密的用法与注意事项见[给文章加一把锁](/posts/encrypted-note/)。
