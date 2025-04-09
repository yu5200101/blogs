function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'end'
}

const hw = helloWorldGenerator()

console.log(hw[Symbol.iterator]() === hw)
// {value: 'hello', done: false}
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())

function* foo(x) {
  const y = 2 * (yield (x + 1))
  console.log(y, 'y')
  const z = yield (y / 3)
  console.log(z, 'z')
  return x + y + z
}
const foo1 = foo(5)
console.log(foo1.next())
console.log(foo1.next())
console.log(foo1.next())
const foo2 = foo(5)
console.log(foo2.next())
console.log(foo2.next(6))
console.log(foo2.next(8))

function* ary() {
  yield 1
  yield 2
  yield 3
  yield 4
  return 5
}
for(let value of ary()) {
  console.log(value)
}