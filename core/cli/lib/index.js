'use strict';
// import { createRequire } from "module";
// const require from createRequire(import.meta.url);
import log from '@zero-cli-dev/log';
// import pkg from '../package.json';
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync('./package.json'));
import constant from './const.js';
import semver from 'semver';
import colors from 'colors/safe.js';
import rootCheck from 'root-check'; // 这个是纯ES module的库
import userHome from 'user-home';
import {pathExists} from 'path-exists';
import process from 'process';

export default function core() {
    try {
        checkPkgVersion(); // 检查package版本
        checkNodeVersion(); // 检查node版本
        checkRoot(); // 检查是否root账号启动
        checkUserHome(); // 检查用户主目录
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
    console.log(process.geteuid);
}

function checkUserHome(){
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkParams (){}

function checkEnvVal(){}

function checkUpdate(){}
