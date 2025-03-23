function add (num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const digits = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (num1 * digits + num2 * digits) / digits
}

console.log(add(1.2, 3.5))