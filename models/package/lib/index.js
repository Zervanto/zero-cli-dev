'use strict';

import log from '@zero-cli-dev/log';
import { isObject } from '@zero-cli-dev/utils';
import formatPath from '@zero-cli-dev/format-path';
import { packageDirectorySync } from 'pkg-dir';
import path from 'path';
import npminstall from 'npminstall';
import userHome from 'user-home';
import { getDefaultRegistry } from '@zero-cli-dev/get-npm-info';

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
  }
  // 判断当前package是否存在
  exists() {}
  // 安装package
  install() {
    (async () => {
        await npminstall({
          root: this.targetPath,
          pkgs: [
            { name: this.packageName, version: this.packageVersion },
          ],
          registry: getDefaultRegistry(true),
          storeDir: this.storeDir
        });
      })().catch(err => {
        throw new Error(err);
      });
  }
  // 更新package
  update() {}
  // 获取入口文件的路径
  getRootFilePath() {
    // 获取package.json所在目录
    const dir = packageDirectorySync(this.targetPath);
    if (dir) {
      // 读取package.json
      const file = path.resolve(dir, 'package.json');
      // 寻找main/lib
      if(file && file.main){
          // 路径兼容处理 window/mac
          return formatPath(path.resolve(dir, file.main));
      }     
    }
    return null;
    
  }
}

export default Package;
