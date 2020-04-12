//Watcher观察者，用于发射更新的行为
class Watcher{
    /**
     * @param {Object} vm JGvue实例
     * @param {String|Function} expOrfn　如果是渲染watcher,传入的就是渲染函数；如果是计算watcher，传入的就是
     */
    constructor(vm,expOrfn){
        this.vm = vm;
        this.getter = expOrfn;
        this.deps = []; //依赖项
        this.depIds = {}; //是一个Set类型，用于保证依赖项的唯一性(简化的代码暂时不实现这一块)

        //一开始需要渲染：真实vue中：this.lazy?undefined:this.get()
        this.get();
    }

    //计算，触发getter
    get(){
        pushTarget(this);
        this.getter.call(this.vm,this.vm); //上下文的问题就解决了
        popTarget();
    }

    /**
     * 执行，并判断是懒加载，还是同步执行，还是异步执行
     * 我们现在只考虑异步执行(简化的是同步执行)
     */
    run(){
        this.get();
        //在真正的vue中是调用queueWatcher,来触发nextTick进行异步的执行
    }

    /**
     * 对外公开的函数，用于在属性发生变化时触发的接口
     */
    update(){

    }

    /**
     * 清空依赖对列
     */
    cleanupDep(){
        
    }


   /**
    * 将当前的Dep与当前的watcher关联
    */
    addDep(dep){
        this.deps.push(dep);
    }
}