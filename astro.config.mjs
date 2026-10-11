import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

/** 只有 CommonJS 构建、需要 ESM 包装的依赖（对应 shims/<name>.mjs） */
const CJS_ONLY_DEPS = ['yaml', 'picomatch', 'eventemitter3'];

// ⚠️ 部署前把 site 改成你自己的域名（影响 RSS、sitemap、绝对链接）
export default defineConfig({
  site: 'https://example.com',

  markdown: {
    // Markdown 处理器：开启「标题自定义 id」写法 —— ## 标题 {#自定义锚点}
    // 脚注标题也顺手本地化成中文
    processor: satteri({
      features: {
        headingAttributes: true,
        gfm: { footnotes: { label: '脚注', backLabel: '返回正文' } },
      },
    }),

    // 代码高亮：浅色 / 深色两套主题，由 global.css 里的变量切换
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },

  integrations: [sitemap()],

  vite: {
    resolve: {
      // 这些依赖只发布了 CommonJS 构建，Vite 8 会把它们当 ESM 内联执行并报
      // "require is not defined"。用 shims/ 下的 ESM 包装顶替（原因详见 shims/yaml.mjs）。
      alias: CJS_ONLY_DEPS.map((name) => ({
        find: new RegExp(`^${name}$`),
        replacement: fileURLToPath(new URL(`./shims/${name}.mjs`, import.meta.url)),
      })),
    },
  },
});
