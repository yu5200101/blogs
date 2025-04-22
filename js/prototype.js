function Person(name) {
  this.name = name
  this.age = 18
  this.consoleName = function () {
    console.log(this.name)
  }
}
const personObj = new Person('test-name')
console.log(personObj instanceof Person);

// 原型链指向:__proto__
// 原型对象prototype
console.log(personObj.__proto__ === Person.prototype);
// 一切原型对象都指向Object
console.log(Person.prototype.__proto__ === Object.prototype)
console.log(Function.prototype.__proto__ === Object.prototype)
// Object原型对象指向根源对象null
console.log(Object.prototype.__proto__ === null)
// 一切函数对象,包含Object,都指向Function
console.log(Person.__proto__ === Function.prototype)
console.log(Object.__proto__ === Function.prototype);
console.log(Function.__proto__ === Function.prototype);

var a = 2

function fn1() {
  a = 3
  console.log(a, 'fn1')
}

function fn2() {
  var a = 4
  fn1()
  console.log(a, 'fn2')
}

fn2()

// 原型链继承
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}

function Child() {
  this.type = 'child'
}

Child.prototype = new Parent()

const child1 = new Child()
const child2 = new Child()
child1.play.push(4)
// 两个值全等 [1, 2, 3, 4]
console.log(child1.play, child2.play)

// 构造函数继承
function Parent1() {
  this.name = 'parent1'
}
Parent1.prototype.getName = function() {
  return this.name
}
function Child1() {
  Parent1.call(this)
  this.type = 'child1'
}

const child3 = new Child1()
// 没问题
console.log(child3)
// 报错
try {
  console.log(child3.getName())
} catch (err) {
  console.log(err)
}

// 组合继承 =原型链继承 +构造函数继承
function Parent3() {
  this.name = 'parent3'
  this.play = [1, 2, 3]
}
Parent3.prototype.getName = function() {
  return this.name
}
function Child3() {
  Parent3.call(this)
  this.type = 'child3'
}

Child3.prototype = new Parent3()
// 修复构造函数指向
Child3.prototype.constructor = Child3

const child4 = new Child3()
const child5 = new Child3()
child4.play.push(4)
console.log(child4.play, child5.play)
console.log(child4.getName())
console.log(child5.getName())

// 原型式继承
let parent4 = {
  name: 'parent4',
  friends: ['f1', 'f2', 'f3'],
  getName: function() {
    return this.name
  }
}
let person4 = Object.create(parent4)
person4.name = 'name4'
person4.friends.push('f4')
let person5 = Object.create(parent4)
person5.friends.push('f5')
console.log(person4.name);
console.log(person4.getName());
console.log(person4.friends);
console.log(person5.name);
console.log(person5.friends);

// 寄生式继承
let parent5 = {
  name: 'parent5',
  friends: ['f1', 'f2', 'f3'],
  getName: function() {
    return this.name
  }
}
function clone (origin) {
  const cloneObj = Object.create(origin)
  cloneObj.getFriends = function() {
    return this.friends
  }
  return cloneObj
}

let person6 = clone(parent5)
person6.name = 'name6'
person6.friends.push('f6')
let person7 = clone(parent5)
person7.friends.push('f7')

console.log(person6.name);
console.log(person6.getName());
console.log(person6.friends);
console.log(person6.getFriends());
console.log(person7.name);
console.log(person7.friends);
console.log(person7.getFriends());

// 寄生组合式继承
function clone6(parent, child) {
  // 2. 继承父类原型方法
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
}

function Parent6() {
  this.name = 'parent6'
  this.play = [1, 2, 3]
}
Parent6.prototype.getName = function() {
  return this.name
}
function Child6() {
  // 1. 继承父类实例属性
  Parent6.call(this)
  this.friends = 'child6'
}
clone6(Parent6, Child6)
Child6.prototype.getFriends = function() {
  return this.friends
}
const person8 = new Child6()
person8.name = 'name8'
person8.friends = 'f8'
person8.play.push('p8')

const person9 = new Child6()
person9.name = 'name9'
person9.friends = 'f9'
person9.play.push('p9')

console.log(person8.name);
console.log(person8.getName());
console.log(person8.friends);
console.log(person8.play);
console.log(person8.getFriends());
console.log(person9.name);
console.log(person9.getName());
console.log(person9.friends);
console.log(person9.play);
console.log(person9.getFriends());

// es6 extend
class Person1 {
  constructor(name) {
    this.name = name
  }
  getName() {
    console.log(this.name, 'name')
  }
}

class Student extends Person1 {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}

const student = new Student('test', 12)
student.getName()

function Fnn() {}
Fnn.prototype.arr = [1]
Fnn.prototype.b = 1

const Fnn1 = new Fnn()
Fnn1.arr = [2]
Fnn1.b = 2

const Fnn2 = new Fnn()
console.log(Fnn1.arr, Fnn1.b);
console.log(Fnn2.arr, Fnn2.b);

function myInstanceof(obj, constructor) {
  // 处理基本类型，若 obj 不是对象或为 null，直接返回 false
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 检查右侧是否为可调用的构造函数
  if (typeof constructor !== 'function') {
    throw new TypeError('Right-hand side of instanceof is not callable');
  }

  // 获取构造函数的 prototype 属性
  const prototype = constructor.prototype;
  // 确保 prototype 是对象类型
  if (typeof prototype !== 'object' || prototype === null) {
    throw new TypeError('Constructor.prototype is not an object');
  }

  // 获取对象的原型
  let objProto = Object.getPrototypeOf(obj);
  while (objProto !== null) {
    // 发现匹配，返回 true
    if (objProto === prototype) {
      return true;
    }
    // 继续向上遍历原型链
    objProto = Object.getPrototypeOf(objProto);
  }

  // 遍历完原型链未找到匹配项，返回 false
  return false;
}

console.log('myInstanceof', myInstanceof(Fnn2, Fnn));

function Parent10() {
  this.name = "Parent"; // 父类实例属性，不会被继承
}
Parent10.prototype.say = function() {
  console.log("Parent method");
};

function Child10() {}
Child10.prototype.__proto__ = Parent10.prototype;

const child10 = new Child10();
child10.say();          // 输出: "Parent method"（继承原型方法）
console.log(child10.name); // 输出: undefined（未继承实例属性）

function Parent11() {
  this.name = "Parent"; // 父类实例属性，会被添加到 child.prototype
}
Parent11.prototype.say = function() {
  console.log("Parent method");
};

function Child11() {}
Child11.prototype = new Parent11();

const Child111 = new Child11();
const Child112 = new Child11();

Child111.say();          // 输出: "Parent method"（继承原型方法）
console.log(Child111.name); // 输出: "Parent"（继承自 child.prototype.name）

Child112.name = "Child";
console.log(Child112.name); // 输出: "Parent"（修改的是实例自身属性，不影响原型）
