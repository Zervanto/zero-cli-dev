// 'use strict';

// module.exports = exec;
import process from 'node:process';
import Package from '@zero-cli-dev/package';
import log from '@zero-cli-dev/log';
import path from 'node:path';
import cp from 'node:child_process';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

const SETTINGS = {
  init: '@zero-cli-dev/init',
};
const CACHE_DIR = 'dependencies';
async function exec() {
  // 本地代码的地址
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = '';
  const homePath = process.env.CLI_HOME_PATH;
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
    log.verbose('update', 'update');
    pkg.update();
  } else {
    // 安装
    log.verbose('install', 'install');
    await pkg.install();
  }
  const rootFile = pkg.getRootFilePath();
  console.log('rootFile', rootFile);
  if (rootFile) {
    // require(rootFile).call(null, Array.from(arguments));
    try {
      // 使用子进程调用优化性能
      const args = Array.from(arguments);
      const cmd = args[args.length - 1];
      const o = Object.create(null);
      Object.keys(cmd).forEach((key) => {
        if (
          cmd.hasOwnProperty(key) &&
          !key.startsWith('_') &&
          key !== 'parent'
        ) {
          o[key] = cmd[key];
        }
      });
      args[args.length - 1] = o;
      //   console.log('args', args);
      const code = `(async () => {(await import('${rootFile}')).default.call(null, ${JSON.stringify(
        args
      )})})().catch(err => {console.error(err)})`;
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });
      child.on('error', (e) => {
        log.error(e.message);
        process.exit(1);
      });
      child.on('exit', (e) => {
        log.verbose('命令执行成功' + e);
        process.exit(e);
      });
    } catch (e) {
      log.error(e.message);
    }
  }
function spawn(command, args, options){
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd': command;
  const cmdArgs = win32 ? ['/c'].concat(command, args): args;
  return cp.spawn(cmd, cmdArgs, options || {});
}
  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);
}

export default exec;
