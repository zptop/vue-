class Dep{
    constructor(){
        this.subs = []; //存储的是与当前Dep关联的watcher
    }
    //添加一个watcher
    addSub(sub){

    }

    //移除
    removeSub(sub){

    }

    //将当前Dep与当前的watcher(暂时渲染watcher)关联
    depend(){

    }

    //触发与之关联的watcher的update方法，起到更新的作用
    notify(){
        //在真实的vue中是依次触发this.subs中的watcher的update方法
        if(Dep.target){
            Dep.target.update();
        }
    }
}


//全局的容器存储渲染Watcher
//let globalWatcher
//学vue的实现
Dep.target = null; //这就是全局的Watcher