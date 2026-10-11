/**
 * 站点配置 + 界面文字。
 *
 * 想改网站上的文字，基本只需要改这个文件：
 *   SITE  —— 站名、简介、作者这类站点信息
 *   NAV   —— 顶部导航菜单
 *   TEXT  —— 各个页面上出现的固定文案（改这里不用碰任何模板代码）
 *
 * 括号里带参数的是函数（比如文章数、标签名由页面传进来），
 * 想调整句式直接改字符串里的内容就行，不用管那些 ${...}。
 */
export const SITE = {
  /**
   * 站点标题：出现在浏览器标签、页头、RSS、以及分享卡片上。
   * 名字比较长，页头在窄屏上会自动折成两行（见 src/styles/global.css）。
   */
  title: "KazeYouni's Wonderland",
  /** 一句话简介，显示在页头和首页 */
  description: '写点东西，记点东西。',
  /** 作者名，显示在页脚 */
  author: 'KazeYouni',
  /** 首页最多显示几篇文章 */
  postsPerPage: 10,
  /** 搜索页最多显示几条结果 */
  searchResultLimit: 20,
} as const;

/** 顶部导航：想换顺序、改名字、加页面都在这里 */
export const NAV = [
  { label: '首页', href: '/' },
  { label: '归档', href: '/archive/' },
  { label: '标签', href: '/tags/' },
  { label: '搜索', href: '/search/' },
  { label: '关于', href: '/about/' },
] as const;

/** 界面上的固定文案 */
export const TEXT = {
  // ===== 全站通用 =====
  /** 无障碍跳转链接，按 Tab 键才会出现 */
  skipToContent: '跳到正文',
  /** 草稿文章旁边的角标 */
  draftBadge: '草稿',
  /** 文章修改时间，date 形如「2026年10月12日」 */
  updatedAt: (date: string) => `改于 ${date}`,
  /** 文章目录的标题 */
  tocTitle: '目录',
  /** 代码块复制按钮 */
  copyCode: '复制',
  copied: '已复制',
  /** 正文标题旁 # 锚点的无障碍说明 */
  headingAnchorLabel: '本节链接',

  // ===== 页头 / 页脚 =====
  /** RSS 订阅链接的说明，阅读器里会显示成「站点名 订阅」 */
  rssFeedTitle: (siteName: string) => `${siteName} 订阅`,
  mainNavLabel: '主导航',
  themeToggleLabel: '切换深色 / 浅色主题',
  themeToggleTitle: '切换主题',
  footerLinks: [
    { label: 'RSS', href: '/rss.xml' },
    { label: '归档', href: '/archive/' },
    { label: '关于', href: '/about/' },
  ],

  // ===== 首页 =====
  homeCount: (n: number) => `共 ${n} 篇文字`,
  homeAllPosts: '全部文字',
  homeRecentPosts: '最新文字',
  homeArchiveLink: '归档 →',
  homeEmpty: '还没有文章。在 src/content/posts/ 里新建一个 .md 文件就能开始写，或者运行 npm run new -- "文章标题"。',

  // ===== 归档页 =====
  archiveTitle: '归档',
  archiveMeta: '按时间浏览全部文章',
  archiveCount: (posts: number, tags: number) => `共 ${posts} 篇 · ${tags} 个标签`,
  archiveYear: (year: string | number) => `${year} 年`,
  archiveYearCount: (n: number) => `${n} 篇`,
  archiveEmpty: '还没有文章。',

  // ===== 标签页 =====
  tagsTitle: '标签',
  tagsMeta: '按标签浏览文章',
  tagsCount: (n: number) => `共 ${n} 个标签`,
  tagsEmpty: '还没有标签。在文章的 frontmatter 里写 tags 就会自动出现。',
  tagTitle: (tag: string) => `标签：${tag}`,
  tagMeta: (tag: string) => `标签「${tag}」下的全部文章`,
  tagCount: (n: number) => `共 ${n} 篇`,
  tagsAll: '全部标签',

  // ===== 搜索页 =====
  searchTitle: '搜索',
  searchMeta: '搜索站内全部文章',
  searchDesc: '支持标题、标签和正文，输入即搜（按 / 键可快速聚焦）',
  searchPlaceholder: '输入关键词…',
  searchInputLabel: '搜索关键词',
  searchNoResult: (query: string) => `没有找到「${query}」相关的文章`,
  /** limit 为 null 表示结果没被截断 */
  searchResult: (n: number, limit: number | null) =>
    limit === null ? `找到 ${n} 篇` : `找到 ${n} 篇（只显示最相关的 ${limit} 篇）`,

  // ===== 文章页 =====
  postNavLabel: '相邻文章',
  postPrev: '← 上一篇',
  postNext: '下一篇 →',

  // ===== 关于页 =====
  /** src/content/pages/about.md 里没写 title 时用的标题 */
  aboutFallbackTitle: '关于',
  aboutEmpty: '还没有「关于」页的内容。新建 src/content/pages/about.md 写点什么吧。',

  // ===== 404 =====
  notFoundTitle: '页面不存在',
  notFoundHeading: '这里什么都没有',
  notFoundDesc: '页面可能被移动或删除了。',
  notFoundHome: '← 回到首页',
  notFoundSearch: '搜索站内文章',
} as const;
