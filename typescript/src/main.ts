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

document.body.innerHTML = getters(user)
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

declare function create(o: object | null): void
create({prop: 0})

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
