#! /usr/bin/env node
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
import path from "path";
const __dirname = path.resolve();
const __filename = import.meta.url && import.meta.url.substring(7, import.meta.url.length); // 截掉file://
// console.log(path);
import log from '@zero-cli-dev/log';
import importLocal from 'import-local';
import core from '../lib/index.js';
console.log(__dirname);
console.log(__filename);
if (importLocal(__filename)) {
	log.info('cli', '正在使用zero-cli 本地版本');
} else {
	core(process.argv.slice(2)); // core
}
console.log('hello zero-cli 2022')