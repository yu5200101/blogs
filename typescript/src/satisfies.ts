// satisfies —— 类型约束检查（Type Constraint）
// 用于在不改变值的推导类型的前提下，让这个值必须满足某个类型结构。如果不满足，在编译时报错。
// 语法：
// const obj = {
//   name: 'Tom',
//   age: 30
// } satisfies { name: string; age: number };
// 与 as 不同：
// as 是强制类型断言（可能会出错）。
// satisfies 是 结构校验，推导更精准。
const colors1 = ['red', 'green', 'blue'] as const;

const theme = {
  primary: 'red',
  secondary: 'blue'
} satisfies Record<'primary' | 'secondary', typeof colors1[number]>;

// 如果写成 primary: 'yellow'，会报错，因为不是 'red' | 'green' | 'blue'

