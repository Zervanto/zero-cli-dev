#! /usr/bin/env node
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import log from '@zero-cli-dev/log';
import importLocal from 'import-local';
import core from '../lib/index.js';
log.verbose('__dirname', __dirname);
log.verbose('__filename', __filename);
if (importLocal(__filename)) {
  log.info('cli', '正在使用zero-cli 本地版本');
} else {
  core(process.argv.slice(2)); // core
}
log.info('hello', 'zero-cli-dev 2022');
