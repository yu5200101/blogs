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

var number = 5;
var obj = {
  number: 3,
  fn: (function () {
    var number;
    this.number *= 2;
    number = number * 2;
    number = 3;
    return function () {
      var num = this.number;
      this.number *= 2;
      console.log(num);
      number *= 3;
      console.log(number);
    }
  })()
}
var myFun = obj.fn;
myFun.call(null);
obj.fn();
console.log(window.number);
console.log(obj.number);


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
  /* 
  如果第一个参数传入的是null或者是undefined，那么this指向window/global
  如果第一个参数传入的不是null或者是undefined，那么必须是一个对象
  */
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

Function.prototype.myBind = function (context) {
  if(typeof this !== 'function') {
    throw new TypeError('not a function');
  }
  let self = this;
  let args = [...arguments].slice(1);
  function Fn() {}
  Fn.prototype = this.prototype;
  let bound = function () {
    let res = [...args, ...arguments];// bind传递的参数和函数调用时传递的参数拼接
    context = this instanceof Fn ? this : context || this;
    return self.apply(context, res);
  }
  //原型链
  bound.prototype = new Fn();
  return bound;
}
var name = 'Jack';
function person (age, job, gender) {
  console.log(this.name, age, job, gender);
}
var Yve = { name: 'Yvette' };
let result = person.myBind(Yve, 22, 'enginner')('female');