class Student {
  fullName: string;
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = "Your name is " + firstName + middleInitial + lastName
  }
}
interface Person {
  firstName: string,
  lastName: string
}

function getters(person: Person) {
  return "Your name is " + person.firstName + person.lastName
}

let user = new Student("haha", 'xixi', 'hehe')
// 数据类型：
// number, string, null, undefined, object, void, never, any
// 定义数组
// 1.在元素后面接上[]
let list: number[] = [1, 2, 3]
// 2.使用数组泛型 Array<元素类型>
let list1: Array<number> = [1, 2, 3]

let x: [string, number]
x = ['hello', 10]

enum Color {Red = 1, Green, Blue}
let c1: Color = Color.Red

let colorName: string = Color[2]
console.log(colorName)

let notSure: any = 4
notSure = 'haha'
notSure = true
// okay, toFixed exists (but the compiler doesn't check)
// 不校验是否存在此方法
// notSure.toFixed()

// 校验存在此方法
let prettySure: Object = 4
// prettySure.toFixed()

let list2: any[] = [1, '2', true]
list2[1] = 100
console.log(list2)

// document.body.innerHTML = getters(user)
// void 类型没有返回值
function warnUser(): void {
  console.log('object')
}
// 声明void 只能赋值 null和undefined
// let unusable: void = null
// 默认情况下 null和undefined 是所有类型的子类型 就是说你可以把 null和undefined赋值给number类型的变量。
// 但是如果指定--strictNullChecks标记，null和undefined只能赋值给void和它们各自

// never类型表示那些永不存在的值的类型
// 是任何类型的子类型，然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。

// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message)
}

// 推断的返回值类型为never
function fail() {
  return error('something failed')
}

function infiniteLoop(): never {
  while(true){}
}

// declare function create(o: object | null): void
// create({prop: 0})

// 类型断言
let someValue: any = 'this is a something'

let strLength: number = (<string>someValue).length

let strLength1: number = (someValue as string).length

let o1 = {
    a1: "foo",
    b1: 12,
    c1: "bar"
};

let {a1, b1}: {a1: string, b1: number} = o1

interface Point {
  readonly x: number,
  readonly y: number
}

let p12: Point = {x: 1, y: 2}
// p1.x = 3 //报错


let isDone: boolean = false
console.log(isDone)

let [, second, , fourth] = [1, 2, 3, 4];
console.log(second, fourth);

let o = {a: 1, b: 2}
let {a, b, c} : {a: number, b: number, c?: number} = o
console.log(`${c}`);

function keepWholeObject(wholeObject: { a: number, b?: number}) {
    let { a, b = 1001 } = wholeObject
    console.log(a, b)
}
keepWholeObject({ a: 1 })

interface labelValue {
  label: string
}

function printLabel(labelObj: labelValue) {
  console.log(labelObj.label)
}

let myLabel = {age: 8, label: '哈哈'}

printLabel(myLabel)

interface SquareConfig {
  color?: string,
  width?: number
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = {color: "white", area: 100};
  // if (config.clor) {
  //   // Error: Property 'clor' does not exist on type 'SquareConfig'
  //   newSquare.color = config.clor;
  // }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
// let mySquare2 = createSquare({ colour: "red", width: 100 }); // error

// let mySquare3 = createSquare({ width: 100, opacity: 0.5 }) // error
let mySquare4 = createSquare({ width: 100, opacity: 0.5 }  as SquareConfig) // error

// colour 不存在，但是不会检查
let squareOptions = { colour: "red", width: 100 };
let mySquare6 = createSquare(squareOptions);

interface SquareConfig1 {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare1(config: SquareConfig1): { color: string; area: number } {
  let newSquare = {color: "white", area: 100};
  // if (config.clor) {
  //   // Error: Property 'clor' does not exist on type 'SquareConfig'
  //   newSquare.color = config.clor;
  // }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare5 = createSquare1({ width: 100, opacity: 0.5 })

interface Point {
  readonly x: number,
  readonly y: number
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // error!

let ary1: number[] = [1,2,3,4]
let readonlyAry2: ReadonlyArray<number> = ary1

// readonlyAry2[0] = 12; // error!
// readonlyAry2.push(5); // error!
// readonlyAry2.length = 100; // error!
// ary1 = readonlyAry2; // error! 不可重新赋值

// 类型断言重写
ary1 = readonlyAry2 as number[]

// 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
console.log(mySearch('abc', 'c'), 'search')

let mySearch1: SearchFunc;
mySearch1 = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
console.log(mySearch1('abc', 'c'), 'search1')

let mySearch3: SearchFunc;
mySearch3 = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
console.log(mySearch3('abc', 'c'), 'search3')

interface StringArray {
  [index: number]: string
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
// TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。

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

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
// dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.

class Octopus1 {
    private newName: string
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
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

function add(x: number, y: number): number {
    return x + y;
}

// 可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。
let myAdd = function(x: number, y: number): number { return x + y; };

let myAdd1: (x: number, y: number) => number = function(x: number, y: number): number { return x + y}

let myAdd2: (x1: number, y1: number) => number = function(x: number, y: number): number { return x + y }

// myAdd has the full function type
let myAdd3 = function(x: number, y: number): number { return x + y; };

// The parameters `x` and `y` have the type number
let myAdd4: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };

function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

// let result1 = buildName("Bob");                  // error, too few parameters
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");

// 在TypeScript里我们可以在参数名旁使用 ?实现可选参数的功能。 比如，我们想让last name是可选的

function buildName1(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result4 = buildName1("Bob");  // works correctly now
// let result5 = buildName1("Bob", "Adams", "Sr.");  // error, too many parameters
let result6 = buildName1("Bob", "Adams");  // ah, just right

// 可选参数必须跟在必须参数后面。 如果上例我们想让first name是可选的，那么就必须调整它们的位置，把first name放在后面。

function buildName2(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result7 = buildName2("Bob");                  // works correctly now, returns "Bob Smith"
let result8 = buildName2("Bob", undefined);       // still works, also returns "Bob Smith"
// let result9 = buildName2("Bob", "Adams", "Sr.");  // error, too many parameters
let result10 = buildName2("Bob", "Adams");         // ah, just right

// lastName = "Smith" 类似于 lastName?: string

// 与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面

function buildName3(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

// let result11 = buildName3("Bob");                  // error, too few parameters
// let result12 = buildName3("Bob", "Adams", "Sr.");  // error, too many parameters
let result13 = buildName3("Bob", "Adams");         // okay and returns "Bob Adams"
let result14 = buildName3(undefined, "Adams");

function buildName4(firstName: string, ...restOfName: string []) {
  return firstName + " " + restOfName.join(" ");
}
let employeeName = buildName4("Joseph", "Samuel", "Lucas", "MacKinzie");

let buildNameFn: (firstName: string, ...restOfName: string[]) => string = buildName4

let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
// let pickedCard = cardPicker();

// alert("card: " + pickedCard.card + " of " + pickedCard.suit);
// 可以看到createCardPicker是个函数，并且它又返回了一个函数。 如果我们尝试运行这个程序，会发现它并没有弹出对话框而是报错了。 因为 createCardPicker返回的函数里的this被设置成了window而不是deck对象。 因为我们只是独立的调用了 cardPicker()。 顶级的非方法式调用会将 this视为window。 （注意：在严格模式下， this为undefined而不是window）

//  箭头函数能保存函数创建时的 this值，而不是调用时的值
let deck1 = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker1 = deck1.createCardPicker();
let pickedCard1 = cardPicker1();

console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);

// 更好事情是，TypeScript会警告你犯了一个错误，如果你给编译器设置了--noImplicitThis标记。 它会指出 this.suits[pickedSuit]里的this的类型为any。

// this参数是个假的参数，它出现在参数列表的最前面

interface Card1 {
    suit: string;
    card: number;
}
interface Deck1 {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck1): () => Card1;
}
let deck2: Deck1 = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck1) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker2 = deck2.createCardPicker();
let pickedCard2 = cardPicker2();

console.log("card: " + pickedCard2.card + " of " + pickedCard2.suit);
// 现在TypeScript知道createCardPicker期望在某个Deck对象上调用。 也就是说 this是Deck类型的，而非any，因此--noImplicitThis不会报错了。

interface UIElement {
  addClickListener(onClick: (this: void, e: Event) => void) : void
}

class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // oops, used this here. using this callback would crash at runtime
        // this.info = e.message;
    }
}
let h = new Handler();
// uiElement.addClickListener(h.onClickBad); // error!

class Handler1 {
    info: string;
    onClickGood(this: void, e: Event) {
        // can't use this here because it's of type void!
        console.log('clicked!');
    }
}
let h1 = new Handler1();
// UIElement.addClickListener(h1.onClickGood);

class Handler2 {
    info: string;
    // onClickGood = (e: Event) => { this.info = e.message }
}

// let suits = ["hearts", "spades", "clubs", "diamonds"];

// function pickCard(x: {suit: string; card: number; }[]): number;
// function pickCard(x: number): {suit: string; card: number; };
// function pickCard(x): any {
//     // Check to see if we're working with an object/array
//     // if so, they gave us the deck and we'll pick the card
//     if (typeof x == "object") {
//         let pickedCard = Math.floor(Math.random() * x.length);
//         return pickedCard;
//     }
//     // Otherwise just let them pick the card
//     else if (typeof x == "number") {
//         let pickedSuit = Math.floor(x / 13);
//         return { suit: suits[pickedSuit], card: x % 13 };
//     }
// }

// let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
// let pickedCard3 = myDeck[pickCard(myDeck)];
// console.log("card: " + pickedCard3.card + " of " + pickedCard3.suit);

// let pickedCard4 = pickCard(15);
// console.log("card: " + pickedCard4.card + " of " + pickedCard4.suit);

// 定义重载的时候，一定要把最精确的定义放在最前面。
// 注意，function pickCard(x): any并不是重载列表的一部分，因此这里只有两个重载：一个是接收对象另一个接收数字。 以其它参数调用 pickCard会产生错误。

// 会导致传入的类型与返回的类型不一致
function identity(arg: any): any {
    return arg;
}

// 泛型 使传入的类型和返回的类型一致
// 使用了 类型变量，它是一种特殊的变量，只用于表示类型而不是值。
function identity1<T>(arg: T): T {
  return arg
}

let myIdentity1: <T>(arg: T) => T = identity1
let myIdentity2: <U>(arg: U) => U = identity1
let myIdentity3: {<T>(arg: T) : T} = identity1

let output = identity1<string>('HAHAH')
console.log(output)

// 类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：

let output1 = identity1(12)
console.log(output1)
// 没必要使用尖括号（<>）来明确地传入类型,在一些复杂的情况下，这是可能出现的 此时需要使用<>

function loggingIdentity<T>(arg: T): T {
    // 类型变量代表的是任意类型，所以使用这个函数的人可能传入的是个数字，而数字是没有 .length属性的
    // console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

// 接收类型参数T和参数arg，它是个元素类型是T的数组，并返回元素类型是T的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number
function loggingIdentity1<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}

// T[] => Array<T>

interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity2<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity2;

interface GenericIdentityFn1<T> {
    (arg: T): T;
}

function identity3<T>(arg: T): T {
    return arg;
}

let myIdentity4: GenericIdentityFn1<number> = identity3;

class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
console.log(myGenericNumber.add(myGenericNumber.zeroValue, 1));


let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
// 类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

interface Lengthwise {
    length: number;
}

function loggingIdentity2<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

// loggingIdentity2(3);  // Error, number doesn't have a .length property
console.log(loggingIdentity2({length: 10, value: 3}))
console.log(loggingIdentity2([1, 2, 3]))

function create1<T>(c: {
  new() : T
}) : T {
  return new c()
}

class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nameTag: string;
}

class Animal7{
    numLegs: number;
}

class Bee extends Animal7 {
    keeper: BeeKeeper;
}

class Lion extends Animal7 {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal7>(c: new () => A): A {
    return new c();
}

// typeof createInstance(Lion).keeper.nameTag;  // typechecks!
// typeof createInstance(Bee).keeper.hasMask;   // typechecks!

enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
console.log(Direction)

enum Direction1 {
    Up,
    Down,
    Left,
    Right,
}
console.log(Direction1)

enum Response1 {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Response1): void {
    // ...
}

respond("Princess Caroline", Response1.Yes)

enum E2 {
    A = 1, B, C
}
console.log(E2)

enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
console.log(FileAccess)

enum E {
    Foo,
    Bar,
}

function f(x: E) {
    // if (x !== E.Foo || x !== E.Bar) {
    //     //             ~~~~~~~~~~~
    //     // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
    // }
}
// 我们先检查 x是否不是 E.Foo。 如果通过了这个检查，然后 ||会发生短路效果， if语句体里的内容会被执行。 然而，这个检查没有通过，那么 x则 只能为 E.Foo，因此没理由再去检查它是否为 E.Bar。

enum E1 {
    X, Y, Z
}

function f1(obj: { X: number }) {
    return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
console.log(f1(E1))

enum Enum {
    A
}
let a2 = Enum.A;
let nameOfA = Enum[a2]; // "A"
// 字符串枚举成员不会生成反向映射。

const enum Enum1 {
    A = 1,
    B = A * 3
}
// error
// console.log(Enum1);
console.log(Enum1.B);

// 外部枚举用来描述已经存在的枚举类型的形状
// declare enum Enum1{
//     A = 1,
//     B,
//     C = 2
// }
// console.log(Enum1)

interface Named {
    name: string;
}

let x1: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x1 = y;
console.log(x1);

let x2 = (a: number) => 0;
let y2 = (b: number, s: string) => 0;

// 函数参数类型只能是少的复制给多的函数
// x2的每个参数必须能在y2里找到对应类型的参数
y2 = x2; // OK
// y2有个必需的第二个参数，但是x2并没有，所以不允许赋值
// x2 = y2; // Error

// 返回值类型 只能多赋值给少的
let x3 = () => ({name: 'Alice'});
let y3 = () => ({name: 'Alice', location: 'Seattle'});

x3 = y3; // OK
// y3 = x3; // Error, because x() lacks a location property

enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x1: number; y1: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x1 + ',' + e.y1));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x1 + ',' + (<MouseEvent>e).y1));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x1 + ',' + e.y1)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
// listenEvent(EventType.Mouse, (e: number) => console.log(e));

function invokeLater(args: any[], callback: (...args: any[]) => void) {
  console.log(args);
  callback && callback(...args)
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([3, 4], (x?, y?) => console.log(x + '+' + y));

// 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的
enum Status { Ready, Waiting };
enum Color1 { Red, Blue, Green };

let status1 = Status.Ready;
// status = Color.Green;  // Error

// 类有静态部分和实例部分的类型。 比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内。
class Animal8 {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a7: Animal8;
let s7: Size;

// a7 = s7;  // OK
// s2= a7;  // OK

interface Empty<T> {
}
let x8: Empty<number>;
let y8: Empty<string>;

// x8 = y8;  // OK, because y matches structure of x

interface NotEmpty<T> {
    data: T;
}
let x10: NotEmpty<number>;
let y10: NotEmpty<string>;

// x10 = y10;  // Error, because x and y are not compatible

// for..in迭代的是对象的 键 的列表，而for..of则迭代对象的键对应的值。

// interface StringValidator {
//     isAcceptable(s: string): boolean;
// }

// let lettersRegexp = /^[A-Za-z]+$/;
// let numberRegexp = /^[0-9]+$/;

// class LettersOnlyValidator implements StringValidator {
//     isAcceptable(s: string) {
//         return lettersRegexp.test(s);
//     }
// }

// class ZipCodeValidator implements StringValidator {
//     isAcceptable(s: string) {
//         return s.length === 5 && numberRegexp.test(s);
//     }
// }

// // Some samples to try
// let strings = ["Hello", "98052", "101"];

// // Validators to use
// let validators: { [s: string]: StringValidator; } = {};
// validators["ZIP code"] = new ZipCodeValidator();
// validators["Letters only"] = new LettersOnlyValidator();

// // Show whether each string passed each validator
// for (let s of strings) {
//     for (let name in validators) {
//         let isMatch = validators[name].isAcceptable(s);
//         console.log(`'${ s }' ${ isMatch ? "matches" : "does not match" } '${ name }'.`);
//     }
// }

// namespace Validation {
//     export interface StringValidator {
//         isAcceptable(s: string): boolean;
//     }

//     const lettersRegexp = /^[A-Za-z]+$/;
//     const numberRegexp = /^[0-9]+$/;

//     export class LettersOnlyValidator implements StringValidator {
//         isAcceptable(s: string) {
//             return lettersRegexp.test(s);
//         }
//     }

//     export class ZipCodeValidator implements StringValidator {
//         isAcceptable(s: string) {
//             return s.length === 5 && numberRegexp.test(s);
//         }
//     }
// }

// validators["ZIP code"] = new Validation.ZipCodeValidator();
// validators["Letters only"] = new Validation.LettersOnlyValidator();

// // Show whether each string passed each validator
// for (let s of strings) {
//     for (let name in validators) {
//         console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
//     }
// }
/// <reference path="Test.ts" />

// 不应该对模块使用命名空间，使用命名空间是为了提供逻辑分组和避免命名冲突。 模块文件本身已经是一个逻辑分组，并且它的名字是由导入这个模块的代码指定，所以没有必要为导出的对象增加额外的模块层。


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

console.log(new Greeter1("world"));

class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x1() { return this._x; }

    @configurable(false)
    get y1() { return this._y; }
}

function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}

// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject implements Disposable, Activatable {
    constructor() {
        // setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
        console.log(1)
    }

    interact() {
        this.activate();
    }

    // Disposable
    isDisposed: boolean = false;
    dispose: () => void;
    // Activatable
    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
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

interface Counter{
  (start: number): string,
  interval: string,
  reset(): void
}