'use strict';

// module.exports = exec;
import proccess from 'process';
import Package from '@zero-cli-dev/package';
import log from '@zero-cli-dev/log';
import path from 'path';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const SETTINGS = {
    init: '@zero-cli-dev/init'
};
const CACHE_DIR = 'dependencies';
function exec() {
    let targetPath = proccess.env.CLI_TARGET_PATH;
    let storeDir = '';
    const homePath = proccess.env.CLI_HOME_PATH;
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);
    // arguments为内置参数
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    if(!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', homePath);
    }
    const pkg = new Package({
        targetPath,
        homePath,
        packageName,
        packageVersion,
        storeDir
    });
    if(pkg.exists()){
        // 更新
        pkg.update();
    }else{
        // 安装
        pkg.install();
    }
    const rootFile = pkg.getRootFilePath();
    console.log('rootFile', rootFile);
    if(rootFile){
        require(rootFile).apply(null, arguments);
    }
    
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);
}

export default exec;