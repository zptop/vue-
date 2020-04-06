

    //由HTML DOM -> VNode  将这个函数当做compiler函数
    function getVNode(node) {
        let nodeType = node.nodeType;
        let _vnode = null;
        if (nodeType === 1) {
            //元素
            let nodeName = node.nodeName;
            let attrs = node.attributes; //伪数组
            let _attrObj = {};
            for (let i = 0; i < attrs.length; i++) { //attrs[i]属性节点(nodeType==2)
                _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
            }
            _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

            //考虑node子元素
            let childNodes = node.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                _vnode.appendChild(getVNode(childNodes[i])); //递归
            }
        } else if (nodeType === 3) {
            _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
        }
        return _vnode;
    }

        //将虚拟DOM转换为真正的DOM
        function parseVNode(vnode) {
        //创建真实的DOM
        let type = vnode.type;

        //元素节点变量
        let _node = null;

        if (type === 3) { //文本节点
            return document.createTextNode(vnode.value); //创建文本节点
        } else if (type === 1) {
            //创建元素的步骤比较多
            //创建完元素后还要给元素加上各种各样的属性
            //加上属性之后还要判断子元素
            _node = document.createElement(vnode.tag);

            //属性,现在data是键值对，要遍历键值对
            let data = vnode.data;
            Object.keys(data).forEach((key) => {
                let attrName = key;
                let attrValue = data[key];

                //把属性绑定到_node上
                _node.setAttribute(attrName, attrValue);
            });

            //子元素
            //children  只会查找元素节点
            //childNodes 会查找元素节点和文本节点
            let children = vnode.children;
            children.forEach(subvnode => {
                //subvnode是从vnode中取出的，是一个虚拟DOM
                //直接使用递归转换子元素
                _node.appendChild(parseVNode(subvnode));
            });
            return _node;
        }
    }

    let rekuohao = /\{\{(.+?)\}\}/g;
    //使用'xxx.yyy.zzz'可以来访问一个对象
    //就是用字符串路径来访问对象的成员
    function getValueByPath(obj, path) {
        let paths = path.split('.');//[xxx,yyy,zzz]
        //先取得obj.xxx, 再取得 结果中的yyy, 再取得结果中的zzz
        let res = obj;
        let prop;
        while (prop = paths.shift()) {
            res = res[prop];
        }
        return res;
    }

    //将带有坑的VNode与数据data结合，得到填充数据的VNode:模拟AST->VNode
    function combine(vnode, data) {
        let _type = vnode.type,
            _data = vnode.data,
            _value = vnode.value,
            _tag = vnode.tag,
            _children = vnode.children,
            _vnode = null;

        if (_type === 3) {//文本节点
           //对文本处理
           _value = _value.replace(rekuohao,function(_,g){
               return getValueByPath( data,g.trim()); //触发了get读取器
           });
            _vnode = new VNode(_tag, _data, _value, _type);
        } else if (_type === 1) { //元素节点
            _vnode = new VNode(_tag, _data, _value, _type);
            _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode,data)));
        }
        return _vnode;
    }
