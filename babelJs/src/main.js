function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable
  }
}

@testable(true)
class MyTestTableClass {}
console.log(MyTestTableClass.isTestable)

@testable(false)
class MyClass {}
console.log(MyClass.isTestable)

function readonly(target, name, descriptor) {
  // 可写属性置为false
  descriptor.writable = false
  return descriptor
}

class Person {
  constructor() {
    this.first = 'hello'
    this.last = 'world'
  }
  @readonly
  name() {
    return `${this.first} ${this.last}`
  }
}

const person = new Person()
console.log(person.name())