// any —— 任意类型（关闭类型检查）
let foo: any;

foo = 123;
foo = 'hello';
foo = { x: true };

foo.toUpperCase(); // ✅ 不报错，即使 foo 不是 string
