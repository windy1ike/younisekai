import { defineConfig } from "astro/config";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import svelte, { vitePreprocess } from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import swup from "@swup/astro";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflarePages from "@astrojs/cloudflare";
import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel";
import decapCmsOauth from "decap-cms-oauth-astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeComponents from "rehype-components";
import rehypeCallouts from "rehype-callouts";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";

import { siteConfig } from "./src/config.ts";
import { pluginCollapseButton } from "./src/plugins/expressive-code/collapse-button.ts";
import { pluginCopyButton } from "./src/plugins/expressive-code/copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeAdmonitions } from "./src/plugins/rehype-admonitions.mjs";
import { rehypeBasePath } from "./src/plugins/rehype-base-path.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { rehypeLazyLoadMedia } from "./src/plugins/rehype-lazy-load-media.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";


/**
 * 后台管理（Decap CMS）的 OAuth 登录需要服务端路由，所以只有在环境变量
 * ENABLE_CMS_OAUTH=1 时才挂 SSR 适配器。
 *
 * 默认不设置该变量 ⇒ 纯静态输出：dist/ 可以直接丢到任何静态托管
 * （GitHub Pages、Cloudflare Pages、Netlify、Vercel、Nginx 都行）。
 *
 * 想在浏览器里登录后台写文章时：
 *   1. 在部署平台配置 ENABLE_CMS_OAUTH=1 以及 OAUTH_GITHUB_CLIENT_ID /
 *      OAUTH_GITHUB_CLIENT_SECRET（见 .env.example）；
 *   2. 部署到支持 SSR 的平台（Vercel / Netlify / Cloudflare 会自动识别）。
 */
const enableCmsOauth = process.env.ENABLE_CMS_OAUTH === "1";

const adapter = !enableCmsOauth
    ? undefined
    : (process.env.CF_PAGES
        ? cloudflarePages()
        : (process.env.NETLIFY
            ? netlify()
            : vercel({ mode: "serverless" })
        )
    );

/**
 * 站点部署的「基准路径」：子路径部署时所有资源与链接都要带上它。
 *
 *   - 部署在根目录（自定义域名，或仓库名为 <用户名>.github.io）：用 "/"
 *   - GitHub Pages 项目站点 https://<用户名>.github.io/<仓库名>/：用 "/<仓库名>/"
 *
 * 同时记得把 younisekai.config.yaml 里的 siteURL 改成带上同一前缀的完整地址。
 */
const BASE_PATH = "/younisekai/";

// Ref: https://astro.build/config
export default defineConfig({
    site: siteConfig.siteURL,
    base: BASE_PATH,
    trailingSlash: "always",
    adapter: adapter,
    integrations: [
        decapCmsOauth({
            configPath: "./.decap.yml", // Decap CMS 配置文件位置
            decapCMSVersion: "3.9.0",
            enable: enableCmsOauth, // 设为 true 时需要 .env 里的 OAuth 凭据
        }),
        swup({
            theme: false,
            animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
            containers: [
                "#swup-container",
                "#left-sidebar",
                "#right-sidebar",
                "#middle-sidebar",
            ],
            cache: true,
            preload: true,
            accessibility: true,
            updateHead: true,
            updateBodyClass: false,
            globalInstance: true,
            // 滚动相关配置优化
            smoothScrolling: false, // 关掉平滑滚动，避免和锚点导航互相干扰
            resolveUrl: (url) => url,
            animateHistoryBrowsing: false,
            skipPopStateHandling: (event) => {
                // 锚点链接交给浏览器原生处理
                return event.state && event.state.url && event.state.url.includes("#");
            },
        }),
        icon({
            include: {
                "fa6-brands": ["*"],
                "fa6-regular": ["*"],
                "fa6-solid": ["*"],
                mdi: ["*"],
            },
        }),
        expressiveCode({
            themes: ["github-light", "github-dark"],
            themeCSSSelector: (theme) => `[data-theme="${theme}"]`,
            plugins: [
                pluginCollapsibleSections(),
                pluginLineNumbers(),
                pluginCollapseButton(),
                pluginCopyButton(),
                pluginLanguageBadge(),
            ],
            defaultProps: {
                wrap: true,
                overridesByLang: {
                    shellsession: {
                        showLineNumbers: false,
                    },
                },
            },
            styleOverrides: {
                codeBackground: "var(--codeblock-bg)",
                borderRadius: "0.75rem",
                borderColor: "none",
                codeFontSize: "0.875rem",
                codeFontFamily:
                    "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                codeLineHeight: "1.5rem",
                frames: {
                    editorBackground: "var(--codeblock-bg)",
                    terminalBackground: "var(--codeblock-bg)",
                    terminalTitlebarBackground: "var(--codeblock-bg)",
                    editorTabBarBackground: "var(--codeblock-bg)",
                    editorActiveTabBackground: "none",
                    editorActiveTabIndicatorBottomColor: "var(--primary)",
                    editorActiveTabIndicatorTopColor: "none",
                    editorTabBarBorderBottomColor: "var(--codeblock-bg)",
                    terminalTitlebarBorderBottomColor: "none",
                    copyButtonBackground: "var(--btn-regular-bg)",
                    copyButtonBackgroundHover: "var(--btn-regular-bg-hover)",
                    copyButtonBackgroundActive: "var(--btn-regular-bg-active)",
                    copyButtonForeground: "var(--btn-content)",
                },
                textMarkers: {
                    delHue: 0,
                    insHue: 180,
                    markHue: 250,
                },
            },
            frames: {
                showCopyToClipboardButton: false,
            },
        }),
        mdx(),
        sitemap(),
        svelte({
            preprocess: vitePreprocess(),
        }),
    ],
    markdown: {
        remarkPlugins: [
            remarkMath,
            remarkReadingTime,
            remarkExcerpt,
            remarkDirective,
            remarkSectionize,
            parseDirectiveNode,
            remarkMermaid,
        ],
        rehypePlugins: [
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "append",
                    properties: {
                        className: ["anchor"],
                    },
                    content: {
                        type: "element",
                        tagName: "span",
                        properties: {
                            className: ["anchor-icon"],
                            "data-pagefind-ignore": true,
                        },
                        children: [
                            {
                                type: "text",
                                value: "#",
                            },
                        ],
                    },
                },
            ],
            rehypeSlug,
            rehypeKatex,
            [
                rehypeComponents,
                {
                    components: {
                        github: GithubCardComponent,
                    },
                },
            ],
            [
                rehypeCallouts,
                {
                    theme: "github",
                    showIndicator: false,
                    tags: {
                        nonCollapsibleContainerTagName: "blockquote",
                    },
                    props: {
                        containerProps: (node, type) => ({ className: ["admonition", `bdm-${type}`] }),
                        titleProps: { className: "bdm-title" },
                        contentProps: { className: "bdm-content" },
                    },
                },
            ],
            rehypeAdmonitions,
            rehypeMermaid,
            rehypeLazyLoadMedia,
            // 放在最后：把正文里手写的根绝对路径补上 base 前缀（子路径部署用）
            [rehypeBasePath, { base: BASE_PATH }],
        ],
    },
    vite: {
        plugins: [tailwindcss()],
        build: {
            cssCodeSplit: true,
            cssMinify: "esbuild",
            minify: "esbuild",
            esbuildOptions: {
                drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
            },
            rollupOptions: {
                onwarn(warning, warn) {
                    if (
                        warning.message.includes("is dynamically imported by") &&
                        warning.message.includes("but also statically imported by")
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
        },
    },
    //build: {
    //    inlineStylesheets: "always",
    //},
});
