/**
 * younisekai 新建文章脚本
 * 参考自 Twilight (MIT)
 *
 * 用法：
 *   npm run new-post -- "我的第一篇文章"
 *   npm run new-post -- "指南/入门教程"     # 支持子目录，缺少的目录会自动创建
 *   npm run new-post -- "随笔.mdx"          # 也可以显式指定 .md / .mdx 扩展名
 *   npm run new-post -- "读书笔记" --tags 读书,随笔   # 顺便写好标签
 *
 * 说明：
 *   1. 文章统一生成到 src/content/posts/ 目录下，文件名即文章的 URL 片段；
 *   2. 生成的 frontmatter 字段与 src/content.config.ts 中 posts 集合的 schema 保持一致，
 *      修改 schema 时请同步更新本脚本、.decap.yml 与 _frontmatter.json；
 *   3. 生成后直接编辑该文件即可，改完用 npm run dev 预览。
 */

import fs from "fs"
import path from "path"

const POSTS_DIR = "./src/content/posts"
const HELP_FLAGS = ["-h", "--help", "help"]

/** 取今天的日期，格式 YYYY-MM-DD */
function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/** 生成 YAML 中安全的双引号字符串（JSON 转义对 YAML 双引号标量同样合法） */
function yamlString(value) {
  return JSON.stringify(String(value ?? ""))
}

function printHelp() {
  console.log(`
younisekai 新建文章

用法：
  npm run new-post -- "文章标题"
  npm run new-post -- "子目录/文章标题"
  npm run new-post -- "文章标题.mdx"

参数：
  文章标题    必填。若包含 "/"，则 "/" 之前的部分会被当作 src/content/posts 下的子目录。
              标题中不建议出现 : 等特殊字符（脚本会自动加引号转义）。
  文件名      默认使用标题作为文件名并补上 .md 后缀，也可显式指定 .md / .mdx。

选项：
  --tags <标签1,标签2>   预先填好 tags 字段（英文逗号分隔），可重复使用；简写 -t
  -h, --help             显示本帮助

示例：
  npm run new-post -- "第一篇博客"
  npm run new-post -- "指南/快速开始"
  npm run new-post -- "读书笔记" --tags 读书,随笔
`)
}

const rawArgs = process.argv.slice(2)
const tags = []

// 先处理帮助参数
if (rawArgs.some((arg) => HELP_FLAGS.includes(arg.toLowerCase()))) {
  printHelp()
  process.exit(0)
}

const positional = []

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i]

  if (arg === "--tags" || arg === "-t") {
    const value = rawArgs[++i]
    if (value === undefined) {
      console.error(`错误：--tags 需要一个值，例如 --tags 读书,随笔`)
      process.exit(1)
    }
    for (const tag of value.split(",")) {
      const trimmed = tag.trim()
      if (trimmed) tags.push(trimmed)
    }
    continue
  }

  if (arg.startsWith("-") && arg !== "-") {
    console.error(`错误：未知选项 ${arg}
支持的选项：--tags <标签1,标签2>
用法：npm run new-post -- "文章标题" [--tags 读书,随笔]`)
    process.exit(1)
  }

  positional.push(arg)
}

if (positional.length === 0) {
  console.error(`错误：没有提供文章标题
用法：npm run new-post -- "文章标题"
提示：npm run new-post -- --help 查看完整说明`)
  process.exit(1)
}

let fileName = positional.join(" ").trim()

if (!fileName) {
  console.error(`错误：文章标题不能为空
用法：npm run new-post -- "文章标题"`)
  process.exit(1)
}

// 未指定扩展名时自动补上 .md
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const postsRoot = path.resolve(POSTS_DIR)
const fullPath = path.resolve(postsRoot, fileName)

// 安全校验：文章必须落在 src/content/posts 目录内
const relativeToPosts = path.relative(postsRoot, fullPath)
if (relativeToPosts.startsWith("..") || path.isAbsolute(relativeToPosts)) {
  console.error(`错误：文章必须创建在 ${POSTS_DIR} 目录内，当前路径为 ${fullPath}`)
  process.exit(1)
}

if (fs.existsSync(fullPath)) {
  console.error(`错误：文件已存在：${fullPath}`)
  process.exit(1)
}

// recursive 模式会创建多级目录，因此支持 "子目录/文章标题" 的写法
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

// 标题取文件名（去掉扩展名），子目录不参与标题
const title = path.basename(fileName, path.extname(fileName))

const content = `---
title: ${yamlString(title)}
description: ""
published: ${getDate()}
updated: ""
cover: ""
coverInContent: false
category: ""
tags: ${tags.length > 0 ? JSON.stringify(tags) : "[]"}
lang: ""
pinned: false
draft: false
author: ""
sourceLink: ""
licenseName: ""
licenseUrl: ""
comment: true
encrypted: false
password: ""
copyProtection:
    blockSelection: false
    blockClipboard: false
    blockContextMenu: false
    blockDevTools: false
# 以下为可选字段，需要时取消注释即可
# directoryTitle: ""   # 侧栏目录树中显示的名称，留空则回退为 title
# routeName: ""        # 自定义文章路径，不使用文件名作为 URL 片段
---

`

fs.writeFileSync(fullPath, content, "utf8")

console.log(`✅ 已创建文章：${path.relative(process.cwd(), fullPath)}`)
console.log(`   标题：${title}`)
console.log(`   下一步：编辑该文件，然后执行 npm run dev 预览`)
