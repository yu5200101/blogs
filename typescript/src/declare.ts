// declare —— 类型声明而不实现（通常用于声明全局变量、模块、类型）

// 示例 1：声明全局变量（不定义，只有类型）
declare const jQuery: (selector: string) => any;

// 使用时不会报错
jQuery("#app");

// 示例 2：声明模块（比如 JS 文件）
// my-lib.d.ts
declare module "my-lib" {
  export function doSomething(): void;
}

// 示例 3：声明类接口
declare class SomeClass {
  constructor(name: string);
  sayHello(): void;
}
