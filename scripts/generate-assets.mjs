/**
 * younisekai 占位素材生成脚本
 *
 * 生成全站用到的 SVG 插画素材：壁纸、头像、文章封面、相册 / 日记配图、
 * 友链头像等。所有图形都是纯 SVG（渐变 + 模糊 + 噪点 + 山脊剪影），
 * 不依赖任何第三方库或外部图片，方便你直接替换成自己的作品。
 *
 * 用法：
 *   npm run assets
 *
 * 生成结果（相对 public/）：
 *   assets/images/desktopWallpaper_1..3.svg   桌面壁纸
 *   assets/images/mobileWallpaper_1..2.svg    移动壁纸
 *   assets/images/avatar.svg                  头像
 *   assets/images/covers/cover-01..06.svg     文章封面
 *   assets/images/diary/diary-01..04.svg      日记配图
 *   assets/images/placeholders/p-01..16.svg   通用占位图（可复制到内容目录）
 *   assets/images/placeholders/a-01..08.svg   通用头像占位
 *   favicon/icon-light.svg, icon-dark.svg     站点图标
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

/** 确定性随机数（同一个 seed 永远画出同一张图） */
function makeRandom(seed) {
    let state = seed >>> 0 || 1;
    return () => {
        state ^= state << 13;
        state >>>= 0;
        state ^= state >> 17;
        state ^= state << 5;
        state >>>= 0;
        return state / 4294967296;
    };
}

const round = (n) => Math.round(n * 100) / 100;

/**
 * 生成一张「紫罗兰暮色」风格插画
 *
 * @param {object} options
 * @param {number} options.width  画布宽
 * @param {number} options.height 画布高
 * @param {number} options.seed   随机种子
 * @param {number} options.hue    主色相
 * @param {boolean} options.horizon 是否画山脊与地平线
 */
function scenery({ width, height, seed, hue = 265, horizon = true, stars = 90 }) {
    const rnd = makeRandom(seed);
    const h = (offset, spread = 8) => round((hue + offset + (rnd() - 0.5) * spread + 360) % 360);

    const skyTop = `hsl(${h(-30)} 55% 9%)`;
    const skyMid = `hsl(${h(-8)} 48% 20%)`;
    const skyLow = `hsl(${h(24)} 58% 34%)`;
    const glow = `hsl(${h(46)} 82% 62%)`;
    const auroraA = `hsl(${h(-60)} 80% 62%)`;
    const auroraB = `hsl(${h(60)} 78% 60%)`;

    const starShapes = Array.from({ length: stars }, () => {
        const x = round(rnd() * width);
        const y = round(rnd() * height * (horizon ? 0.68 : 0.9));
        const r = round(0.6 + rnd() * 2.1);
        const o = round(0.25 + rnd() * 0.6);
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`;
    }).join("");

    // 山脊剪影：用折线拼出一条起伏的天际线
    const ridge = (baseline, amplitude, steps, fill, opacity) => {
        const points = [];
        for (let i = 0; i <= steps; i += 1) {
            const x = (width / steps) * i;
            const noise =
                Math.sin(i * 0.7 + seed % 10) * 0.5 + Math.sin(i * 1.9 + seed % 7) * 0.3 + (rnd() - 0.5) * 0.5;
            const y = baseline - amplitude * (0.5 + noise * 0.7);
            points.push(`${round(x)},${round(y)}`);
        }
        return `<path d="M0,${round(height)} L${points.join(" L")} L${round(width)},${round(height)} Z" fill="${fill}" opacity="${opacity}"/>`;
    };

    const ridges = horizon
        ? [
              ridge(height * 0.78, height * 0.16, 14, `hsl(${h(-26)} 46% 12%)`, 0.75),
              ridge(height * 0.85, height * 0.12, 18, `hsl(${h(-14)} 40% 8%)`, 0.85),
              ridge(height * 0.93, height * 0.08, 22, `hsl(${h(-4)} 34% 5%)`, 0.95),
          ].join("")
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="younisekai placeholder artwork">
    <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stop-color="${skyTop}"/>
            <stop offset="46%" stop-color="${skyMid}"/>
            <stop offset="82%" stop-color="${skyLow}"/>
            <stop offset="100%" stop-color="${glow}"/>
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="${glow}" stop-opacity="0.95"/>
            <stop offset="55%" stop-color="${glow}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${auroraA}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${auroraB}" stop-opacity="0.12"/>
        </linearGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="${round(Math.min(width, height) * 0.06)}"/>
        </filter>
        <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed % 97}" result="n"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
        </filter>
        <clipPath id="clip"><rect width="${width}" height="${height}"/></clipPath>
    </defs>
    <g clip-path="url(#clip)">
        <rect width="${width}" height="${height}" fill="url(#sky)"/>
        <ellipse cx="${round(width * (0.25 + rnd() * 0.5))}" cy="${round(height * (0.7 + rnd() * 0.12))}" rx="${round(width * 0.42)}" ry="${round(height * 0.3)}" fill="url(#sun)" filter="url(#soft)"/>
        <ellipse cx="${round(width * (0.15 + rnd() * 0.7))}" cy="${round(height * (0.18 + rnd() * 0.2))}" rx="${round(width * 0.5)}" ry="${round(height * 0.16)}" fill="url(#aurora)" filter="url(#soft)" transform="rotate(${round(-12 + rnd() * 24)} ${round(width / 2)} ${round(height * 0.25)})"/>
        <ellipse cx="${round(width * (0.1 + rnd() * 0.8))}" cy="${round(height * (0.12 + rnd() * 0.2))}" rx="${round(width * 0.34)}" ry="${round(height * 0.1)}" fill="url(#aurora)" filter="url(#soft)"/>
        ${starShapes}
        ${ridges}
        <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.55"/>
    </g>
</svg>
`;
}

/** 头像 / 站点图标：黄昏圆环 + 弯月 */
function emblem(size, hue) {
    const r = size / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="younisekai">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue - 24} 62% 24%)"/>
            <stop offset="100%" stop-color="hsl(${hue + 38} 74% 46%)"/>
        </linearGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue + 70} 92% 74%)"/>
            <stop offset="100%" stop-color="hsl(${hue - 40} 86% 66%)"/>
        </linearGradient>
        <filter id="soften" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="${round(size * 0.035)}"/>
        </filter>
    </defs>
    <rect width="${size}" height="${size}" rx="${round(size * 0.24)}" fill="url(#bg)"/>
    <g filter="url(#soften)" opacity="0.7">
        <circle cx="${round(r * 0.72)}" cy="${round(r * 0.66)}" r="${round(r * 0.5)}" fill="hsl(${hue + 60} 90% 66%)" opacity="0.5"/>
        <circle cx="${round(r * 1.3)}" cy="${round(r * 1.4)}" r="${round(r * 0.66)}" fill="hsl(${hue - 30} 80% 55%)" opacity="0.45"/>
    </g>
    <circle cx="${r}" cy="${r}" r="${round(r * 0.66)}" fill="none" stroke="url(#ring)" stroke-width="${round(size * 0.045)}" opacity="0.9"/>
    <path d="M ${round(r * 1.42)} ${round(r * 0.62)} a ${round(r * 0.5)} ${round(r * 0.5)} 0 1 1 ${round(-r * 0.72)} ${round(r * 0.62)} a ${round(r * 0.42)} ${round(r * 0.42)} 0 1 0 ${round(r * 0.72)} ${round(-r * 0.62)} Z" fill="hsl(${hue + 80} 96% 88%)" opacity="0.95"/>
</svg>
`;
}

/** 抽象封面：渐变 + 光斑 + 细网格 */
function cover({ width = 1200, height = 630, seed, hue }) {
    const rnd = makeRandom(seed);
    const blobs = Array.from({ length: 3 }, () => {
        const cx = round(rnd() * width);
        const cy = round(rnd() * height);
        const r0 = round((0.22 + rnd() * 0.3) * width);
        const hueShift = round(-70 + rnd() * 140);
        return `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="hsl(${round((hue + hueShift + 360) % 360)} 82% ${round(52 + rnd() * 18)}%)" opacity="${round(0.28 + rnd() * 0.3)}"/>`;
    }).join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="younisekai cover">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${round(hue - 20)} 58% 18%)"/>
            <stop offset="100%" stop-color="hsl(${round(hue + 45)} 70% 42%)"/>
        </linearGradient>
        <filter id="blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="${round(width * 0.07)}"/>
        </filter>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0 L0 0 0 60" fill="none" stroke="#fff" stroke-opacity="0.07" stroke-width="1"/>
        </pattern>
        <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${seed % 89}" result="n"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
        </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <g filter="url(#blur)">${blobs}</g>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>
    <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.6"/>
</svg>
`;
}

/** 小尺寸头像占位：渐变方块 + 几何印记 */
function avatar({ size = 256, seed, hue }) {
    const rnd = makeRandom(seed);
    const shift = round(-40 + rnd() * 80);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="avatar placeholder">
    <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${round((hue + shift + 360) % 360)} 70% 40%)"/>
            <stop offset="100%" stop-color="hsl(${round((hue + shift + 60 + 360) % 360)} 76% 62%)"/>
        </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${round(size * 0.22)}" fill="url(#g)"/>
    <circle cx="${round(size * 0.34)}" cy="${round(size * 0.62)}" r="${round(size * 0.26)}" fill="#fff" opacity="0.22"/>
    <circle cx="${round(size * 0.7)}" cy="${round(size * 0.36)}" r="${round(size * 0.16)}" fill="#fff" opacity="0.3"/>
    <path d="M ${round(size * 0.12)} ${round(size * 0.82)} L ${round(size * 0.5)} ${round(size * 0.28)} L ${round(size * 0.88)} ${round(size * 0.82)}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="${round(size * 0.045)}" stroke-linecap="round"/>
</svg>
`;
}

const files = [];

function emit(relativePath, content) {
    const target = join(PUBLIC, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    files.push(relativePath);
}

// 壁纸
[1, 2, 3].forEach((i) => {
    emit(
        `assets/images/desktopWallpaper_${i}.svg`,
        scenery({ width: 1920, height: 1080, seed: 1013 * i, hue: 250 + i * 18, stars: 110 }),
    );
});
[1, 2].forEach((i) => {
    emit(
        `assets/images/mobileWallpaper_${i}.svg`,
        scenery({ width: 1080, height: 1920, seed: 7717 * i, hue: 240 + i * 26, stars: 70 }),
    );
});

// 头像与站点图标
emit("assets/images/avatar.svg", emblem(512, 265));
emit("favicon/icon-light.svg", emblem(96, 268));
emit("favicon/icon-dark.svg", emblem(96, 258));

// 文章封面
Array.from({ length: 6 }, (_, i) => {
    emit(
        `assets/images/covers/cover-0${i + 1}.svg`,
        cover({ seed: 3301 + i * 977, hue: 232 + i * 26 }),
    );
});

// 日记配图
Array.from({ length: 4 }, (_, i) => {
    emit(
        `assets/images/diary/diary-0${i + 1}.svg`,
        scenery({ width: 1600, height: 1000, seed: 5101 + i * 613, hue: 258 + i * 22, stars: 80 }),
    );
});

// 通用占位池（内容目录里需要相对路径图片时，从这里复制）
Array.from({ length: 16 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    emit(
        `assets/images/placeholders/p-${n}.svg`,
        i % 3 === 0
            ? scenery({ width: 1600, height: 1000, seed: 9001 + i * 401, hue: 230 + i * 17, stars: 60 })
            : cover({ seed: 9001 + i * 401, hue: 230 + i * 17 }),
    );
});
Array.from({ length: 8 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    emit(`assets/images/placeholders/a-${n}.svg`, avatar({ seed: 4201 + i * 331, hue: 235 + i * 24 }));
});

console.log(`✅ 生成 ${files.length} 个占位素材：`);
for (const f of files) console.log(`   public/${f}`);
