/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  if (n <= 2) {
    return n
  }
  let sum = 0
  let first = 1
  let second = 2
  while (n-- > 2) {
    sum = first + second
    first = second
    second = sum
  }
  return sum
};