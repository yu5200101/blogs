
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
  // error
  // [x: number]: Animal;
  [x: string]: Dog;
}

interface NumberDictionary {
[index: string]: number;
length: number;    // 可以，length是number类型
// 错误，`name`的类型与索引类型返回值的类型不匹配
// name: string
}

interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray1: ReadonlyStringArray = ["Alice", "Bob"];
// error!
// myArray1[2] = "Mallory";

interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): any
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number) { }
}

interface ClockConstructor1 {
  new (hour: number, minute: number): any
}

// class Clock1 implements ClockConstructor1 {
//     currentTime: Date;
//     constructor(h: number, m: number) { }
// }
// 这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。


// 因此，我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， ClockConstructor为构造函数所用和ClockInterface为实例方法所用。 为了方便我们定义一个构造函数 createClock，它用传入的类型创建实例。

// 为构造函数所用
interface ClockConstructor2 {
  new (hour: number, minute: number): ClockInterface2;
}
// 为实例方法所用
interface ClockInterface2 {
  tick(): any;
}

function createClock(ctor: ClockConstructor2, hour: number, minute: number): ClockInterface2 {
  return new ctor(hour, minute);
}
class DigitalClock implements ClockInterface2 {
  constructor(h: number, m: number) {
    console.log(h, m)
  }
  tick() {
      console.log("beep beep")
  }
}
class AnalogClock implements ClockInterface2 {
  constructor(h: number, m: number) {
    console.log(h, m)
  }
  tick() {
      console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
digital.tick()
let analog = createClock(AnalogClock, 7, 32);
analog.tick()

interface Counter {
(start: number): string
interval: number
reset(): void
}

function getCounter(): Counter {
let counter = <Counter> function (start: number) {}
counter.interval = 10
counter.reset = function () {}
return counter
}

let counter1 = getCounter()
counter1(10)
counter1.interval - 5
counter1.reset()

// 当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() { }
}

class TextBox extends Control {
  select() { }
}

// 错误：“Image”类型缺少“state”属性。
// class Image implements SelectableControl {
//     select() { }
// }

class Greeter {
greetering: string
constructor(message: string) {
  this.greetering = message
}
greet() {
  return 'hello' + this.greetering
}
}

let greeter = new Greeter('greeter1')

class Animal1 {
  move(distanceInMeters: number = 0) {
      console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog1 extends Animal1 {
  bark() {
      console.log('Woof! Woof!');
  }
}

const dog = new Dog1();
dog.bark();
dog.move(10);
dog.bark();

class Animal2 {
  name: string;
  constructor(theName: string) { this.name = theName; }
  move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Animal3 {
  public name: string;
  public constructor(theName: string) { this.name = theName; }
  public move(distanceInMeters: number) {
      console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Animal4 {
  private name: string;
  constructor(theName: string) { this.name = theName; }
}

// new Animal4("Cat").name; // 错误: 'name' 是私有的.
class Snake extends Animal3 {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 5) {
      console.log("Slithering...");
      super.move(distanceInMeters);
  }
}

class Horse extends Animal3 {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 45) {
      console.log("Galloping...");
      super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal3 = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);

// 派生类包含了一个构造函数，它 必须调用 super()，它会执行基类的构造函数。 而且，在构造函数里访问 this的属性之前，我们 一定要调用 super()。 这个是TypeScript强制执行的一条重要规则。

// 这个例子演示了如何在子类里可以重写父类的方法。 Snake类和 Horse类都创建了 move方法，它们重写了从 Animal继承来的 move方法，使得 move方法根据不同的类而具有不同的功能。 注意，即使 tom被声明为 Animal类型，但因为它的值是 Horse，调用 tom.move(34)时，它会调用 Horse里重写

class Animal5 {
  private name: string;
  constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal5 {
  private departName: string;
  constructor(theName: string) {
    super(theName);
    // error name 是私有的 被继承时不能使用
    // this.departName = this.name
  }
}

class Employee {
  private name: string;
  constructor(theName: string) { this.name = theName; }
}

let animal = new Animal5("Goat");
let rhino = new Rhino('ddddd');
// error rhino 这个类型下面 name是私有的 不能使用
// console.log(rhino.name, 'rhino')
let employee = new Employee("Bob");

// animal = rhino;
// animal = employee; // 错误: Animal 与 Employee 不兼容.

// 这个例子中有 Animal和 Rhino两个类， Rhino是 Animal类的子类。 还有一个 Employee类，其类型看上去与 Animal是相同的。 我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 因为 Animal和 Rhino共享了来自 Animal里的私有成员定义 private name: string，因此它们是兼容的。 然而 Employee却不是这样。当把 Employee赋值给 Animal的时候，得到一个错误，说它们的类型不兼容。 尽管 Employee里也有一个私有成员 name，但它明显不是 Animal里面定义的那个。

class Person {
  protected name: string;
  constructor(name: string) { this.name = name; }
}

class Employee1 extends Person {
  private department: string;

  constructor(name: string, department: string) {
      super(name)
      this.department = department;
  }

  public getElevatorPitch() {
    // 派生类中可以访问 protected属性
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee1("Howard", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name); // 错误

class Person1 {
  protected name: string;
  protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee2 extends Person1 {
  private department: string;

  constructor(name: string, department: string) {
      super(name);
      this.department = department;
  }

  public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard1 = new Employee2("Howard", "Sales");
// let john = new Person1("John"); // 错误: 'Person' 的构造函数是被保护的.


// private 私有的 被继承时不能使用 实例化时不能使用
// protected 受保护的 被继承时能使用 实例化时不能使用

class Person2 {
  protected name: string;
  // 构造函数也能被保护，但是不能在实例化时使用
  protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee3 extends Person2 {
  private department: string;

  constructor(name: string, department: string) {
      super(name);
      this.department = department;
  }

  public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard3 = new Employee3("Howard", "Sales");
// let john = new Person2("John"); // 错误: 'Person' 的构造函数是被保护的.


interface Shape {
  color: string;
}
interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{}
square.color = "blue";
square.sideLength = 10;
console.log(square)

interface PenStroke {
  penWidth: number;
}

interface Square1 extends Shape, PenStroke {
  sideLength: number;
}

let square1 = <Square1>{};
square1.color = "blue";
square1.sideLength = 10;
square1.penWidth = 5.0;
console.log(square1)