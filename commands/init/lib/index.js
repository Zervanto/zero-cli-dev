// 'use strict';
import inquirer from 'inquirer';
import log from '@zero-cli-dev/log';
import Command from '@zero-cli-dev/command';
class InitCommand extends Command {
    init(){
        this.projectName = this._argv[0] || '';
        // this.force = this._argv[1] ？ this._argv[1].force;
        log.verbose('projectName', this.projectName)
        log.verbose('force', this._cmd)
    }
    exec(){}
    // log.info('init', projectName, cmdObj.force);
}

function init (argv) {
    return new InitCommand(argv);
}
export default init;