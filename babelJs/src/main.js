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
