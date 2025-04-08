let uid = 0

// 依赖收集器（管家）
class Dep {
  constructor() {
    this.id = uid++
    // 存储 Watcher 实例
    this.subscribers = new Set();
  }
  // 添加 Watcher
  addSub(sub) {
    this.subscribers.add(sub)
  }
  // 调用 Watcher的addDep收集依赖
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知所有 Watcher 更新
  notify() {
    // 触发Watcher的update
    this.subscribers.forEach(watcher => watcher.update());
  }
}

// 全局变量，指向当前正在处理的 Watcher
Dep.target = null;

// 观察者
class Watcher {
  constructor(vm, expOrFn, cb, options = {}) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;

    // watch用到，接收 deep 配置
    this.deep = options.deep;

    // computed用到
    this.lazy = !!options.lazy; // 是否为计算属性 Watcher
    this.dirty = this.lazy; // 计算属性初始化时标记为脏数据
    // 维护自己的依赖列表
    this.deps = new Set();
    this.depIds = new Set(); // 用于去重

    // 解析表达式或函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn); // 解析如 'user.name' 的路径
    }
    // 初始化时主动收集依赖，lazy值不触发求值
    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    console.log('get1')
    console.log(this.getter, 'this.getter')
    Dep.target = this;
    let value;
    try {
      // 触发observer的get
      value = this.getter.call(this.vm, this.vm);
    } finally {
      // watch用到
      // 深度监听时递归遍历属性
      if (this.deep) {
        // 关键：触发所有嵌套属性的 getter
        traverse(value);
      }
      console.log('get2', this.getter)
      Dep.target = null;
    }
    return value;
  }

  evaluate() {
    console.log('evaluate')
    // 专供计算属性调用：执行计算并清除脏数据标志
    this.value = this.get();
    this.dirty = false;
  }

  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.deps.add(dep);
      this.depIds.add(dep.id);
      // 反向关联到 Dep 使用dep添加Watcher
      dep.addSub(this);
    }
  }

  depend() {
    // 触发Dep类的depend,收集当前 Watcher 的所有依赖到的上层 Watcher
    this.deps.forEach(dep => dep.depend());
  }

  // 在组件销毁时调用，防止内存泄漏
  teardown() {
    this.deps.forEach(dep => dep.subscribers.delete(this));
    this.deps = [];
  }

  update() {
    if (this.lazy) {
      console.log('update1')
      // 计算属性专用：标记脏数据，延迟到访问时计算
      this.dirty = true;
    } else {
      console.log('update2')
      const oldValue = this.value;
      // 触发get
      this.value = this.get();
      // 如果是 watch 的回调 添加值变化检测，最后触发更新回调函数
      if (this.value !== oldValue && this.options.isWatch) {
        this.cb.call(this.vm, this.value, oldValue);
      } else {
        this.cb.call(this.vm, this.value);
      }
    }
  }
}

// 响应式处理
class Observer {
  constructor(data) {
    this.dep = new Dep();
    this.walk(data);
  }

  // 遍历对象属性，转为响应式
  walk(obj) {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key]);
    });
  }

  // 定义响应式属性
  defineReactive(obj, key, val) {
    const dep = new Dep();
    let childOb = null;
    // 递归处理对象或数组
    if (typeof val === 'object' && val !== null) {
      childOb = new Observer(val);
    }

    Object.defineProperty(obj, key, {
      get: () => {
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend(); // 收集嵌套对象的依赖
          }
        }
        return val;
      },
      set: (newVal) => {
        if (newVal === val) return;
        val = newVal;
        childOb = new Observer(newVal); // 新值转为响应式
        console.log(key, Dep.target, 'target1-set');
        dep.notify();
      }
    });
  }
}

// 编译器
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.textReg = /\{\{\s*(.*?)\s*\}\}/; // 改进正则：允许空格和非贪婪匹配

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  // 编译 DOM 节点（优化递归逻辑）
  compile(node) {
    const childNodes = node.childNodes;
    Array.from(childNodes).forEach(child => {
      if (this.isElement(child)) {
        this.compileElement(child);
        // 递归处理子节点（无论是否为空）
        this.compile(child);
      } else if (this.isInterpolation(child)) {
        this.compileText(child);
      }
    });
  }

  // 判断元素节点
  isElement(node) {
    return node.nodeType === 1;
  }

  // 判断插值表达式文本节点（支持多行）
  isInterpolation(node) {
    return node.nodeType === 3 && this.textReg.test(node.textContent);
  }

  // 编译文本节点（支持多层嵌套属性）
  compileText(node) {
    const match = node.textContent.match(this.textReg);
    if (match) {
      const exp = match[1].trim();
      this.update(node, exp, 'text');
    }
  }

  // 编译元素节点（增强指令处理）
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        // 统一处理指令方法（如 v-text）
        this[dir] && this[dir](node, exp);
        node.removeAttribute(attrName); // 移除指令属性
      }
    });
  }

  // 判断是否是指令属性
  isDirective(attr) {
    return attr.startsWith('v-');
  }

  // 处理 v-text 指令
  text(node, exp) {
    this.update(node, exp, 'text');
  }

  // 通用更新方法（支持嵌套属性路径）
  update(node, exp, dir) {
    const updaterFn = this[dir + 'Updater'];
    // 初始化值（处理 user.name 格式）
    const initValue = this._getVMValue(exp);
    updaterFn && updaterFn(node, initValue);

    // 创建 Watcher 监听变化（自动解析嵌套路径）
    new Watcher(this.$vm, exp, value => {
      updaterFn && updaterFn(node, value);
    });
  }

  // 文本更新器
  textUpdater(node, value) {
    node.textContent = value;
  }

  // 从 Vue 实例获取嵌套属性值
  _getVMValue(exp) {
    // 在这里触发computed的get，返回函数里面有n个单层变量，就触发n次get
    return exp.split('.').reduce((obj, key) => obj[key], this.$vm);
  }
}

// Vue 类
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data();
    // 存储计算属性 Watcher
    this._computedWatchers = {};

    // 1. 代理 data到vue实例上
    this.proxyData(this.$data);

    // 2. 响应式处理
    new Observer(this.$data);

    // 3. 处理 computed
    if (options.computed) {
      this.initComputed(options.computed);
    }

    // 4. 处理 watch
    if (options.watch) {
      this.initWatch(options.watch);
    }

    // 5. 编译模板
    new Compile(options.el, this);
  }

  // 代理 data 属性到 Vue 实例
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        }
      });
    });
  }

  // 新增：初始化 computed
  initComputed(computedOptions) {
    const watchers = this._computedWatchers = {};

    for (const key in computedOptions) {
      const userDef = computedOptions[key];
      const getter = typeof userDef === 'function'
        ? userDef
        : userDef.get;

      // 创建 lazy Watcher（计算属性专用）
      watchers[key] = new Watcher(
        this,
        getter,
        () => {}, // 空回调，计算属性不直接触发更新，此时没有Dep.target
        { lazy: true } // 标记为计算属性 Watcher
      );
      // 将计算属性代理到 Vue 实例
      Object.defineProperty(this, key, {
        get: () => {
          const watcher = watchers[key];
          // 初始化会触发两次get，第一次是在238行this._getVMValue(exp); 在执行watcher.evaluate()时，触发this.get()，设置Dep.target为lazy=true的watcher,然后触发computed里面对应count、user、name的get函数
          // 第二次是在242行 new Watcher,此时有Dep.target=渲染的watcher
          console.log(watcher, 'computed');
          if (watcher.dirty) {
            watcher.evaluate(); // 执行计算
          }
          if (Dep.target) { // 收集上层依赖（如模板渲染 Watcher）
            console.log(Dep.target, 'target')
            watcher.depend();
          }
          return watcher.value;
        },
        enumerable: true,
        configurable: true
      });
    }
  }

  // 修改后的 initWatch 方法（支持对象格式的 watch）
  initWatch(watchOptions) {
    for (const key in watchOptions) {
      const entry = watchOptions[key];
      let handler, deep = false, immediate = false;

      // 解析配置格式
      if (typeof entry === 'function') {
        handler = entry;
      } else if (entry && typeof entry.handler === 'function') {
        handler = entry.handler;
        deep = !!entry.deep;
        immediate = !!entry.immediate;
      } else {
        continue; // 跳过无效配置
      }

      // 创建 Watcher 实例
      const watcher = new Watcher(
        this,
        key, // 支持路径如 'user.name'
        (newVal, oldVal) => {
          handler.call(this, newVal, oldVal);
        },
        { deep, isWatch: true }
      );

      // 立即执行一次回调（如果需要）
      if (immediate) {
        handler.call(this, watcher.value, undefined);
      }
    }
  }
}

// 工具函数：解析对象路径（如 "a.b.c"）
function parsePath(path) {
  const segments = path.split('.');
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}

function traverse(val, seen = new Set()) {
  if (typeof val !== 'object' || val === null || seen.has(val)) return;
  seen.add(val);

  const keys = Object.keys(val);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // val[key]触发子属性getter
    traverse(val[key], seen); // 递归触发子属性 getter
  }
}