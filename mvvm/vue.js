// 依赖收集器（管家）
class Dep {
  constructor() {
    this.subscribers = []; // 存储 Watcher 实例
  }

  // 添加 Watcher
  depend() {
    if (Dep.target && !this.subscribers.includes(Dep.target)) {
      this.subscribers.push(Dep.target);
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
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 触发 getter，收集依赖
    Dep.target = this;
    // 读取数据，触发 Observer的get然后触发Dep的depend
    this.vm[this.key];
    Dep.target = null;
  }

  // 更新视图
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}

// 响应式处理
class Observer {
  constructor(data) {
    this.data = data;
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
    const dep = new Dep(); // 每个 key 对应一个 Dep 实例

    // 递归处理嵌套对象
    this.walk(val);

    const that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        dep.depend();
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        val = newVal;
        // 新值是对象的话，继续递归处理
        that.walk(newVal);
        // 通知更新
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
    this.textReg = /\{\{(.*)\}\}/

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  // 编译 DOM 节点
  compile(node) {
    const childNodes = node.childNodes;

    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        // 编译元素节点
        this.compileElement(node);
      } else if (this.isInterpolation(node)) {
        // 编译文本插值
        this.compileText(node);
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 是否是元素节点
  isElement(node) {
    return node.nodeType === 1;
  }

  // 是否是插值表达式
  isInterpolation(node) {
    return node.nodeType === 3 && this.textReg.test(node.textContent);
  }

  // 编译文本节点
  compileText(node) {
    const exp = node.textContent.match(this.textReg)[1].trim()
    this.update(node, exp, 'text');
  }

  // 编译元素节点
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }
    });
  }

  // 是否是指令
  isDirective(attr) {
    return attr.startsWith('v-');
  }

  // 文本指令
  text(node, exp) {
    this.update(node, exp, 'text');
  }

  // 更新函数
  update(node, exp, dir) {
    const updaterFn = this[dir + 'Updater'];
    // 初始化
    updaterFn && updaterFn(node, this.$vm[exp]);
    // 创建 Watcher
    new Watcher(this.$vm, exp, value => {
      updaterFn && updaterFn(node, value);
    });
  }

  // 文本更新器
  textUpdater(node, value) {
    node.textContent = value;
  }
}

// Vue 类
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data();

    // 1. 响应式处理
    new Observer(this.$data);

    // 2. 代理 data 到 Vue 实例上
    this.proxyData(this.$data);

    // 3. 编译模板
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
}