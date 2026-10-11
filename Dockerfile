# syntax=docker/dockerfile:1.7

# ==============================================================================
# younisekai 站点镜像：纯静态构建（产物在 dist/）+ nginx 托管
# 参考自 Twilight (MIT)
#
# 说明：本镜像走纯静态输出，不包含 SSR 与 Decap CMS 的 OAuth 路由。
#       如果需要后台在线登录（ENABLE_CMS_OAUTH=1 启用 SSR 适配器），
#       请改用支持 SSR 的平台（Vercel / Netlify / Cloudflare 等）部署。
# ==============================================================================

# 阶段 1：构建 Astro 站点
# Astro 5 需要 Node 18.20+ / 20.3+ / 22+，此处固定使用 Node 22
FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS=--no-deprecation

# 先复制依赖清单，充分利用 Docker 层缓存
# 注意：npm ci 要求 package-lock.json 与 package.json 完全同步
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# 生成 dist/（包含 Pagefind 搜索索引）
RUN npm run build

# 阶段 2：用 nginx 托管静态文件
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

LABEL org.opencontainers.image.title="younisekai"
LABEL org.opencontainers.image.description="younisekai 静态博客站点镜像"
LABEL org.opencontainers.image.licenses="MIT"
