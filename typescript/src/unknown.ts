// unknown —— 安全的任意类型（类型不确定但受限）
let value: unknown;

value = 123;
value = 'hello';
value = { x: true };

// ❌ 不能直接使用
// value.toUpperCase(); // 报错

// ✅ 必须进行类型判断
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}

