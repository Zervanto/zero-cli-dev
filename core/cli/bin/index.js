#! /usr/bin/env node
const utils = require('@zero-cli-dev/utils/lib');
const importLocal = require('import-local');
console.log(__filename);
if (importLocal(__filename)) {
	require('npmlog').info('cli', '正在使用zero-cli 本地版本');
} else {
	require('../lib')(process.argv.slice(2)); // core
}
utils()
console.log('hello zero-cli 2023')