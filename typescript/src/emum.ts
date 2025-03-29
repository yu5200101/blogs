
enum Direction {
  // 1
  Up = 1,
  // 2
  Down,
  // 3
  Left,
  // 4
  Right
}
enum Direction {
  Top = 5
}
console.log(Direction.Top)

enum Direction1 {
    // 0
    Up,
    // 1
    Down,
    // 2
    Left,
    // 3
    Right,
}
console.log(Direction1)

enum Response1 {
    No = 0,
    Yes = 1,
}

enum Response2 {
    No = 'no',
    // 必须设置初始值，否则会报错
    // Yes
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