// is —— 类型守卫（Type Predicate）
// 语法：function fn(x: unknown): x is SomeType
// 函数返回值是一个布尔值，但告诉 TypeScript：“如果返回 true，那么 x 就是 SomeType”
// 示例：
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

function isArray<T>(x: unknown): x is Array<T> {
  return x instanceof Array
}

function print(value: unknown) {
  if (isString(value)) {
    // 这里 TS 已经知道 value 是 string 了
    console.log(value.toUpperCase());
  } else {
    console.log('Not a string');
  }
}
