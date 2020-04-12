class Dep{
    constructor(){
        this.subs = []; //存储的是与当前Dep关联的watcher
    }
    //添加一个watcher
    addSub(sub){
        this.subs.push(sub);
    }

    //移除
    //倒序循环
    removeSub(sub){ 
        for(let i=this.subs.length;i>=0;i--){
            if(sub==this.subs[i]){
                this.subs.splice(i,1);
            }
        }
    }

    //将当前Dep与当前的watcher(暂时渲染watcher)关联
    depend(){
        //就是将当前的Dep与当前的watcher互相关联
        if(Dep.target){
            this.addSub(Dep.target);  //将当前的watcher关联到当前的Dep上
            Dep.target.addDep(this);  //将当前的dep与当前渲染watcher关联起来
        }
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
Dep.target = null; //这就是全局的Watcher
let targetStack = [];

/**
 * 将当前操作的watcher存储到全局watcher中
 * 参数target就是当前watcher
 */
function pushTarget(target){
    targetStack.unshift(Dep.target); //vue的源代码中使用的是push
    Dep.target = target;
}

/**
 * 将当前watcher踢出
 */
function popTarget(){
    Dep.target = targetStack.shift(); //踢到最后是undefined
}

/**
 * 在watcher调用get方法的时候，调用pushTarget(this)
 * 在watcher的get方法结束的时候，调用popTarget
 */