---
title: 'Markdown 排版速查'
description: '一篇用来对照的排版样例：这个博客支持的写法、以及它们长什么样，都放在这里。忘了语法就回来看。'
pubDate: 2026-10-05
tags: ['Markdown', '参考']
draft: false
---

这篇是给自己留的参考页。左边是我写的 Markdown，右边是页面上的实际效果——所以你看到的就是全部支持的样式。

## 文字样式

**加粗**、*斜体*、***加粗斜体***、~~删除线~~、`行内代码`，还有 <kbd>Ctrl</kbd> + <kbd>S</kbd> 这种按键样式（直接写 HTML 标签也可以）。

需要断行的时候在行尾敲两个空格。

## 标题与目录

用 `##` 到 `####` 分小节。文章页右上角（窄屏是正文上方）会自动生成目录，标题左边会显示一个 `#` 锚点，点它可以拿到这一节的链接。

### 三级标题

#### 四级标题

再往下的小节一般就用不着了，标题层级太深读起来累。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌一层也没问题
  - 再一项
- 第三项

有序列表：

1. 先做这个
2. 再做那个
3. 最后收尾

待办清单（适合写计划和复盘）：

- [x] 已经做完的事
- [x] 另一件做完的事
- [ ] 还没做的事

## 引用

> 引用用来放大别人的话，或者给自己划重点。
>
> 引用里也可以有多个段落。

## 代码

行内代码用反引号包起来，比如 `npm run dev`。

代码块用三个反引号，并在后面写上语言名，会自动高亮，鼠标移上去右上角有复制按钮：

```js
// JavaScript
const posts = await getCollection('posts');
const recent = posts
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 10);
```

```bash
# 命令行
npm run dev      # 本地预览，改文件即时刷新
npm run build    # 生成静态站点到 dist/
npm run preview  # 预览构建结果
```

```python
# Python
def reading_minutes(text: str) -> int:
    cjk = sum(1 for ch in text if '\u4e00' <= ch <= '\u9fff')
    return max(1, round(cjk / 350))
```

## 表格

| 目录 | 内容 | 要不要备份 |
| --- | --- | :---: |
| `src/content/posts/` | 文章正文 | 要 |
| `src/content/pages/` | 关于等固定页面 | 要 |
| `src/consts.ts` | 站名、简介、导航 | 要 |
| `dist/` | 构建产物，能重新生成 | 不用 |

表格在窄屏上会横向滚动，不会把页面撑破。

## 链接与分割线

普通链接：[Astro 文档](https://docs.astro.build)。

分割线：

---

## 脚注

正文里可以加脚注[^1]，鼠标移上去或者点一下能跳到文末。

[^1]: 这就是脚注的实际内容。适合放补充说明和出处，不打断正文的节奏。

## 图片

把图片放进 `public/` 目录（比如 `public/images/photo.jpg`），然后这样引用：

```markdown
![图片说明](/images/photo.jpg)
```

图片会自动适配容器宽度，不会被撑破。

## 一些提醒

- 文件编码统一用 UTF-8，不然中文会变成乱码
- 文件名就是网址，用中文也没问题，但别用 `/ \ : * ? " < > |` 这些字符
- 想分类归档就把文件放进子目录，例如 `src/content/posts/notes/xxx.md`，网址会变成 `/posts/notes/xxx/`
