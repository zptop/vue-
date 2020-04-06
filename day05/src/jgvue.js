  //vue构造函数
    function JGVue(options) {
        this._data = options.data;
        this.elm = document.querySelector(options.el);  //vue是字符串，这里是DOM
        this._template = this.elm;
        this._parent = this.elm.parentNode;

        this.initData(); //将data进行响应式转换，进行代理

        this.mount();//挂载
    }
