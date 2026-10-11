---
title: 排版速查表：Markdown 能写成什么样
directoryTitle: 排版速查
published: 2026-04-06
updated: 2026-04-28
description: 把标题、列表、引用、表格、代码块、脚注、图片和本站扩展语法全部演示一遍，写文章时可以直接照着抄。
cover: /assets/images/covers/cover-03.svg
coverInContent: false
category: 内容创作
tags: [Markdown, 排版]
lang: "zh_CN"
author: KazeYouni
licenseName: CC BY 4.0
licenseUrl: https://creativecommons.org/licenses/by/4.0/
comment: true
draft: false
---

这一页是写给自己的备忘录：需要哪种排版，直接从这里复制写法。文中所有示例都是**真实渲染**的，不是截图。

## 标题层级

正文用 `##` 起步比较合适——文章标题本身已经占掉了最高一级。

### 三级标题

#### 四级标题

标题会自动生成锚点，鼠标悬停时右侧出现 `#`，侧栏目录也会按层级同步展开。

## 文本与强调

**加粗**、*斜体*、~~删除线~~、`行内代码`、[普通链接](https://astro.build/)、上标式写法如 H~2~O 与 x^2^（部分语法取决于渲染器，不保证全部生效）。

需要打断行时，行尾两个空格即可，例如这一行结尾有两个空格，  
所以这一句出现在了新的一行。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套一层
  - 再嵌套一层
- 第三项

有序列表：

1. 收集素材
2. 写出草稿
3. 通读一遍并删掉三分之一

任务列表（GitHub 风格）：

- [x] 建好目录结构
- [x] 接入搜索
- [ ] 补齐示例内容
- [ ] 换个自己的域名

## 引用

> 引用适合放别人的观点、规范原文或需要特别强调的一段话。
>
> 引用内部同样支持**行内样式**与列表：
>
> - 一个要点
> - 另一个要点

## 表格

| 列名 | 类型 | 说明 |
| --- | :---: | ---: |
| `title` | 字符串 | 左对齐是默认值 |
| `pinned` | 布尔 | 居中对齐 |
| `published` | 日期 | 右对齐 |

表格支持对齐语法（`:---`、`:---:`、`---:`），单元格里可以用行内代码与链接。

## 代码块

### 多语言示例

```js
// JavaScript：把文章按发布时间倒序排列
export function sortByPublished(posts) {
    return [...posts].sort((a, b) => new Date(b.published) - new Date(a.published));
}
```

```ts
// TypeScript：给内容集合的字段加上类型
interface PostFrontmatter {
    title: string;
    published: Date;
    tags: string[];
    pinned?: boolean;
}

export function isPinned(post: PostFrontmatter): boolean {
    return post.pinned === true;
}
```

```python
# Python：粗略统计每个标签出现的次数
from collections import Counter

def tag_cloud(posts):
    counter = Counter(tag for post in posts for tag in post["tags"])
    return counter.most_common(10)
```

```json
{
    "title": "示例条目",
    "tags": ["Markdown", "排版"],
    "visible": true
}
```

```css
/* CSS：给引用块加一条左侧色带 */
blockquote {
    border-inline-start: 3px solid var(--primary);
    padding-inline-start: 1rem;
}
```

```bash
# 构建并在本地预览产物
npm run build
npm run preview
```

### 标题、行号与文本高亮

给代码块加上 `title` 会显示文件名栏，`showLineNumbers=true` 打开行号，`ins` / `del` / `mark` 可以标记新增、删除与重点行：

````markdown
```js title="sort-posts.js" showLineNumbers=true ins={4} del={2} mark={6}
```
````

渲染效果如下：

```js title="sort-posts.js" showLineNumbers=true ins={4} del={2} mark={6}
function sortPosts(posts) {
    return posts.sort((a, b) => a.date - b.date);
    const items = [...posts];
    return items.sort((a, b) => new Date(b.published) - new Date(a.published));
    // 下面这一行是这次改动的重点
    console.log("排序完成", items.length);
}
```

### 可折叠代码段

内容很长的代码块可以折叠起来，读者点一下「展开」再看细节。语法是在代码块信息串里写 `collapse={起始行-结束行}`：

````markdown
```ts collapse={2-6}
```
````

实际效果：

```ts collapse={2-6}
export const siteMeta = {
    name: "younisekai",
    version: "1.0.0",
    generator: "Astro",
    search: "pagefind",
    comments: false,
};

export function describe() {
    return `${siteMeta.name} v${siteMeta.version}`;
}
```

## 脚注

脚注适合放补充说明和引用出处[^1]。定义可以写在文章任意位置，渲染时会自动收到文末[^docs]。

[^1]: 这是一个脚注，点右上角的序号可以跳回正文。
[^docs]: 官方文档通常是最靠得住的参考资料，例如 [Astro 文档](https://docs.astro.build/)。

## 链接与图片

行内链接：[Astro 官方文档](https://docs.astro.build/)、[Pagefind 搜索](https://pagefind.app/)。

图片可以直接引用 `public` 目录下的占位图：

![一张渐变占位图](/assets/images/placeholders/p-01.svg)

也可以引用与文章放在一起的图片，写法是 `./路径`（相对于当前 Markdown 文件）：

![与文章放在一起的示例图](./guide/relative-image-demo.png)

:::tip
相对路径（`./xxx.png`）适合会跟着文章一起搬家的素材；`public` 目录下的绝对路径（`/assets/...`）适合全站复用的封面与头像。注意相对路径引用的是图片**文件本身**，构建时会被一并处理；一旦路径写错，构建会直接报 `ImageNotFound` 而不是静默跳过。
:::

## GitHub 仓库卡片

写一行指令就能得到一张会实时拉取数据的仓库卡片：

::github{repo="withastro/astro"}

```markdown
::github{repo="withastro/astro"}
```

:::note
卡片里的 star 数、协议、语言等信息由访客浏览器现场请求 GitHub API 获取，所以第一次打开时会短暂显示「Waiting...」。仓库名必须写成 `作者/仓库` 的格式。
:::

## 提示框

### 五种类型

:::note
note：需要读者留意、但即使跳读也不该错过的信息。
:::

:::tip
tip：能让人少走弯路的可选建议。
:::

:::important
important：完成某件事所必需的关键信息。
:::

:::warning
warning：存在风险、需要立刻注意的内容。
:::

:::caution
caution：某个操作可能带来的负面后果。
:::

如上所示，写法是三个冒号包住一段内容：

````markdown
:::note
需要读者留意的信息。
:::
````

### 自定义标题

在类型后面接方括号即可覆盖默认标题：

:::note[这里的标题是我自己写的]
标题支持中英文与行内样式，正文部分照常支持 Markdown。
:::

````markdown
:::note[这里的标题是我自己写的]
标题支持中英文与行内样式。
:::
````

### GitHub 风格提示框

习惯 GitHub 写法的话，用引用块加类型标记也可以：

> [!TIP]
> 这种写法在 GitHub 上能正确渲染，在本站同样会被识别成提示框。

````markdown
> [!TIP]
> 这种写法在本站同样会被识别成提示框。
````

### 隐藏文本

需要防剧透或者放一点小彩蛋时，用行内指令：

这段内容的结论是 :spoiler[其实答案就在下一段，但我先藏起来了]。

```markdown
这段内容的结论是 :spoiler[其实答案就在这里]。
```

## 组合使用的建议

1. **少即是多**：一篇文章里提示框超过五个，读者就会开始忽略它们。
2. **代码块给语言名**：`bash`、`json`、`ts` 这些标记不仅有配色，也让复制按钮与语言角标更准确。
3. **长代码折叠**：超过 20 行的示例，用 `collapse` 折叠，把注意力留给结论。
4. **图片要写替代文本**：方括号里的描述对无障碍阅读与 RSS 都很重要，别留空。

语法速查就到这里。图表与公式见[图表与数学公式](/posts/diagrams-and-math/)。
