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
import {pathExists} from 'path-exists'; // 路径是否存在
import process from 'process'; // node 进程
import minimist from 'minimist'; //
import dotenv from 'dotenv'; // 从env文件中加载环境变量
import getNpmInfo from '@zero-cli-dev/get-npm-info';
console.log(pkg);
let config;
export default function core() {
    try {
        checkPkgVersion(); // 检查package版本
        checkNodeVersion(); // 检查node版本
        checkRoot(); // 检查是否root账号启动
        checkUserHome(); // 检查用户主目录
        checkInputArgs(); //检查入参 debug模式
        log.verbose('debug', 'test debug log');
        checkEnv(); // 检查环境变量
        checkGlobalUpdate(); // 检查全局更新
    } catch(e){
        log.error(e.message);
    }
}

function checkPkgVersion(){
    log.info('cli', pkg.version);
}

function checkNodeVersion() { 
    // 拿到node版本号 process.version
    // 比对最低版本号
    if(!semver.gte(process.version, constant.LOWEST_NODE_VERSION)){
        throw new Error(colors.red(`zero-cli 需要安装 v${constant.LOWEST_NODE_VERSION}以上的node版本`))
    }

}

function checkRoot(){
    rootCheck();
    // console.log(process.geteuid);
}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkInputArgs (){
    const args = minimist(process.argv.slice(2));
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

function checkEnv(){
    const dotenvPath = path.resolve(userHome, 'env');
    if(pathExists(dotenvPath)){
        config = dotenv.config({
            path:dotenvPath
        });
    }
    createDefaultConfig(); // 创建默认环境变量的配置
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}
// 创建默认配置
function createDefaultConfig(){
    const cliConfig = {
        home: userHome
    };
    if(process.env.CLI_HOME){
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
function checkGlobalUpdate(){
    // 1. 获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 2. 调用npm API, 获取所有版本号
    getNpmInfo(npmName);
    // 3. 判断是否有比当前版本号更大的版本
    // 4. 提示用户更新到最新版本
}
