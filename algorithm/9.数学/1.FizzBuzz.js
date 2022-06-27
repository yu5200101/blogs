/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function (n) {
  let ary = []
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      ary[i - 1] = 'FizzBuzz'
      continue
    }
    if (i % 3 === 0) {
      ary[i - 1] = 'Fizz'
      continue
    }
    if (i % 5 === 0) {
      ary[i - 1] = 'Buzz'
      continue
    }
    ary[i - 1] = `${i}`
  }
  return ary
};