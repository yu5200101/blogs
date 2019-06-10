
// value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。
/* function makeIterator(array){
  var nextIndex = 0;
  return {
    next: function(){
      return nextIndex < array.length ? {value: array[nextIndex++], done: false} : {value: undefined, done: true}
    }
  }
} */
// 对于遍历器对象来说，done: false和value: undefined属性都是可以省略的，因此上面的makeIterator函数可以简写成下面的形式。
/* function makeIterator(array){
  var nextIndex = 0;
  return {
    next: function(){
      return nextIndex < array.length ? {value: array[nextIndex++]} : {done: true}
    }
  }
}
var it = makeIterator(['a', 'b']);
console.log(it.next());
console.log(it.next());
console.log(it.next()); */
// 下面是一个无限运行的遍历器对象的例子。
/* var it = idMaker();
it.next().value 

function idMaker(){
  var index = 0;
  return {
    next: function (){
      return {value: index++, done: false}
    }
  }
} */

/* const obj = {
  [Symbol.iterator]: function() {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        }
      }
    }
  }
} */
/* let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

let generator = function* () {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
}
var iterator = generator();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next()); */
function* gen () {
  let a = yield 111;
  console.log(a);
  let b = yield 222;
  console.log(b);
  let c = yield 333;
  console.log(c);
  let d = yield 444;
  console.log(d);
}
let t = gen();
//next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
t.next(1); //第一次调用next函数时，传递的参数无效
t.next(2); //a输出2;
t.next(3); //b输出3; 
t.next(4); //c输出4;
t.next(5); //d输出5;

let obj = {
  name: 'yuan',
  age: 23,
  job: 'web',
  [Symbol.Iterator] () {
    const self = this;
    const keys = Object.keys(self);
    let index = 0;
    return {
      next () {
        if (index < keys.length) {
          return {
            value: self[keys[index++]],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    }
  }
}
for (let item of obj) {
  console.log(item);
}
//使用generator函数（遍历器对象生成函数）简写Symbol.iterator方法，可以简写如下：
let obj = {
  name: 'yuan',
  age: 23,
  job: 'web',
  * [Symbol.iterator] () {
    const self = this;
    const keys = Object.keys(self);
    for(let index = 0; index < keys.length; index++) {
      yield self[keys[index]];//yield 表达式仅能使用在generator函数中
    }
  }
}

