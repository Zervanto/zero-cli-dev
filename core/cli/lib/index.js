'use strict';
// import { createRequire } from "module";
// const require from createRequire(import.meta.url);
import log from '@zero-cli-dev/log';
import path from 'path';
// const pkg = require('../package.json');
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync('./core/cli/package.json'));
import constant from './const.js';
import semver from 'semver'; // 版本号比较
import colors from 'colors/safe.js';
import rootCheck from 'root-check'; // 检查root账号 这个是纯ES module的库
import userHome from 'user-home'; // 用户主目录
import { pathExistsSync } from 'path-exists'; // 路径是否存在
import process from 'process'; // node 进程
import dotenv from 'dotenv'; // 从env文件中加载环境变量
import { getNpmSemverVersions } from '@zero-cli-dev/get-npm-info';
import init from '@zero-cli-dev/init';
import exec from '@zero-cli-dev/exec';
import { Command } from 'commander';
const program = new Command();
function checkPkgVersion() {
  log.info('cli', pkg.version);
}

function checkNodeVersion() {
  // 拿到node版本号 process.version
  // 比对最低版本号
  if (!semver.gte(process.version, constant.LOWEST_NODE_VERSION)) {
    throw new Error(
      colors.red(
        `zero-cli 需要安装 v${constant.LOWEST_NODE_VERSION}以上的node版本`
      )
    );
  }
}

function checkRoot() {
  rootCheck();
  // console.log(process.geteuid);
}

function checkUserHome() {
  if (!userHome || !pathExistsSync(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}

function checkEnv() {
  const dotenvPath = path.resolve(userHome, '.env'); // 找到env文件
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig(); // 创建默认环境变量的配置
}
// 创建默认配置
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
async function checkGlobalUpdate() {
  // 1. 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2. 调用npm API, 获取所有版本号
  // 3. 判断是否有比当前版本号更大的版本
  const lastVersion = await getNpmSemverVersions(currentVersion, npmName);
  // 4. 提示用户更新到最新版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      '更新提示',
      color.yellow(`请手动更新${npmName}, 当前版本：${currentVersion}, 最新版本：${lastVersion}
        更新命令： npm install -g ${npmName}`)
    );
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .version(pkg.version)
    .usage('<command> [options]')
    .option('-d --debug', '是否开启调试模式', false)
    .option('-tp --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  program
    .command('init [projectName]')
    .option('-f --force', '是否强制初始化项目')
    .action(init)
    .action(exec); // 命令执行

  program.on('option:debug', function () {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  });
  program.on('option:targetPath', function () {
    console.log(program.opts().targetPath);
    process.env.CLI_TRAGET_PATH = program.targetPath;
  });
  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    log.info(colors.red('未知的命令：' + obj[0]));
    if (availableCommands.length > 0) {
      log.info(colors.red('可用命令：' + availableCommands.join(',')));
    }
  });
  if (process.argv.length < 3) {
    program.outputHelp();
  }
  program.parse(process.argv);
}
function prepare() {
  checkPkgVersion(); // 检查package版本
  checkRoot(); // 检查是否root账号启动
  checkUserHome(); // 检查用户主目录
  checkEnv(); // 检查环境变量
  checkGlobalUpdate(); // 检查全局更新
}
export default async function core() {
  try {
    await prepare();
    checkNodeVersion(); // 检查node版本
    registerCommand(); // 命令注册
  
  } catch (e) {
    log.error(e.message);
    if(program.opts().debug) {
      console.log(e);
    }
  }
}
