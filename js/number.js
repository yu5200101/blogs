function add (num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const digits = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (num1 * digits + num2 * digits) / digits
}

console.log(add(1.2, 3.5))

const big = require('big.js')

const x = new big('7833234432148321')
const y = new big('7385135793214325')

const result = x.plus(y)
console.log(result.toString())

const bigNum1 = 7833234432148321n
const bigNum2 = 7385135793214325n

console.log(bigNum1 + bigNum2)