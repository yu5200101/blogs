function Person(name) {
  this.name = name
  this.age = 18
  this.consoleName = function () {
    console.log(this.name)
  }
}
const personObj = new Person('test-name')

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



