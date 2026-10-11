/**
 * eventemitter3 的 ESM 入口（index.mjs）内部是从 CommonJS 的 index.js 里
 * `import EventEmitter from './index.js'` 转出来的。Vite 在 dev 时把 CJS 内联成 ESM 执行，
 * index.js 里 `if ('undefined' !== typeof module) module.exports = EventEmitter` 这行不成立，
 * 于是具名导出变成 undefined，p-queue 的 `class PQueue extends EventEmitter` 直接报
 * "Class extends value undefined"。这里直接用 Node 的 require 拿真正的实现。
 *
 * 见 shims/yaml.mjs 顶部注释。
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const EventEmitter = require('eventemitter3');

export { EventEmitter };
export default EventEmitter;
