
    JGVue.prototype.mount = function () {
        //需要提供一个render方法：生成虚拟DOM 缓存

        // if(typeof this._options.render ==='function'){

        // }
        this.render = this.createRenderFn(); //带有缓存的函数 (Vue本身是可以带有render成员)
        this.mountComponent();
    }

    JGVue.prototype.mountComponent = function () {

        //执行mountComponent()函数
        let mount = () => {     //这里是一个函数，函数的this默认是全局对象“函数调用模式”
            this.update(this.render());
        }
        // mount();
        mount.call(this); //本质应该交给watcher来调用，但还没有讲到这里

        // this.update(this.render()); //使用发布订阅模式，渲染和计算的行为应该交给watcher来未完成

        //这个watcher就是全局的Watcher,在任何一个位置都可以访问他了(简化的写法)
        new Watcher(this,mount); //相当于这里调用了mount
    }

    /**
    * 在真正的VUE中使用了 二次提交的设计结构
    * 1.在页面中的DOM和虚拟DOM是一一对应的关系
    * 2.先有AST和数据生成VNode(新的数据的VNode,render)
    * 3.将旧的VNode和新的VNode比较(diff算法)，更新(update)
    */
    //这里是生成render函数，目的是缓存抽象语法树（我们使用虚拟DOM来模拟）
    JGVue.prototype.createRenderFn = function () {
        //缓存AST,实际上就是虚拟dom,VNode
        let ast = getVNode(this._template);
        //Vue:将AST+data =>VNode
        //我们：带坑的VNode+data=>含有数据的VNode
        return function render() {
            //将带坑的VNode转换为带数据的VNode
            let _tmp =  combine(ast,this._data);
            console.log('_tmp:',_tmp);
            return _tmp;
        }
    }

    //将虚拟DOM渲染到页面中：diff算法就在这里
    JGVue.prototype.update = function (vnode) {
        //简化，直接生成HTML DOM replaceChild到页面
        //父元素.replaceChild(新元素,旧元素)
        let realDOM = parseVNode(vnode);
        // debugger;
        // let _ = 0;

        this._parent.replaceChild(realDOM,document.querySelector('#root'));
        //这个算法是不负责任的
        //每次会将页面的DOM全部替换
    }
    