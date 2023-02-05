
const fn = (name) => {
  console.log('我是：', name)
}

// 调用函数是对对象的基本操作
fn()

const p2 = new Proxy(fn, {
  // 使用apply拦截函数调用
  apply(target, thisArg, argArray) {
    target.call(thisArg, ...argArray)
  }
})

p2('yry')

const obj = {
  foo: 1,
  get bar() {
    return this.foo
  }
}
console.log(obj.foo)
console.log(Reflect.get(obj, 'foo'))

const obj1 = {
  get foo() {
    return this.foo
  }
}

console.log(Reflect.get(obj1, 'foo', {foo: 2}));