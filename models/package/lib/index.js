'use strict';

import log from '@zero-cli-dev/log';
import { isObject } from '@zero-cli-dev/utils';

class Package {
    constructor(options) {
        if(!options){
            throw new Error('Package类的options参数不能为空！')
        }
        if(!isObject(options)){
            throw new Error('Package类的options参数必须为对象！')
        }

        // package的路径
        this.targetPath = options.targetPath;
        // package的存储路径
        this.storePath = options.storePath;
        this.homePath = options.homePath;
        this.packageName = options.packageName;
        this.packageVersion = options.packageVersion;
    }
    // 判断当前package是否存在
    exists() {}
    // 安装package
    install() {}
    // 更新package
    update() {}
}

export default Package;