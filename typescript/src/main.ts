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

// let p12: Point = {x: 1, y: 2}
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

// let p1: Point = { x: 10, y: 20 };
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
// 不应该对模块使用命名空间，使用命名空间是为了提供逻辑分组和避免命名冲突。 模块文件本身已经是一个逻辑分组，并且它的名字是由导入这个模块的代码指定，所以没有必要为导出的对象增加额外的模块层。
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