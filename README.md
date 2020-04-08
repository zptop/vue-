数据驱动

前提：
1.你一定得用过vue
2.如果没有使用过的 可以去官网看一看 使用教程

# Vue与模板
1.编写 页面模板
  1.直接在html标签中写 标签
  2.使用template
  3.使用单文件 （<template />）
2.创建vue的实例
  1.在Vue的构造函数中提供：data,methods,computed,watcher,props,...
3.将Vue挂载到页面中 （mount）  








# 数据驱动模型

Vue的执行流程
1.获得模板：模板中有“坑”
2.利用Vue构造函数中所提供的数据来“填坑”，得到可以在页面中显示的“标签”了
3.将标签替换页面中原来有坑的标签

Vue 利用 我们提供的数据 和 页面中 模板生成了一个新的html标签（node元素）
替换到了页面 中放置模板的位置







# 简单的模板渲染







# 虚拟DOM
# 目标：
1.怎么将真正的DOM转换为虚拟DOM
2.怎么将虚拟DOM转换为真正的DOM
思路与深拷贝类似

# 概念
1.柯里化：
  一个函数原本有多个参数，之传入**一个**参数，生成一个新函数，由新函数接收剩下的参数来运行得到的结构。
2.偏函数：一个函数原本有多个参数，之传入**一部分**参数，生成一个新函数，由新函数接收剩下的参数来运行得到的结构。
3.高阶函数：一个函数参数是个函数，该函数对参数这个函数进行加工，得到一个函数，这个加工用的函数就是高阶函数


# 为什么要使用柯里化？为了提升性能，使用柯里化可以缓存一部分能力
使用两个案例来说明
1.判断元素
2.虚拟DOM 的render方法

# 1.判断元素
Vue 本质上是使用HTML的字符串作为模板的，将字符串的模板转换为AST,再转换为VNode
- 模板 -> AST
- AST  -> VNode
- VNode -> DOM
哪个阶段最消耗性能？
最消耗性能的是字符串解析（ 模板->AST ）

例子：let s = "1 + 2 * ( 3 + 4 * (5 + 6)) "
写一个程序，解析之个表达式，得到结果(一般化)
我们一般会将这个表达式转换为"波兰式"表达式，然后使用栈结构来运算

在Vue中每个标签可以是真正的HTML标签，也可以是自定义的组件
在Vue源码中其实将所有可以用的HTML标签已经存起来了

# 假设这里只考虑几个标签

----js
let tags = 'div,p,a,img,ul,li'.split(',');
----

需要一个函数，判断一个标签名是否为内置的标签
----js
function isHTMLTag(tagName){
  tagName = tagName.toLowerCase();
  <!-- for(let i=0;i<tags.lenght;i++){
    if(tagName === tags[i]) return true;
  } -->
  if(tags.indexOf(tagName)>-1) return true;
  return false;
}
----

模板是任意编写的，可以写的很简单，也可以写的很复杂，indexOf内部也是要循环的
如果有6种内置标签，而模板中有10个标签需要判断，那么就需要执行60次循环

# 2.虚拟DOM的render方法

思考：vue项目**模板转换为抽象语法树**需要执行几次？
- 页面一开始加载需要渲染
- 每个属性（响应性）数据发生变化的时候要渲染
- watch,computed等等

我们昨天写的代码，每次需要渲染的时候，模板就会被解析一次（注意，这里我们简化了解析方法）


模板不变，AST就不会变，因为AST是模板生成的
render的作用是将虚拟DOM转换为真正的DOM加到页面中
- 虚拟DOM可以降级理解为AST
- 一个项目运行的时候，模板是不会变的，就表示AST是不会变的
我们可以将代码进行优化，将虚拟DOM缓存起来，然后生成一个函数，函数只需要传入数据就可以得到真正的DOM

# 凡是解析都会涉及到AST


# 问题
- 没明白柯里化怎么就只要循环一次。
  **缓存一部分行为**

- mountComponent 这个函数里面的内容，没太理解


makeMap (['div','p'])需要遍历这个数据 生成 键值对
---
最开始生成set的时候需要去遍历（只需要遍历一次）
let set = {
  div:true,
  p:true
}

做判断的时候是不需要去遍历的
set['div'] //true 内置标签
set['navigtor'] //!!undefined -> false
---

但是如果是使用的函数，每次都需要循环遍历判断是不是数组中的

# 响应式原理
- 我们在使用Vue的时候，赋值属性，获得属性都是直接使用的Vue实例
- 我们在设置属性值的时候，页面的数据更新

---js
Object.defineProperty(对象，'属性名',{
  writeable:
  configable:
  enumerable: 控制属性是否可枚举 for...in循环
  set(){}  赋值触发
  get(){}  取值触发
  value  用到get和set后，value就不用考虑了
})
---

# 实际开发中对象一般是有多级
---js
let o = {
  list:[
    {}
  ],
  ads:[
    {}
  ],
  user:{

  }
}
---
怎么处理呢？ 递归


对于对象可以使用递归来响应式化，但是数组我们也需要处理
-push
-pop
-shift
-unshift
-reverse
-sort
-splice

要做什么事情？
1.在改变数组数据的时候，要发出通知
  1.vue2中的缺陷，数组发生变化，设置length没法通知(vue3中使用Proxy语法，ES6的语法解决了这个问题)
2.加入的元素应该变成响应式的  

技巧：如果一个函数已经定义了，但是我们需要扩展其功能，我们一般的处理办法：
1.使用一个临时的函数名存储函数
2.重新定义原来的函数
3.定义扩展的功能
4.调用临时的那个函数

扩展数组的Push和pop怎么处理呢？
- 直接修改prototype **不行**
- 修改要进行响应式化的数组的原型(__proto__)


已经将对象改成响应式的了，如果直接给对象赋值另一个对象，那么就不是响应式的了，怎么办？


# 发布订阅模式
任务：
- 作业
- 代理方法(app.name,app._data.name)
- 事件模型(node:event模块)
-vue中observer与watcher和Dep


# 代理方法
就是要将app._data中的成员给映射到app上

由于需要在更新数据的时候，更新页面的内容
所以app._data访问的成员与app访问的成员应该是同一个成员

由于app._data已经是响应式的对象了，所以只需要让app访问的成员去访问app._data的对应成员就可以了。

例如：
```js
app.name 转换为 app._data.name
app.xxx 转换为 app._data.xxx
```

target相当于app,
src相当于app._data,
prop相当于name,
引入了一个函数proxy( target, src , prop )，将target的操作给映射到src.prop上
这里是因为当时没有`proxy`语法(es6)

我们之前处理的rectify方法已经不行了，我们需要一个新的方法来处理。
提供一个Observer的方法，在方法中对属性进行处理
可以将这个方法封装到initData方法中

# 解释proxy
```js
// vue设计，不希望访问 _ 开头的数据
// vue中有一个潜规则：
// _ 开头的数据是私有数据
// $ 开头的是只读数据

app.name
// 将 对_data.xxx的访问交给了实例
// 重点： 访问app.xxx就是在访问app._data.xxx
```

假设：
```js
var o1 = { name: '张三' };
//要有一个对象o2, 在访问o2.name的时候想要访问的是o1.name
Object.defineProperty(o2,'name',{
  get(){
    return o1.name;
  }
})
```

现在：访问app.name就是在访问app._data.name
```js
  Object.defineProperty(app,'name',{
    get(){
      return app._data.name;
    },
    set(newValue){
      app._data.name = newValue;
    }
  });
```

将属性的操作转换为参数
```js
function proxy(target,key){
  Object.defineProperty(target,key,{
    get(){
      return target._data[key];
    },
    set(newValue){
      target._data[key] = newValue;
    }
  })
}
```

在vue中不仅仅是只有data属性，properties等等都会挂载到vue实例上
```js
function proxy(target,prop,key){
  Object.defineProperty(target,prop,key,{
    get(){
      return target[prop][key];
    },
    set(newValue){
      target[prop][key] = newValue;
    }
  })
}

//如果把_data的成员映射到实例上
proxy(实例,'_data',属性名);

//如果把properties的成员映射到实例上
proxy(实例,'properties',属性名);
```

# 发布订阅模式
目标：解耦，让各个模块之间没有紧密的联系

现在的处理办法是　属性在更新的时候调用mountComponent方法

问题：mountComponent更新的是什么？（现在）全部的页面->当前虚拟DOM对应的页面DOM，和真正的vue背道而驰

在vue中，整个的更新是按照组件为单位进行**判断**，以节点为单位进行更新

- 如果代码中没有自定义组件，那么在比较算法的时候，我们会将全部的模板　对应的虚拟DOM进行比较
- 如果代码中含有自定义组件，那么在比较算法的时候，就会判断更新的是哪一些组件中的属性，只会判断更新数据的组件，其它组件不会更新。

复杂的页面是有很多组件构成的，每一个属性要更新的时候都要去调用更新的方法？

**目标，如果修改了什么属性，就尽可能只更新这些属性对应的页面DOM**
这样就一定不能将更新的代码写死。

例子：预售
可能一个东西没有现货，告诉老板，如果东西到了就告诉我。

老板就是发布者
订阅什么东西作为中间媒介
我就是订阅者

使用代码的结构来描述：
1.老板提供一个账簿(数组)
2.我可以根据需求订阅我的商品(老板要记录下来，谁定了什么东西，在数组中存储某些东西)
3.等待，可以做其它的事情
4.当货品来到的时候，老板就查看账簿，挨个打电话(遍历数组，取出数组的元素来使用)

实际上就是事件模型
1.有一个event对象
2.on,off,emit方法

实现事件模型，思考怎么用？
1.event是一个全局对象
2.event.on('事件名',处理函数),订阅事件
　1.事件可以连续订阅
　2.可以移除:event.off()
  　1.移除所有
  　2.移除某一个类型的事件
  　3.移除某一个类型的某一个处理函数
  3.写别的代码
  4.event.emit('事件名',参数)，先前注册的事件处理函数就会依次调用

  原因：
  1.描述发布订阅模式
  2.后面会使用到事件

  发布订阅模式（形式不局限于函数，形式可以是对象等）：
  1.中间的**全局的容器**，用来**存储**可以被触发(刷新页面)的东西（函数，对象）
  2.需要一个方法，可以往容器中**传入**东西（函数，对象）　
  3.需要一个方法，可以将容器中的东西取出来**使用**，（函数调用，对象的方法调用）


  Vue模型
  页面中的变更(diff)是一组件单位
  - 如果页面中只有一个组件(vue实例)，不会有性能损失
  - 但是如果页面中有多个组件(多watcher的一种情况)，第一次会有多个组件的watcher存入到全局watcher中
  - 如果修改了局部的数据(例如其中一个组件的数据)，
    表示只会对该组件进行diff算法，也就是说只会生成该组件的AST,
    只会访问该组件的watcher,
    也就表示再次往全局存储的只有该组件的watcher
  - 页面更新的时候也就只需要更新一部分

  #　改写observe函数
  - 无法处理数组
  - 响应式无法在中间集成watcher处理
  - 我们实现的reactify,需要和实例紧紧的绑定在一起，分离(解耦)

  # 引入watcher
  我们的watcher实例有一个属性vm,表示的就是当前的vue实例

  #　引入Dep对象
  该对象提供依赖收集(depend)的功能，和派发更新(notify)，的功能
  在notify中去调用watcher的update方法

  # Watcher与Dep
  之前将渲染Watcher放在全局作用域上，这样处理是有问题的
  - vue项目中包含很多的组件，各个组件是**自治**
  　- 那么watcher就可能会有多个
  　- 每一个watcher用于描述一个渲染的行为或计算行为
  　- 子组件发生数据的更新，页面需要重新渲染（更正的vue中是局部渲染）
  　- 例如vue中推荐是使用计算属性代替复杂的插值表达式
  　　- 计算属性是会伴随其使用的属性的变化而变化的
        - `name:()=>this.firstName + this.lastName`(name会被缓存起来，只有当firstName或lastName改变后，才会重新计算)
          - 计算属性依赖于　属性firstName和属性lastName
          - 只要被依赖的属性发生变化，那么就会促使计算属性**重新计算**（watcher）
　 - 依赖收集与派发更新是怎么运行起来的
　　我们在访问的时候就会进行收集，在修改的时候就会更新，收集到什么就更新什么

所谓的依赖收集**实际上就是告诉当前的watcher，什么属性被访问了**
那么在这个watcher计算的时候或渲染页面的时候，就会将这些收集到的属性进行更新

如何将属性与当前watcher关联起来？
- 在全局准备一个targetStack（watcher栈，简单的理解为watcher"数组"，把一个操作中需要使用的watcher都存起来）
- 在watcher调用 get 方法的时候，将当前 watcher 放到全局，在get结束的时候（之后），将这个全局的watcher移除：提供pushTarget,popTarget
- 在每一个属性中都有一个Dep对象

- 我们在访问对象属性的时候（get）,我们的渲染 watcher 就在全局中。
- 将属性与 watcher 关联，其实就是将当前渲染的 watcher 存储到属性相关的Dep。
- 同时，将Dep也存储到当前全局的 watcher 中（互相引用的关系）。

- 属性引用了当前渲染 watcher,**属性知道谁渲染它**
- 当前渲染 watcher 引用了访问的属性（Dep），**当前的watcher知道渲染了什么属性**

我们的Dep有一个方法，叫notity()。
内部就是将Dep中的sub取出来，依次调用其update方法。
subs中存储的是**知道要渲染什么属性的watcher**
