import log from '@zero-cli-dev/log';
import semver from 'semver'; // 版本号比较
import colors from 'colors/safe.js';
import process from 'node:process';
const LOWEST_NODE_VERSION = '13.0.0';
class Command {
    constructor(argv){
        console.log('argv',argv);
        if(!argv){
            throw new Error('参数不能为空!')
        }
        if(!Array.isArray(argv)){
            throw new Error('参数必须为数组！')
        }
        this._argv = argv;
        let runner = new Promise((resolve, reject)=>{
            let chain = Promise.resolve();
            // 检查node版本
            chain.then(() => this.checkNodeVersion()).then(()=> {
                    this.initArgs()
            }).then(() => this.init()).then(() => this.exec()).catch(err => {
                console.log(err.message);
            })
        })
    }
     checkNodeVersion() {
        // 拿到node版本号 process.version
        // 比对最低版本号
        if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
          throw new Error(
            colors.red(
              `zero-cli 需要安装 v${LOWEST_NODE_VERSION}以上的node版本`
            )
          );
        }
      }
      initArgs(){
         log.verbose('_argv', this._argv) 
         log.verbose('_cmd', this._cmd) 
        this._cmd = this._argv[this._argv.length-1]
        this._argv = this._argv.slice(0, this._argv.length - 1)
      }
    init(){
        throw new Error('init必须实现');
    }
    exec(){
        throw new Error('exec必须实现');
    }
}

export default Command;
