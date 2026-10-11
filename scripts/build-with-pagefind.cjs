/* younisekai 构建脚本：先执行 Astro 构建，再调用 Pagefind 生成静态搜索索引
 *
 * 参考自 Twilight (MIT)
 *
 * 产物目录约定：
 *   - 纯静态部署（本地 / GitHub Pages / Cloudflare Pages / Netlify 等）：dist
 *   - Vercel（带 SSR 适配器）：.vercel/output/static
 * Pagefind 会自动读取项目根目录下的 pagefind.yml 配置。
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');

// 判断当前部署平台
function detectPlatform() {
    // 依次检查各平台注入的环境变量
    if (process.env.GITHUB_ACTIONS) {
        return 'github';
    }
    if (process.env.CF_PAGES) {
        return 'cloudflare';
    }
    if (process.env.NETLIFY) {
        return 'netlify';
    }
    if (process.env.VERCEL) {
        return 'vercel';
    }

    // 默认按标准 dist 目录处理
    // 注意：这里刻意不通过「是否存在 .vercel 目录」来判断平台，
    // 因为本地跑过 SSR 适配器构建后会残留 .vercel 目录，
    // 而纯静态构建的产物其实在 dist，容易把搜索索引写进过期产物里。
    return 'default';
}

// 获取 Pagefind 的输出目录
function getPagefindOutputDir(platform) {
    const outputDirs = {
        default: 'dist',
        github: 'dist',
        cloudflare: 'dist',
        netlify: 'dist',
        vercel: '.vercel/output/static',
    };

    return outputDirs[platform] || 'dist';
}

// 解析真正存在的产物目录：优先使用平台对应目录，缺失时回退到 dist
function resolveOutputDir(preferred) {
    if (existsSync(preferred)) {
        return preferred;
    }
    if (preferred !== 'dist' && existsSync('dist')) {
        console.warn(`⚠️  未找到平台产物目录 ${preferred}，回退使用 dist`);
        return 'dist';
    }
    return preferred;
}

// 主流程
function main() {
    const platform = detectPlatform();
    const preferredOutputDir = getPagefindOutputDir(platform);

    console.log(`🚀 检测到的部署平台：${platform}`);
    console.log(`📁 预期的 Pagefind 索引目录：${preferredOutputDir}`);

    try {
        // 执行 Astro 构建
        console.log('🔨 正在执行 Astro 构建...');
        execSync('npx astro build'.trim(), {
            stdio: 'inherit',
            cwd: process.cwd() // 确保在项目根目录执行
        });

        const outputDir = resolveOutputDir(preferredOutputDir);

        // 检查产物目录是否存在
        if (!existsSync(outputDir)) {
            console.error(`❌ 产物目录不存在：${outputDir}`);
            process.exit(1);
        }

        // 生成 Pagefind 搜索索引
        console.log(`🔍 正在生成 Pagefind 搜索索引（目录：${outputDir}）...`);
        execSync(`npx pagefind --site ${outputDir}`, {
            stdio: 'inherit',
            cwd: process.cwd() // 确保在项目根目录执行
        });

        console.log('✅ 构建完成！');
        console.log(`📊 搜索索引已生成于：${outputDir}/pagefind/`);

    } catch (error) {
        console.error('❌ 构建失败：', error.message);
        process.exit(1);
    }
}

main();
