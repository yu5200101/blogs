// ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
const obj = {
  foo: 123,
  get bar () { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
// 上面代码中，Object.getOwnPropertyDescriptors()方法返回一个对象，所有原对象的属性名都是该对象的属性名，对应的属性值就是该属性的描述对象。
// 该方法的实现非常容易
function getOwnPropertyDescriptors(obj) {
  const result = {};
  for(let key of Reflect.ownKeys(obj)){
    result[key] = Object.getOwnPropertyDescriptor(obj, key);
  }
  return result;
}
// 该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
const source = {
  set foo(value) {
    console.log(value);
  }
}
const target1 = {};
Object.assign(target1, source);
Object.getOwnPropertyDescriptor(target1, 'foo');
// { value: undefined,
//   writable: true,
//   enumerable: true,
//   configurable: true }
// 上面代码中，source对象的foo属性的值是一个赋值函数，Object.assign方法将这个属性拷贝给target1对象，结果该属性的值变成了undefined。这是因为Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
// 这时，Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。
const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo');
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
// 上面代码中，两个对象合并的逻辑可以写成一个函数。
const shallowMerge = (target, source) => Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
// Object.getOwnPropertyDescriptors()方法的另一方用处，是配合Object.create()方法，将对象属性克隆到一个新对象。这属于浅拷贝。
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
// 或者
const shallowClone = (obj) => Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))

const obj1 = Object.create(Object);
obj1.extend = 123;
//或者
const obj2 = Object.assign(Object)

const obj3 = {
  method: function () {
  }
}
// obj3.__proto__ = someOtherObj;
//es6的写法
var obj4 = Object.create(Object);
obj4.method = function () {}
// 实现上，__proto__调用的是Object.prototype.__proto__
Object.defineProperty(Object.prototype, '__proto__', {
  get () {
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set (proto) {
    if (this === undefined || this === null) {
      throw new TypeError();
    }
    if (!isObject(this)) {
      return undefined;
    }
    if (!isObject(proto)) {
      return undefined;
    }
    let status = Reflect.setPrototypeOf(this, proto);
    if (!status) {
      throw new TypeError();
    }
  } 
})
'assign' in Object // true
Reflect.has(Object, 'assign'); //true

let i = 0;
with({
  get a() {
    return ++i;
  }
}){
  console.log(a == 1 && a == 2 && a == 3);
}

const obj5 = Object.create(obj1);
obj5.enumerable = 'enumerable';
Object.defineProperty(obj5, 'not-enumerable', {
  value: 'value1',
  enumerable: false
});
obj5[Symbol('1')] = 'symbol(1)';

// 循环遍历自身，可枚举属性，包含继承，不包含symbol
for(let key in obj5) {
  console.log('for...in...:', key)
}
// 循环遍历自身，可枚举属性，不包含继承，不包含symbol
console.log('Object.keys:' , Object.keys(obj5))
// 循环遍历自身，可枚举属性，不可枚举属性，不包含继承，不包含symbol
console.log('Object.getOwnPropertyNames:', Object.getOwnPropertyNames(obj5))
// 循环遍历自身，只包含symbol
console.log('Object.getOwnPropertySymbols:', Object.getOwnPropertySymbols(obj5))
// 循环遍历自身，可枚举属性，不可枚举属性，不包含继承，包含symbol
console.log('Reflect.ownKeys:', Reflect.ownKeys(obj5))

console.log('Object.getPrototypeOf:', Object.getPrototypeOf(obj5) === obj1)
console.log('Object.setPrototypeOf:', Object.setPrototypeOf(obj5, obj2))
console.log('Object.getPrototypeOf:', Object.getPrototypeOf(obj5) === obj2)

const ary = [1, 2, 3, 4]
for(let key in ary) {
  console.log('for...in...:', key)
}
for(let value of ary) {
  console.log('for...of...:', value)
}

function myObjectIs(old, val) {
  // 处理NAN = NAN
  if (old !== old && val !== val) return true
  if (old === 0 && val === 0) {
    // +Infinity ≠ -Infinity
    return 1 / old === 1 / val
  }
  return old === val
}

// 1. NaN 比较
console.log(myObjectIs(NaN, NaN)); // true
console.log(NaN === NaN);          // false

// 2. ±0 比较
console.log(myObjectIs(+0, -0));   // false
console.log(+0 === -0);            // true

// 3. 普通值比较
console.log(myObjectIs(42, 42));   // true
console.log(myObjectIs("a", "a")); // true

// 4. 对象引用比较
const obj6 = {};
console.log(myObjectIs(obj6, obj6)); // true
console.log(myObjectIs({}, {}));   // false

// 测试所有边界条件
console.log(myObjectIs(NaN, NaN) === Object.is(NaN, NaN));  // true
console.log(myObjectIs(+0, -0) === Object.is(+0, -0));      // true
console.log(myObjectIs(0, -0) === Object.is(0, -0));        // true
console.log(myObjectIs("a", "a") === Object.is("a", "a"));  // true