
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