'use strict';

// module.exports = exec;
import proccess from 'process';
import Package from '@zero-cli-dev/package';
import log from '@zero-cli-dev/log';

const SETTINGS = {
    init: '@zero-cli-dev/init'
};
function exec() {
    const targetPath = proccess.env.CLI_TARGET_PATH;
    const homePath = proccess.env.CLI_HOME_PATH;
   
    // arguments为内置参数
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    console.log(cmdObj.opts().force);
    const pkg = new Package({
        targetPath,
        homePath,
        packageName,
        packageVersion
    });
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);
}

export default exec;