

// 类装饰
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
  return class extends constructor {
      newProperty = "new property";
      hello = "override";
  }
}

@classDecorator
class Greeter1 {
  property = "property";
  hello: string;
  constructor(m: string) {
      this.hello = m;
  }
}
// 等同于 Greeter1 = classDecorator(function Greeter1() {...})
console.log(new Greeter1("world"));
// 打印{property: 'property', hello: 'override', newProperty: 'new property'}

// 属性装饰
function property(target: any, properKey: string) {
  console.log('property-target', target);
  console.log('property-properKey', properKey);
}

// 方法装饰&访问器装饰
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('configurable-target', target);
    console.log('configurable-propertyKey', propertyKey);
    console.log('configurable-descriptor', descriptor);
    descriptor.configurable = value;
  };
}

// 参数装饰
function logParams(target: any, propertyKey: string, index: number) {
  console.log('logParams-target', target);
  console.log('logParams-propertyKey', propertyKey);
  console.log('logParams-index', index);
}

// 工厂函数
function addAge(age: number) {
  return function(constructor: Function) {
    constructor.prototype.age = age
  }
}

function enumerable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('enumerable-target', target);
    console.log('enumerable-propertyKey', propertyKey);
    console.log('enumerable-index', descriptor);
    descriptor.configurable = value;
  }
}
@addAge(10)
class Point {
  private _x: number;
  public age!: number;
  @property
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  getX() { return this._x; }

  @configurable(true)
  get getY() { return this._y; }

  getOther(@logParams yes: string, @logParams no: string) {
    return `logParams-${yes} or ${no}`
  }

  @enumerable(false)
  @configurable(false)
  public getAge() {
    return this.age
  }
}

const point = new Point(1, 2)
console.log('point.getX', point.getX())
console.log('point.getOther', point.getOther('yes', 'no'))
console.log('point.getY', point.getY)
console.log('point.age', point.age)
console.log('point.getAge', point.getAge())