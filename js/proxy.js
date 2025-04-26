/*
get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
*/
function createArray (...elements) {
  let handler = {
    get (target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
console.log(arr[-1]); // c
// 上面代码中，数组的位置参数是-1，就会输出数组的倒数第一个成员。

var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oProxy = new Proxy({}, {
      get: function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          }, value);
        }
        funcStack.push(window[fnName]);
        return oProxy;
      }
    });

    return oProxy;
  }
}());

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

console.log(pipe(3).double.pow.reverseInt.get); // 63
// 利用 Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作。

const dom = new Proxy({}, {
  get (target, property) {
    return function (attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({ href: '//example.com' }, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);
// 上面的例子则是利用get拦截，实现一个生成各种 DOM 节点的通用函数dom。

/*
如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。
*/
const proxy1 = new Proxy({}, {
  get: function (target, property, receiver) {
    return receiver;
  }
});
proxy1.getReceiver === proxy1 // true
const target1 = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler1 = {
  get (target, propKey) {
    return 2;
  }
};

const proxy2 = new Proxy(target1, handler1);
try {
  console.log(proxy2.foo);
} catch (err) {
  console.log(err)
}
try {
  delete proxy2.foo;
} catch (err) {
  console.log(err)
}

const handler2 = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target2 = {};
const proxy3 = new Proxy(target2, handler2);
try {
  proxy3._prop
} catch (err) {
  console.log(err)
}
// Error: Invalid attempt to get private "_prop" property
try {
  proxy3._prop = 'c'
} catch (err) {
  console.log(err)
}
// Error: Invalid attempt to set private "_prop" property
// 上面代码中，只要读写的属性名的第一个字符是下划线，一律抛错，从而达到禁止读写内部属性的目的。


/*
set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。
*/
const handler4 = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy4 = new Proxy({}, handler4);
const myObj = {};
Object.setPrototypeOf(myObj, proxy4);

myObj.foo = 'bar';
console.log(myObj.foo === myObj) // true
/*
上面代码中，设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。
*/
const obj4 = {};
Object.defineProperty(obj4, 'foo', {
  value: 'bar',
  writable: false,
});

const handler5 = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = 'baz';
  }
};

const proxy5 = new Proxy(obj4, handler5);
proxy5.foo = 'baz';
console.log(proxy5.foo) // "bar"
// 上面代码中，obj.foo属性不可写，Proxy 对这个属性的set代理将不会生效。

// 注意，严格模式下，set代理如果没有返回true，就会报错。
'use strict';
const handler6 = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 无论有没有下面这一行，都会报错
    return false;
  }
};
const proxy6 = new Proxy({}, handler6);
proxy6.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'

// apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
var target7 = function () { return 'I am the target'; };
var handler7 = {
  apply: function () {
    return 'I am the proxy';
  }
};

var proxy7 = new Proxy(target7, handler7);

console.log(proxy7())
// "I am the proxy"
// 上面代码中，变量p是 Proxy 的实例，当它作为函数调用时（p()），就会被apply方法拦截，返回一个字符串
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy8 = new Proxy(sum, twice);
console.log(proxy8(1, 2)) // 6
console.log(proxy8.call(null, 5, 6)) // 22
console.log(proxy8.apply(null, [7, 8])) // 30
// 上面代码中，每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截。

/*
has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
*/
// 下面的例子使用has方法隐藏某些属性，不被in运算符发现。
var handler9 = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target9 = { _prop: 'foo', prop: 'foo' };
var proxy9 = new Proxy(target9, handler9);
console.log('_prop' in proxy9) // false

// 如果原对象不可配置或者禁止扩展，这时has拦截会报错。
var obj9 = { a: 10 };
Object.preventExtensions(obj9, {
  has: function (target, prop) {
    return false;
  }
});
// false
console.log('b' in obj9)
/*
上面代码中，obj对象禁止扩展，结果使用has拦截就会报错。也就是说，如果某个属性不可配置（或者目标对象不可扩展），则has方法就不得“隐藏”（即返回false）目标对象的该属性。
值得注意的是，has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性
另外，虽然for...in 循环也用到了in运算符，但是has拦截对for...in循环不生效
 */
let stu1 = { name: '张三', score: 59 };
let stu2 = { name: '李四', score: 99 };

let handler10 = {
  has (target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      console.log(`${target.name} 不及格`);
      return false;
    }
    return prop in target;
  }
}

let proxy10 = new Proxy(stu1, handler10);
let proxy11 = new Proxy(stu2, handler10);

'score' in proxy10
// 张三 不及格
// false

'score' in proxy11
// true

for (let a in proxy10) {
  console.log(proxy10[a]);
}
// 张三
// 59

for (let b in proxy11) {
  console.log(proxy11[b]);
}
// 李四
// 99
/*
construct方法用于拦截new命令，下面是拦截对象的写法
*/
var handler12 = {
  construct(target, args, newTarget) {
  }
}
/*
construct方法可以接受两个参数。
target：目标对象
args：构造函数的参数对象
newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）
*/
var proxy13 = new Proxy(function(){}, {
  construct: function(target, args) {
    console.log('called:' + args.join(', '));
    return {value: args[0] * 10}
  }
});
(new proxy13(1)).value
// construct方法返回的必须是一个对象，否则会报错。
var proxy13 = new Proxy(function () { }, {
  construct: function (target, argumentsList) {
    return 1;
  }
});

try {
  new proxy13() // 报错
} catch (err) {
  console.log(err)
}

const handler14 = {
  deleteProperty(target, key) {
    invariant(key, 'delete')
    Reflect.deleteProperty(target, key)
    return true
  }
}
const target14 = {
  '_prop': 'prop'
}
Object.defineProperty(target14, 'foo', {
  value: 'bar',
  // writable: true,
  enumerable: true,
  // 没有如下这一行，delete proxy14.foo 会报错
  // configurable: true
});
const proxy14 = new Proxy(target14, handler14)
try {
  delete proxy14._prop
} catch (err) {
  // Invalid attempt to delete private "_prop" property
  console.log(err)
}
try {
  delete proxy14.foo
} catch (err) {
  console.log(err)
}

Proxy.revocable(target14, handler14)
console.log(target14, 'target14')
try {
  delete proxy14._prop
} catch (err) {
  // Invalid attempt to delete private "_prop" property
  console.log(err)
}

// 观察者接口
class Observer {
  update(state) {
    console.log(`Observer received update: ${state}`);
  }
}

// 主题类
class Subject {
  constructor() {
    this.state = null;
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.state));
  }
}

// 创建Proxy来拦截对Subject状态的修改
const handler15 = {
  set(target, property, value) {
    if (property === 'state') {
      target[property] = value;
      target.notifyObservers(); // 状态改变时通知观察者
      return true;
    }
    return false;
  }
}

// 使用示例
const subject = new Subject();
const proxySubject = new Proxy(subject, handler15);

const observer1 = new Observer();
const observer2 = new Observer();

proxySubject.addObserver(observer1);
proxySubject.addObserver(observer2);

proxySubject.state = 'New State'; // 修改状态，观察者会收到通知

function reactive(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const observer = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`get:${key}:${res}`);
      if (typeof res === 'object') return reactive(obj)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`set:${key}:${res}`);
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`deleteProperty:${key}:${res}`);
      return res
    }
  })
  return observer
}

const reactive1 = new reactive({
  a: 'a',
  c: {d: 1}
})
console.log('init', reactive1.a);
reactive1.a = 'aa'
reactive1.b = 'b'
delete reactive1.b
reactive1.c.d = 'd'

let count = 0;
Object.defineProperty(window, 'a', {
  get() {
    count++;
    return count;
  }
});

console.log(a === 1 && a === 2 && a === 3); // true
