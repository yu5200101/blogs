function add (num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const digits = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (num1 * digits + num2 * digits) / digits
}

console.log(add(1.2, 3.5))

// const big = require('big.js')

// const x = new big('7833234432148321')
// const y = new big('7385135793214325')

// const result = x.plus(y)
// console.log(result.toString())

const bigNum1 = 7833234432148321n
const bigNum2 = 7385135793214325n

console.log(bigNum1 + bigNum2)

// 大数相加
function addBigNumbers(num1, num2) {
  let curry = 0
  let num1Index = num1.length - 1
  let num2Index = num2.length - 1
  const result = []
  while(num1Index >= 0 || num2Index >= 0 || curry >= 1) {
    const digit1 = num1Index >= 0 ? parseInt(num1[num1Index], 10) : 0
    const digit2 = num2Index >= 0 ? parseInt(num2[num2Index], 10) : 0
    const sum = digit1 + digit2 + curry
    result.unshift(sum % 10)
    curry = Math.floor(sum / 10)
    num1Index--
    num2Index--
  }
  let str = result.join('')
  str = str.replace(/^0+/, '') || '0'
  return str === '' ? '0' : str
}

console.log(addBigNumbers('8394723321432958', '389837184832718078'))