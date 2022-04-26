// 'use strict';

// module.exports = exec;
import proccess from 'node:process';
import Package from '@zero-cli-dev/package';
import log from '@zero-cli-dev/log';
import path from 'node:path';
// import { cp } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const SETTINGS = {
  init: '@zero-cli-dev/init',
};
const CACHE_DIR = 'dependencies';
async function exec() {
  // 本地代码的地址
  let targetPath = proccess.env.CLI_TARGET_PATH;
  let storeDir = '';
  const homePath = proccess.env.CLI_HOME_PATH;
  //   log.verbose('targetPath', targetPath);
  //   log.verbose('homePath', homePath);
  // arguments为内置参数
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';
  log.verbose('targetPath', targetPath);
  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存路径
    storeDir = path.resolve(targetPath, 'node_modules');
  }
  log.verbose('targetPath', targetPath);
  log.verbose('storeDir', storeDir);
  const pkg = new Package({
    targetPath,
    homePath,
    packageName,
    packageVersion,
    storeDir,
  });
  if (pkg.exists()) {
    // 更新
    log.verbose('update', 'update')
    pkg.update();
  } else {
    // 安装
    log.verbose('install', 'install')
    await pkg.install();
  }
  const rootFile = pkg.getRootFilePath();
  console.log('rootFile', rootFile);
  if (rootFile) {
    require(rootFile).call(null, Array.from(arguments));
    // 使用子进程调用优化性能
    // cp.spawn()
  }

  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);
}

export default exec;
