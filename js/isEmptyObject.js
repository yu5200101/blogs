function isEmptyObject (obj) {
  const ownPropertyNames = Object.getOwnPropertyNames(obj)
  for(let property of ownPropertyNames) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, property)
    if (descriptor.value) {
      return false
    }
  }
  let prototype = Object.getPrototypeOf(obj)
  while(prototype && prototype !== Object.prototype) {
    const propertyNames = Object.getOwnPropertyNames(prototype)
    for(let property of propertyNames) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property)
      if (descriptor.value) {
        return false
      }
    }
    prototype = Object.getPrototypeOf(prototype)
  }
  return true
}

function fn1() {
}
// fn1.prototype.getClass = function() {}

const fnObj = new fn1()
const obj = {}
console.log(isEmptyObject(fn1))
console.log(isEmptyObject(obj))