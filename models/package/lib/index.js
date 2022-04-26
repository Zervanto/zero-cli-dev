// 'use strict';

// import log from '@zero-cli-dev/log';
import { isObject } from '@zero-cli-dev/utils';
import formatPath from '@zero-cli-dev/format-path';
import { packageDirectorySync } from 'pkg-dir';
import path from 'path';
import npminstall from 'npminstall';
// import userHome from 'user-home';
import cp from 'child_process'
import fse from 'fs-extra';
import {
  getDefaultRegistry,
  getNpmLatestVersion,
} from '@zero-cli-dev/get-npm-info';
import { pathExistsSync } from 'path-exists'; // 路径是否存在
class Package {
  constructor(options) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参数必须为对象！');
    }

    // package的路径
    this.targetPath = options.targetPath;
    // package的存储路径
    this.storeDir = options.storeDir;
    this.homePath = options.homePath;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }
  // _@zero-cli-dev_init@1.0.0@zero-cli-dev/
  // @zero-cli-dev/init 1.0.0
  // _@zero-cli-dev_init@1.0.0@@zero-cli-dev/
  get cacheFilePath() {
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    );
  }
  // 判断当前package是否存在
  async exists() {
    // 缓存目录存在
    if (this.storeDir) {
      await this.prepare();
      return pathExistsSync(this.cacheFilePath);
    } else {
      return pathExistsSync(this.targetPath);
    }
  }
  // 安装package
  install() {
    // 异步方法 需要async await
    npminstall({
      root: this.targetPath,
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
      registry: getDefaultRegistry(true),
      storeDir: this.storeDir,
    });
  }
  // 更新package
  async update() {
      await this.prepare();
      // 获取最新的npm模块版本号
      const latestPackageVersion = await getNpmLatestVersion(this.packageName);
      // 查询最新版本对应路径是否存在
      const lastestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
      // 如果不存在，更新到最新版本
      if(!pathExistsSync(lastestFilePath)){
          await npminstall({
            root: this.targetPath,
            pkgs: [{ name: this.packageName, version: latestPackageVersion }],
            registry: getDefaultRegistry(true),
            storeDir: this.storeDir,
          });
          this.packageVersion = latestPackageVersion;
      }
      
  }

  async prepare() {
    if(this.storeDir && !pathExistsSync(this.storeDir)) {
        fse.mkdirpSync(this.storeDir);
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
  }
  // 获取入口文件的路径
  getRootFilePath() {
    // 获取package.json所在目录
    const dir = packageDirectorySync(this.targetPath);
    if (dir) {
      // 读取package.json
      const pkgJson = JSON.parse(fse.readFileSync(path.resolve(dir, 'core/cli/', 'package.json')))
      console.log('pkgJson', pkgJson);
      // 寻找main/lib
      if (pkgJson && pkgJson.main) {
        // 路径兼容处理 window/mac
        return formatPath(path.resolve(dir, pkgJson.main));
      }
    }
    return null;
  }
  getSpecificCacheFilePath (packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
  }
}

export default Package;
