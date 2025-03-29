
class Activatable {
  isActive: boolean = false;
  activate() {
      this.isActive = true;
  }
  deactivate() {
      this.isActive = false;
  }
}

// 混入辅助函数
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
          Object.defineProperty(
              derivedCtor.prototype,
              name,
              Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
              Object.create(null)
          );
      });
  });
}

// 修正后的完整代码
class Disposable {
  isDisposed: boolean = false;
  dispose() {
      this.isDisposed = true;
  }
}
class SmartObject implements Disposable, Activatable {
  // Disposable 属性（必须显式声明）
  isDisposed: boolean = false;
  dispose!: () => void;
  // Activatable 属性（必须显式声明）
  isActive: boolean = false;
  activate!: () => void;
  deactivate!: () => void;
  // 可覆盖父类方法
  [Symbol.dispose]() {
    console.log('Custom disposal logic');
  }

  constructor() {
      console.log('SmartObject created');
  }

  interact() {
      this.activate();
  }
}

// 应用混入
applyMixins(SmartObject, [Disposable, Activatable]);

// 测试
const obj = new SmartObject();
obj.activate();
console.log(obj.isActive); // true
obj.dispose();
console.log(obj.isDisposed); // true