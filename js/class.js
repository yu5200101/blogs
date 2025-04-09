class MyClass {
  name = 'name'
  static staticProperty = '这是一个静态属性'; // 公有静态属性
  static #privateStaticProperty = '私有静态属性'; // 私有静态属性（ES2022）

  static staticMethod() {
    console.log(this.#privateStaticProperty); // '私有静态属性'
    console.log(this.staticProperty);
    console.log(MyClass.staticProperty);
  }
}
const myClass1 = new MyClass()
// undefined
console.log(myClass1.staticProperty);
// name
console.log(myClass1.name);
// 使用
console.log(MyClass.staticProperty); // '这是一个静态属性'
MyClass.staticMethod();              // '这是一个静态属性'