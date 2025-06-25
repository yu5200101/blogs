const { Buffer } = require('node:buffer');

// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10,
// filled with bytes which all have the value `1`.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using fill(), write(), or other functions that fill the Buffer's
// contents.
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing the bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing the bytes [1, 1, 1, 1] – the entries
// are all truncated using `(value & 255)` to fit into the range 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Creates a Buffer containing the UTF-8-encoded bytes for the string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadecimal notation)
// [116, 195, 169, 115, 116] (in decimal notation)
const buf6 = Buffer.from('tést');

// Creates a Buffer containing the Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');

console.log(buf1, buf2, buf3, buf4, buf5, buf6, buf7)

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf8 = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf8[i] = str.charCodeAt(i);
}

console.log(buf8.toString('utf8'));
// Prints: Node.js\

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));

const buf9 = Buffer.from('this is a buffer');

console.log(buf9.indexOf('this'));
// Prints: 0
console.log(buf9.indexOf('is'));
// Prints: 2
console.log(buf9.lastIndexOf('buffer', 10));
// Prints: 10
console.log(buf9.lastIndexOf('buffer', 9));
// Prints: -1

const buf10 = Buffer.from([0, 0, 0, 0, 0, 0, 1, 2]);
// [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02]
// 1*16^2 + 2 = 258
console.log(buf10.readBigInt64BE(0))
// Prints: 258n
console.log(buf10.readBigUInt64BE(0))
// Prints: 258n
const buf11 = Buffer.from([1, 2, 0, 0, 0, 0, 0, 0]);
// [0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
// 1 + 2 * 16^2 = 513
console.log(buf11.readBigInt64LE(0))
// Prints: 513n
console.log(buf11.readBigUInt64LE(0))
// Prints: 513n

const buf12 = Buffer.from([
  0x00, 0x00, // 无关数据
  0x40, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 双精度数 10.0
  0xFF
]);
// 01000000 00100100 00000000 00000000 00000000 00000000 00000000 00000000
// s:0 e: 1000000 0010 m:0100 00000000
// 1位符号位s 11位指数位e 52位尾数位m
// 计算公式：(-1)^s * (1 + m) * 2^(e - 1023)
// (-1)^0 * (1 + 2^(-2)) * 2^(2^10 + 2^1 - 1023) = 10
// 从偏移量 2 开始读取 8 个字节
console.log(buf12.readDoubleBE(2))
// 10
const buf13 = Buffer.from([
  0x00, 0x00, // 无关数据
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x24, 0x40,
  0xFF
]);

// 反转后
// [0x40, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
console.log(buf13.readDoubleLE(2))

// 假设接收到的二进制数据（大端序浮点数的字节序列）
const buf14 = Buffer.from([0x40, 0x24, 0x00, 0x00]);
// 01000000 00100100 00000000 00000000
// 1位符号位（S），8位指数位（E），23位尾数位（M）
// S:0 E:1000000 0 M:0100100 00000000 00000000
// 计算公式：(-1)^s * (1 + m) * 2^(e - 127)
// (-1)^0 * (1 + 2^(-2) + 2^(-5)) * 2^(2^7 - 127) = 2.5625
// 读取大端序浮点数
console.log(buf14.readFloatBE(0))

const buf15 = Buffer.from([0x00, 0x00, 0x24, 0x40]);
// 反转后
// [0x40, 0x24, 0x00, 0x00]
console.log(buf15.readFloatLE(0))

const buf16 = Buffer.from([0, 5])
console.log(buf16.readInt16BE(0))
// Prints: 5

// 5*16^2 = 1280
console.log(buf16.readInt16LE(0))
// Prints: 1280

const buf17 = Buffer.from([0x00, 0x00, 0x24, 0x40])
// 2*16^3+4*16^2+4*16 = 9280
console.log(buf17.readIntBE(0, 4))
// Prints: 9280

// 2*16 + 4 = 36
console.log(buf17.readIntBE(1, 2))
// Prints: 36

const buf18 = Buffer.from([0x40, 0x24, 0x00, 0x00])
// 翻转后[0x00, 0x00, 0x24, 0x40]
console.log(buf18.readIntLE(0, 4))

const buf19 = Buffer.from([1, -2]);

console.log(buf19.readUInt8(0));
// Prints: 1

// -2+256 = 254
console.log(buf19.readUInt8(1));
// Prints: 254


