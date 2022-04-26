class Command {
    constructor(argv){
        console.log('argv',argv);
        this._argv = argv;
        let runner = new Promise((resolve, reject)=>{
            let chain = Promise.resolve();
            chain = chain.then(() => {
                
            })
        })
    }
    init(){
        throw new Error('init必须实现');
    }
    exec(){
        throw new Error('exec必须实现');
    }
}
export default Command;
