// 交叉类型
// function extend<T, U>(first: T, second: U): T & U {
//   const result: <T & U> = {}
//   for (let key in first) {
//     result[key] = first[key]
//   }
//   for (let key in second) {
//     if (!result.hasOwnProperty(key)) {
//       second[key] = first[key]
//     }
//   }
//   return result
// }
// 联合类型
function formatLine(command: string[] | string) {
  let line = ''
  if (typeof command === 'string') {
    line = command.trim()
  } else {
    line = command.join(' ').trim()
  }
}
// 类型别名
type same = string | number
// 类型索引
interface Button {
  type: string
  text: string
}
type ButtonKey = keyof Button
type ButtonKey1 = 'type' | 'text'
// ButtonKey=ButtonKey1
// 类型约束
type BaseType = string | boolean | number
function copy<T extends BaseType>(arg: T): T {
  return arg
}
const copy1 = <T extends BaseType>(arg: T): T => {
  return arg
}
console.log(copy(1), 'copy1')
console.log(copy1('copy2'), 'copy2')

function getValue<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const obj1 = {name: 'bai'}
console.log(getValue(obj1, 'name'), 'name')

// 类型映射
// Readonly 在默认接口中已有 in关键字作类型映射
type Readonly1<T> = {
  readonly [P in keyof T]: T[P]
}

interface Obj {
  a: string
  b: string
}

type ReadonlyObj = Readonly1<Obj>
type ReadonlyObj2 = Readonly<Obj>

interface ReadonlyObj1 {
  readonly a: string
  readonly b: string
}
// ReadonlyObj=ReadonlyObj1=ReadonlyObj2

//条件类型
type ifObj = Obj extends Button ? string : number

// 泛型-创建可复用的类型和函数
// infer 用于条件类型推导类型

// 提取函数返回值类型（类似内置的 ReturnType<T>）
type MyReturnType<T> = T extends (...arg: any[]) => infer P ? P : never
type FnReturnType = MyReturnType<() => number>

// 提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : never
type ArrElement = ElementType<number[]>

// 提取 Promise 的 resolve 类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type Resolved = UnwrapPromise<Promise<number>>

// 将函数参数类型转为元组类型（类似内置的 Parameters<T>）
type MyParams<T> = T extends (...arg: infer P) => any ? P : never
type Params = MyParams<(a: number, b: string) => void>