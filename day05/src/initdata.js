
   //响应式化部分
   let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
];
let array_methods = Object.create(Array.prototype);
ARRAY_METHOD.forEach(method=>{
    array_methods[method] = function(){
        console.log('调用的是拦截的：'+method+'方法');

        //将数据进行响应式化（arguments）
        for(let i=0;i<arguments.length;i++){
            observe(arguments[i]);  //这里还有一个问题，在引入watcher后解决
        }

        //要return，否则会返回undefined
       return Array.prototype[method].apply(this,arguments);
    }
});


//简化后的版本
function defineReactive(target,key,value,enumerable){
var that = this;
//折中处理后this就是vue实例
//函数内部就是一个局部作用域，这个value就只在函数内部使用的变量(闭包)
if(typeof value==='object' && value !== null){
//是非数组的引用类型
  observe(value); //递归
}

let dep = new Dep();
Object.defineProperty(target,key,{
    configurable:true,
    enumerable:!!enumerable,
    get(){
        console.log(`读取o的${key}属性`);           //额外操作

        //依赖收集(暂时略)
  
      dep.depend();
    
        return value;
    },
    set(newVal){
        // console.log(`设置o的${key}属性为:${newVal}`);//额外操作

       if(value===newVal) return;
       
        //目的
        //将重新赋值的数据变成响应式的，因此如果传入的是对象类型，那么就需要使用observe将其转换为响应式
        if(typeof newVal ==="object" && newVal!=null){
            observe(newVal); 
        }
            value = newVal;
        
        //临时：数组现在没有参与页面的渲染
        //所以在数组上进行响应式的处理，不需要页面的刷新
        //那么即使这里无法调用也没有关系
        // typeof that.mountComponent === 'function' && that.mountComponent();

        //派发更新，找到全局的watcher,调用update
        dep.notify();
    }
});
}

//将对象O变成响应式
//vm就是vue实例，为了在调用时处理上下文
function observe(obj,vm){
    //之前没有对obj本身进行操作，这一次就直接对obj进行判断
    if(Array.isArray(obj)){
        obj.__proto__ = array_methods;
        for(let i=0;i<obj.length;i++){
            observe(obj[i],vm); //递归处理每一个数组元素

            //如果想要这么处理，就在这里继续调用defineReactive
            // defineReactive.call(vm,obj,i,obj[i],true);
        }
    }else{
        //对其成员进行响应式处理
        let keys = Object.keys(obj);
        for(let i = 0; i<keys.length;i++){
            let prop = keys[i];
            defineReactive.call(vm,obj,prop,obj[prop],true);
        }
    }　
}

//将某一个对象的属性访问映射到对象的某一个属性成员上
function proxy(target,prop,key){
Object.defineProperty(target,key,{
        enumerable:true,
        configurable:true,
        get(){
            return target[prop][key];
        },
        set(newVal){
            target[prop][key] = newVal;
        }
    })
}

//取代原来reactify
JGVue.prototype.initData = function(){
    let keys = Object.keys(this._data);
    
    //响应式化
    observe(this._data,this);
    
    //代理 
    for(let i=0;i<keys.length;i++){
        //将this._data[keys[i]]映射到this[keys[i]]上
        //就是要让this提供keys[i]这个属性
        //在访问这个属性的时候，相当于在访问这个this._data的这个属性
        // Object.defineProperty(this,keys[i],{
        //     enumerable:true,
        //     configurable:true,
        //     get(){
        //         return this._data[keys[i]];
        //     },
        //     set(newVal){
        //         this._data[keys[i]] = newVal;
        //     }
        // })
        proxy(this,'_data',keys[i]);
    }
    }
