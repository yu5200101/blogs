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

// 工具类型
interface User {
  id: number
  name: string
}
// 映射类型
type MyPartial<T> = {
  [K in keyof T]? : T[K]
}
type partial = Partial<User>
type myPartial = MyPartial<User>
// 等价于 { id?: number; name?: string; }

type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}
type required = Required<User>
type myRequired = MyRequired<User>
// 等价于 { id: number; name: string; }
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}
type readonly = Readonly<User>
type myReadonly = MyReadonly<User>
// 等价于 { Readonly id: number; Readonly name: string; }

type pick = Pick<User, 'id'>
// 等价于 { id: number }

type myPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type omit = Omit<User, 'id'>
// 等价于 { name: string }

type record = Record<string, User>
// 等价于 { [key: string]: User }

type none = NonNullable<string | number | null | undefined>
// 等价于 string | number

type exclude = Exclude<'a' | 'b' | 'c', 'a'>
// 等价于 'b' | 'c'

type extract = Extract<'a' | 1 | false, string>
// 等价于 'a'

type returnType = ReturnType<() => number>
// 返回 number

type parameters = Parameters<(a: number, b: string) => void>
// 等价于 [number, string]

function pa1(...args: parameters) {
  console.log(args)
}
pa1(1, '1')

class C {
  constructor(a: number, b: string) {}
}
type constructorParameters = ConstructorParameters<typeof C>
// [a: number, b: string]

type instanceType = InstanceType<typeof C>
// C

type upper = Uppercase<'hello'>
// HELLO

type lower = Lowercase<'HELLO'>
// hello

type capitalize = Capitalize<'hello'>
// Hello

type unCapitalize = Uncapitalize<'Hello'>
// hello

function thisFn(this: Window) {}
type thisParameterType = ThisParameterType<typeof thisFn>
// Window

type omitThisParameter = OmitThisParameter<typeof thisFn>
// () => void

// 条件类型
// 语法：T extends U ? X : Y
type IsString<T> = T extends string ? true : false
type aString = IsString<"hello">;  // true
type bString = IsString<42>;       // false

// 分布式条件类型
// 当条件类型作用于联合类型时，会进行分布式运算：
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>
// 等价于 string[] | number[]

// 映射类型
// 语法：{ [Key in KeySet]: ValueType }
// 获取函数属性名的联合类型
type FunctionType<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

// 提取函数属性的对象类型
type FunctionKey<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : never
}[keyof T]

class User1 {
  id: number = 0;
  name: string = "";
  save() {}
  update() {}
}
type UserFuncKeys = FunctionKey<User1>
// 'save' | 'updata'
type UserFuncProps = FunctionType<User1>
/* 结果:
{
  save: () => void;
  update: () => void;
}
*/

// 模板文字类型
// 语法：使用反引号（`）和 ${} 插值语法：
// 结合映射类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

const userDesc = { name: "Alice", age: 30 };

// 关键字
// typeof 类型查询操作符
type UserType = typeof userDesc
/*
等价于：
type UserType = {
  name: string
  age: number
}
*/

// keyof 键查询操作符
type UserKeys = keyof User;
// "id" | "name"

// in 映射类型操作符
type Options = "dark" | "light";
type Theme = {
  [K in Options]: string;
};
/*
等价于：
{
  dark: string;
  light: string;
}
*/

// is 类型谓词
function isString1(value: unknown): value is string {
  return typeof value === "string";
}

// infer 条件类型推断
// 泛型-创建可复用的类型和函数
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

// as 类型断言
const element = document.getElementById("root") as HTMLElement;

// satisfies 类型满足检查
const colors = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF"
} satisfies Record<string, string>;

// const 断言
// 对象 const 断言
const user1 = {
  name: "Alice",
  age: 30,
  permissions: ["read", "write"]
} as const;
/*
类型被推断为：
{
  readonly name: "Alice";
  readonly age: 30;
  readonly permissions: readonly ["read", "write"];
}
*/
// extends - 类型约束
// 基本约束
function identity<T extends string | number>(value: T): T {
  return value;
}

type User2 = {
  name: string
  age: number
  attr: string
}

// 提取string 如下：
// type User2 = {
//   name: string
//   attr: string
// }

type GetUserS<T> = Pick<T, {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]>

type GetUserS2<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}