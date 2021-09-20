/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  let res = 0
  while (x !== 0) {
    const digit = x % 10
    res = res * 10 + digit
    x = ~~(x / 10)
    if (res > Math.pow(2, 31) - 1 || res < Math.pow(-2, 31)) {
      return 0
    }
  }
  return res
};