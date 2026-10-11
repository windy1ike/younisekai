# 本地图标目录

`astro-icon` 会自动扫描本目录下的 SVG 文件作为「本地图标」，可以在组件里这样用：

```astro
---
import { Icon } from "astro-icon/components";
---

<Icon name="logo" class="w-6 h-6" />
```

放一个 `logo.svg` 进来，就能用 `name="logo"` 引用它；图标会自动跟随 `currentColor` 着色。

站点用到的大部分图标来自 Iconify 图标集（`fa6-solid:*`、`fa6-brands:*`、`material-symbols:*` 等），
不需要放在这里 —— 构建时 `scripts/generate-icons.js` 会把它们内联进 `src/utils/icons.ts`。
本目录留空即可，仅用于放你自己设计的图标。
