/**
 * 给正文里的「根绝对路径」补上 base 前缀
 *
 * 背景：站点部署在子路径下时（例如 GitHub Pages 的 https://user.github.io/repo/），
 * Astro 只会自动处理它自己生成的资源路径（/_astro/...）与用 url() 生成的链接，
 * 而 Markdown 正文里手写的 `[文字](/posts/xxx/)`、`![图](/assets/img.png)` 会被原样输出，
 * 在子路径部署下就会 404。
 *
 * 本插件把正文（以及 ::github 之类的自定义组件产出）里所有以 `/` 开头、
 * 且不是 `//` 协议相对地址的 href / src，统一补上 base 前缀。
 *
 * 注意：base 必须由 astro.config.mjs 显式传入（这个文件在 Vite 之外加载，
 * 拿不到 import.meta.env.BASE_URL）。前缀为空时本插件不做任何改动，
 * 因此根路径部署的行为完全不变。
 *
 * 用法：
 *   import { rehypeBasePath } from "./src/plugins/rehype-base-path.mjs";
 *   rehypePlugins: [ ..., [rehypeBasePath, { base: "/你的仓库名/" }] ]
 */

import { visit } from "unist-util-visit";

/** 该属性值是否需要补前缀：以单个 / 开头，且不是 // 协议相对地址 */
function needsPrefix(value) {
    return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

export function rehypeBasePath(options = {}) {
    const prefix = String(options.base || "/").replace(/\/+$/, "");

    return (tree) => {
        if (!prefix) return;

        visit(tree, "element", (node) => {
            const props = node.properties;
            if (!props) return;

            for (const key of ["href", "src"]) {
                if (needsPrefix(props[key])) {
                    props[key] = `${prefix}${props[key]}`;
                }
            }
        });
    };
}

export default rehypeBasePath;
