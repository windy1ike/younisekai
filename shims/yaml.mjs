/**
 * `yaml` 这个包只发布了 CommonJS 构建（package.json 的 exports 里，node 条件指向 dist/index.js）。
 *
 * Astro 7 + Vite 8 在加载内容集合配置（src/content.config.ts）时，会把 node_modules 里的依赖
 * 内联进 SSR module runner 执行，CommonJS 里的 require 在 ESM 上下文里就炸了，报错：
 *   require is not defined  ← at node_modules/yaml/dist/index.js
 *
 * 解决方式：用一个 ESM 包装层替掉 yaml —— 用 Node 自己的 require 去加载真正的 CJS 实现，
 * 再以 ESM 具名导出转发出去。astro.config.mjs 里通过 resolve.alias 把 "yaml" 指到这里。
 *
 * 日后若 Astro / Vite 修好了 CJS 依赖的处理，或 yaml 发布了 ESM 构建，可以删掉本文件
 * 和 astro.config.mjs 里对应的 alias 配置。
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const yaml = require('yaml');

export default yaml;

export const {
  Alias,
  CST,
  Composer,
  Document,
  Lexer,
  LineCounter,
  Pair,
  Parser,
  Scalar,
  Schema,
  YAMLError,
  YAMLMap,
  YAMLParseError,
  YAMLSeq,
  YAMLWarning,
  isAlias,
  isCollection,
  isDocument,
  isMap,
  isNode,
  isPair,
  isScalar,
  isSeq,
  parse,
  parseAllDocuments,
  parseDocument,
  stringify,
  visit,
  visitAsync,
} = yaml;
