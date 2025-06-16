// private 只能在类内部使用
// static 只能使用类型.xx使用
// protected 可以在类和子类内部使用
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  protected age: number = 10
  constructor (theName: string) {
      this.name = theName;
  }
}
let dad = new Octopus("Man with the 8 strong legs");
// dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.

class Octopus1 extends Octopus {
  private newName: string
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {
    super(name)
    console.log(this.age)
    this.newName = name
    console.log(this.newName);
  }
}
let octopus1 = new Octopus1('哈哈')


class Employee4 {
  private _fullName: string;
  private passCode: string

  constructor(passCode: string) {
    this.passCode = passCode
  }
  get fullName(): string {
      return this._fullName;
  }

  set fullName(newName: string) {
      if (this.passCode && this.passCode == "secret passcode") {
          this._fullName = newName;
          console.log(this._fullName, '_fullName')
      }
      else {
          console.log("Error: Unauthorized update of employee!");
      }
  }
}

// let employee4 = new Employee4('secret passcode');
let employee4 = new Employee4('secret passcode1');
employee4.fullName = "Bob Smith";

class Grid {
  // 加上static 静态属性时 只能使用Grid.origin使用
  static origin = {x: 0, y: 0};
  calculateDistanceFromOrigin(point: {x: number; y: number;}) {
      let xDist = (point.x - Grid.origin.x);
      let yDist = (point.y - Grid.origin.y);
      return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

// 抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法。
abstract class Animal6 {
  abstract makeSound(): void;
  move(): void {
      console.log('roaming the earch...');
  }
}

abstract class Department {

  constructor(public name: string) {
  }

  printName(): void {
      console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

  constructor() {
      super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
      console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
      console.log('Generating accounting reports...');
  }
}

// let department: Department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
let department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
// 如果 定义了 department: Department 错误: 方法在声明的抽象类中不存在
// 如果没有以上定义 则可以使用
department.generateReports();

class Greeter2 {
  greeting: string;
  constructor(message: string) {
      this.greeting = message;
  }
  greet() {
      return "Hello, " + this.greeting;
  }
}

let greeter2: Greeter2;
greeter2 = new Greeter2("world");
console.log(greeter2.greet());

class Greeter3 {
  static standardGreeting = "Hello, theres";
  greeting: string;
  greet() {
      if (this.greeting) {
          return "Hello, " + this.greeting;
      }
      else {
          return Greeter3.standardGreeting;
      }
  }
}

// 取Greeter3实例的类型给greeter4
let greeter4: Greeter3;
greeter4 = new Greeter3();
console.log(greeter4.greet());

// 取Greeter3类的类型给greeterMaker 这个类型包含了类的所有静态成员和构造函数
let greeterMaker: typeof Greeter3 = Greeter3;
greeterMaker.standardGreeting = "Hey there!";

let greeter5: Greeter3 = new greeterMaker();
console.log(greeter5.greet());

// 类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

class Point2 {
  x: number;
  y: number;
}

interface Point3d extends Point2 {
  z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};

// override —— 显式覆盖父类方法（TypeScript 4.3+）
// 表示明确在子类中重写父类的方法/属性
// 如果父类中没有这个方法/属性，TS 会报错（防止拼写错误）

class Base {
  greet() {
    console.log("Hello from base");
  }
}

class Derived extends Base {
  override greet() {
    console.log("Hello from derived");
  }

  // override sayHi() {} // ❌ 报错：Base 没有 sayHi 方法
}
