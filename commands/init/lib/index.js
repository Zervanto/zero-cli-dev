// 'use strict';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import log from '@zero-cli-dev/log';
import Command from '@zero-cli-dev/command';
import semver from 'semver';
import { getNpmSemverVersions } from '@zero-cli-dev/get-npm-info';
import getProjectTemplate from './getProjectTemplate.js';
// import { fetchAsyncQuestionProperty } from 'inquirer/lib/utils/utils';
const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    // this.force = this._argv[1] ？ this._argv[1].force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this._cmd);
  }
  async exec() {
    try {
      // 准备阶段
      const projectInfo = await this.prepare();
      if(projectInfo){
      // 下载模板
      downloadTemplate()
      // 安装模板
      installTemplate()
      }

    } catch (e) {
      log.error(e.message);
    }
  }
  downloadTemplate(){
      // 通过项目模板API获取项目的模板信息
      // 通过egg.js搭建一套后端系统
      // 通过npm存储项目信息模板
      // 将项目模板信息存储在mongodb数据库中
      // 通过egg.js获取mongodb数据库中的模板信息并通过API返回
  }
  installTemplate(){}
  async prepare() {
    // 判断项目模板是否存在
    const template = await getProjectTemplate();
    console.log(template);
    if(!template || template.length === 0) {
      throw new Error('项目模板不存在！');
    }
    // 1. 判断当前目录是否为空
    const localPath = process.cwd();
    if (!this.isCwdEmpty(localPath)) {
      let ifContinue = false;
      if (!this.force) {
        // 询问是否创建
        ifContinue = (
          await inquirer.prompt({
            type: 'confirm',
            name: 'ifContinue',
            default: false,
            message: '当前文件夹不为空，是否继续创建项目？',
          })
        ).ifContinue;
        if (!ifContinue) return;
        // 2. 是否启动强制更新
        if (ifContinue || this.force) {
          const { confirmDelete } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmDelete',
            default: false,
            message: '是否确认清空目录？',
          });
          if (confirmDelete) {
            fse.emptyDirSync(localPath);
          }
        }
      }
    }
    return this.getProjectInfo();
    
    
    
  }
 
  async getProjectInfo() {
      let projectInfo = {}
       // 3. 选择创建项目或组件
       const { type } = await inquirer.prompt({
           type: 'list',
           name: 'type',
           message: '请选择初始化类型',
           default: TYPE_PROJECT,
           choices: [{
               name: '项目',
               value: TYPE_PROJECT
           }, {
               name: '组件',
               value: TYPE_COMPONENT
           }]
       });
       log.verbose('type', type);

       if(type === TYPE_PROJECT) {
            const project = await inquirer.prompt([{
                type: 'input',
                name: 'prjectName',
                message: '请输入项目名称',
                default: '',
                validate: function(v) {
                    const done = this.async();
                    const rexp =  /^[a-zA-Z]+([-]a-zA-Z][a-zA-Z0-9]]*|[_]a-zA-Z][a-zA-Z0-9]]*|[a-zA-Z0-9])*$/;
                    setTimeout(function(){
                        if(!rexp.test(v)){
                            done('请输入合法的项目名称');
                            return;
                        }
                        done(null, true);
                    }, 0)
                    // 输入的首字符必须是英文字母
                    // 尾字符必须为英文和数字
                    // 特殊字符仅允许—_
                    // return.test(v);
                },
                filter: function(v){
                    return v;
                }
            },{
                type: 'input',
                name: 'prjectVersion',
                message: '请输入项目版本号',
                default: '',
                validate: function(v) {
                    const done = this.async();
                    setTimeout(function(){
                        if(!semver.valid(v)){
                            done('请输入合法的版本号')
                            return
                        }
                        done(null, true) 
                    }, 0) 
                },
                filter: function(v){
                    return v;
                }
            }])
            projectInfo = {
                type,
                ...project
            }
       } else if(type === TYPE_COMPONENT){

       }
       return projectInfo;
 // 4. 获取项目的基本信息
  }
  isCwdEmpty(localPath) {
    let fileList = fse.readFileSync(localPath);
    // 文件过滤的逻辑
    fileList = fileList.filter(
      (file) => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    );

    return !fileList || fileList.length <= 0;
  }
  // log.info('init', projectName, cmdObj.force);
}

function init(argv) {
  return new InitCommand(argv);
}
export default init;
