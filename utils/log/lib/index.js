'use strict';
const log = require('npmlog');

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; // 判断debug模式
log.heading = 'zero';
log.headingStyle = { fg: 'red', bold: true };
log.addLevel('success', 2000, { fg: 'green', bold: true });
module.exports = log;