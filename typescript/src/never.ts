// never —— 永远不会发生的类型
// 作用：
// 表示不会有值的情况。通常用于：
// 函数永远不会返回（如抛错或死循环）
// 不可达代码
// 1. 函数抛出异常
function throwError(message: string): never {
  throw new Error(message);
}
// 2. 死循环
function loopForever(): never {
  while (true) {}
}
// 3. 断言 exhaustive check（穷尽检查）
type Shape1 = 'circle' | 'square';

function getArea(shape: Shape1): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 1 * 1;
    case 'square':
      return 1 * 1;
    default:
      const _exhaustive: never = shape; // ✅ 类型检查保护
      return _exhaustive;
  }
}
