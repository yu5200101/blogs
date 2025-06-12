/* var obj = {
  hi: function () {
    console.log(this);
    return () => {
      console.log(this);
    }
  },
  sayHi: function () {
    return function () {
      console.log(this);
      return () => {
        console.log(this);
      }
    }
  },
  say: () => {
    console.log(this);
  }
}
let hi = obj.hi();
hi();
let sayHi = obj.sayHi();
let fun1 = sayHi();
fun1();
obj.say(); */

/* var obj = {
  hi: function () {
    console.log(this);
    return () => {
      console.log(this);
    }
  },
  sayHi: function () {
    return function () {
      console.log(this);
      return () => {
        console.log(this);
      }
    }
  },
  say: () => {
    console.log(this);
  }
}
let sayHi = obj.sayHi();
let fun1 = sayHi();
fun1();
let fun2 = sayHi.bind(obj)();
fun2(); */

function test(a,b){
  console.log(b)
  return {
    test:function(c){
      return test(c,a)
    }
  }
}
const retA = test(0);
// a = 0
// log undefined
// retA = {
//   test:function(c){
//     return test(c,a)
//   }
// }
console.log(retA, 'retA')
retA.test(2);
// c = 2 a = 0
// log 0 a = 2
retA.test(4);
// log 0 a = 4
retA.test(8);
// log 0 a = 8
var retB = test(0).test(2).test(4).test(8);
// a = 0
// a = 2
// a = 4
// a = 8
// log undefined 0 2 4
var retC = test('good').test('bad');
// log undefined good
retC.test('good')
// log bad
retC.test('bad')
// log bad

var number = 5;
var obj = {
  number: 3,
  // 自执行函数
  fn: (function () {
    var number;
    this.number *= 2;
    // 10 让window.number = 10
    console.log('this.number', this.number);
    number = number * 2;
    // NAN
    console.log('number1', number);
    number = 3;
    // 3
    console.log('number2', number);
    return function () {
      console.log('return function this.number', this.number);
      var num = this.number;
      console.log('fn-num', num);
      this.number *= 2;
      console.log('fn-this.number', this.number);
      number *= 3;
      console.log('fn-number', number);
    }
  })()
}
var myFun = obj.fn;
// 让window.number = 20 上级作用域 number = 9
myFun.call(null);
// 让obj.number = 3*2 = 6 上级作用域number = 27
obj.fn();
// console.log('window.number', window.number);
console.log('obj.number', obj.number);


//测试代码
var foo = {
  name: 'yuan'
}
var info = {
  name: 'bao'
}
var name = 'bao';
function bar (job, age) {
  console.log(this.name);
  console.log(job, age);
}

/* 
call 和 apply 的功能相同，区别在于传参的方式不一样:
fn.call(obj, arg1, arg2, ...),调用一个函数, 具有一个指定的this值和分别地提供的参数(参数的列表)。

fn.apply(obj, [argsArray]),调用一个函数，具有一个指定的this值，以及作为一个数组（或类数组对象）提供的参数。
*/
// call
/* 
将函数设为传入参数的属性
指定this到函数并传入给定参数执行函数
如果不传入参数或者参数为null，默认指向为 window / global
删除参数上的函数
*/
Function.prototype.call = function (context) {
  // 如果第一个参数传入的是null或者是undefined，那么this指向window/global
  // 如果第一个参数传入的不是null或者是undefined，那么必须是一个对象

  if (!context) {
    //  context为null或者是undefined
    context = typeof window === 'undefined' ? global : window;
  }
  context.fn = this;// this指向的是当前的函数（Function的实例）
  let args = [...arguments].slice(1); //获取除了this指向对象以外的参数，空数组slice后返回的仍然是空数组
  let result = context.fn(...args);// 隐式绑定，当前函数的this指向了context
  delete context.fn;
  return result;
}

bar.call(foo, 'programmer', 20);
// Selina programmer 20
bar.call(null, 'teacher', 25);
// 浏览器环境: Chirs teacher 25; node 环境: undefined teacher 25

// apply
/*
apply的实现和call很类似，但是需要注意他们的参数是不一样的，apply的第二个参数是数组或类数组.
*/
Function.prototype.apply = function(context, rest) {
  if(!context) {
    context = typeof window === 'undefined' ? global : window;
  }
  context.fn = this;
  let result = null;
  if (rest === undefined || rest === null) {
    //undefined 或者是null不是Iterator对象， 不能被...
    result = context.fn(rest);
  } else if(typeof rest === 'object') {
    result = context.fn(...rest);
  }
  delete context.fn;
  return result;
}

bar.apply(foo, ['programmer', 20]);
// Selina programmer 20
bar.apply(null, ['teacher', 25]);
// 浏览器环境: Chirs programmer 20; node 环境: undefined teacher 25

//bind
/*
bind和call/apply有一个很重要的区别，一个函数被call/apply的时候，会直接调用，但是bind会创建一个新函数。当这个新函数被调用时，bind()的第一个参数将作为它运行时的this,之后的一系列参数将会在传递的实参前传入作为它的参数。
*/

Function.prototype.myBind = function(context, ...presetArgs) {
  const originalFunc = this;
  function boundFunc(...callArgs) {
    const allArgs = presetArgs.concat(callArgs);
    const isNewCall = this instanceof boundFunc;
    if (isNewCall) {
      // 通过 new 调用，忽略绑定的 context，使用新实例作为 this
      const instance = originalFunc.apply(this, allArgs);
      // 如果构造函数返回对象，则返回该对象，否则返回实例
      if ((typeof instance === 'object' && instance !== null) || typeof instance === 'function' ) {
        return instance
      }
      return this
    }
    // 普通调用，使用绑定的 context
    return originalFunc.apply(context, allArgs);
  }
  // 维护原型关系，使通过 new boundFunc 创建的实例继承原函数的原型
  boundFunc.prototype = Object.create(originalFunc.prototype);
  return boundFunc;
};

Function.prototype.bind1 = function(context, ...preArgs) {
  const originFn = this
  const boundFunc = function(...args) {
    const allArgs = [...preArgs, ...args]
    const isNew = this instanceof boundFunc
    if (isNew) {
      const instance = originFn.apply(this, allArgs)
      if ((typeof instance === 'object' && instance !== null) || typeof instance === 'function') {
        return instance
      }
      return this
    }
    return originFn.apply(context, allArgs)
  }
  boundFunc.prototype = Object.create(originFn.prototype)
  return boundFunc
}

// 测试普通调用
const obj2 = { x: 42 };
function test1(a, b) { return this.x + a + b; }
const boundTest = test1.myBind(obj2, 2);
console.log(boundTest(3)); // 42 + 2 + 3 = 47

// 测试 new 调用
function Person(name, age) {
    this.name = name
    this.age = age;
}
Person.prototype.sayHi = function() { console.log(`Hi, I'm ${this.name}`); };

// 测试构造函数返回实例-函数
const BoundPerson = Person.myBind(null, 'Alice');
const person2 = new BoundPerson(30);
console.log(person2 instanceof Person); // true
person2.sayHi(); // Hi, I'm Alice
console.log(person2.age); // 30

// 测试构造函数返回实例-对象
function Test2() {
  return { foo: 'bar' };
}
const BoundTest = Test2.myBind(null);
const testObj = new BoundTest();
console.log(testObj.foo); // 'bar'

// 测试构造函数返回this
function Test3() {
  return ''
}
const BoundTest1 = Test3.myBind(null);
const testObj2 = new BoundTest1();
console.log(testObj2 instanceof Test3);
console.log(testObj2 instanceof BoundTest1);

var a = 2
var obj3 = {
  a: 3,
  fn: function(){
    (() => {
      console.log(this.a)
    })()
  }
}
// 3
obj3.fn()
