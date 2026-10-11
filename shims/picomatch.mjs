/**
 * 与 shims/yaml.mjs 同样的原因：picomatch 只有 CommonJS 构建。
 * 见 shims/yaml.mjs 顶部注释。
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const picomatch = require('picomatch');

export default picomatch;
export const {
  makeRe,
  scan,
  parse,
  compile,
  test,
  matchBase,
  braces,
  constants,
  isMatch,
} = picomatch;
