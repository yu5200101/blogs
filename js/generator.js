function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'end'
}

const hw = helloWorldGenerator()
// true
console.log(hw[Symbol.iterator]() === hw)
// {value: 'hello', done: false}
console.log(hw.next())
// { value: 'world', done: false }
console.log(hw.next())
// { value: 'end', done: true }
console.log(hw.next())
// { value: undefined, done: true }
console.log(hw.next())

function* foo(x) {
  const y = 2 * (yield (x + 1))
  console.log(y, 'y')
  const z = yield (y / 3)
  console.log(z, 'z')
  return x + y + z
}
// x=5
const foo1 = foo(5)
// { value: 6, done: false }
console.log(foo1.next())
// NAN y
// { value: NaN, done: false }
console.log(foo1.next())
// undefined z
// { value: NaN, done: true }
console.log(foo1.next())
// x=5
const foo2 = foo(5)
// { value: 6, done: false }
console.log(foo2.next())
// 12 y
// { value: 4, done: false }
console.log(foo2.next(6))
// 8 z
// { value: 25, done: true }
console.log(foo2.next(8))

function* ary() {
  yield 1
  yield 2
  yield 3
  yield 4
  return 5
}
for(let value of ary()) {
  // 1 2 3 4
  console.log(value)
}