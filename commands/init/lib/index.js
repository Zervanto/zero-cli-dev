// 'use strict';

// import log from '@zero-cli-dev/log';
import Command from '@zero-cli-dev/command';
class InitCommand extends Command {
    
    // log.info('init', projectName, cmdObj.force);
}

function init (argv) {
    return new InitCommand(argv);
}
export default init;