import type { APIRoute } from "astro";


// 后台路由与 OAuth 路由不写进 robots（后台页面本身也带 noindex，这里只是多一层）。
// 如果你用 ADMIN_ROUTE 环境变量改过后台路径，记得同步改这里的 /studio。
const robotsTxt = `
User-agent: *
Disallow: /_astro/
Disallow: /studio
Disallow: /oauth

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
};
