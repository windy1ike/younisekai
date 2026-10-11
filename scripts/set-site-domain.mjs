/**
 * 一条命令设置站点域名
 *
 * 用途：部署到 Cloudflare Pages / 自建域名后，需要把域名同步到多处配置，
 * 手改容易漏。这个脚本一次改好，并打印改动摘要。
 *
 * 用法：
 *   node scripts/set-site-domain.mjs https://younisekai.pages.dev
 *   node scripts/set-site-domain.mjs https://blog.example.com/ --keep-site-url
 *
 * 会改动：
 *   1. .decap.yml 的 backend.site_domain（不带协议的主机名）
 *   2. .decap.yml 的 backend.base_url（OAuth 回调用，带协议）
 *   3. .decap.yml 的 site_url 与 logo_url
 *   4. younisekai.config.yaml 的 site.siteURL（本地构建的默认值；
 *      云端部署仍由环境变量 SITE_URL 覆盖）
 *
 * 不会改动：astro.config.mjs 的 BASE_PATH（子路径部署才需要，另见 README）
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DECAP = join(ROOT, ".decap.yml");
const SITE_CONFIG = join(ROOT, "younisekai.config.yaml");

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const keepSiteUrl = args.includes("--keep-site-url");

if (!input) {
    console.error(`用法：node scripts/set-site-domain.mjs <站点地址>

示例：
  node scripts/set-site-domain.mjs https://younisekai.pages.dev
  node scripts/set-site-domain.mjs https://blog.example.com/

可选参数：
  --keep-site-url   只改 .decap.yml，不动 younisekai.config.yaml 的 siteURL
`);
    process.exit(1);
}

let url;
try {
    url = new URL(input);
} catch {
    console.error(`❌ 无法解析这个地址：${input}\n   请写成完整形式，例如 https://younisekai.pages.dev`);
    process.exit(1);
}
if (url.protocol !== "https:" && url.protocol !== "http:") {
    console.error("❌ 只支持 http/https 地址");
    process.exit(1);
}

const siteURL = `${url.protocol}//${url.host}/`;
const siteDomain = url.host;

// ---- 1. .decap.yml ----
let decap = readFileSync(DECAP, "utf8");
const decapBefore = decap;

decap = decap.replace(/^(\s*site_domain:\s*).*$/m, `$1${siteDomain}`);
decap = decap.replace(/^(\s*base_url:\s*).*$/m, `$1${url.protocol}//${url.host}`);
decap = decap.replace(/^(site_url:\s*).*$/m, `$1${url.protocol}//${url.host}`);
decap = decap.replace(/^(logo_url:\s*).*$/m, `$1${siteURL}favicon/icon-light.svg`);

if (decap === decapBefore) {
    console.error("❌ .decap.yml 里没有匹配到 site_domain / base_url / site_url / logo_url，请检查文件结构");
    process.exit(1);
}
writeFileSync(DECAP, decap);

// ---- 2. younisekai.config.yaml ----
let siteChanged = false;
if (!keepSiteUrl) {
    const cfg = readFileSync(SITE_CONFIG, "utf8");
    const next = cfg.replace(/^(\s*siteURL:\s*).*$/m, `$1"${siteURL}"`);
    if (next !== cfg) {
        writeFileSync(SITE_CONFIG, next);
        siteChanged = true;
    }
}

console.log(`✅ 站点地址已设置为 ${siteURL}

改动了：
  .decap.yml
    backend.site_domain = ${siteDomain}
    backend.base_url    = ${url.protocol}//${url.host}
    site_url            = ${url.protocol}//${url.host}
    logo_url            = ${siteURL}favicon/icon-light.svg${siteChanged ? `
  younisekai.config.yaml
    site.siteURL        = ${siteURL}` : ""}

接下来：
  1. 把域名的「站点地址 + /oauth/callback」填进 GitHub OAuth App 的回调地址：
     ${siteURL}oauth/callback
  2. 若部署在子路径（如 GitHub Pages 项目站点），另需把 astro.config.mjs 的
     BASE_PATH 或部署平台的 BASE_PATH 环境变量设成 /<仓库名>/
  3. 提交并推送：git add -A && git commit -m "设置站点域名" && git push
`);
