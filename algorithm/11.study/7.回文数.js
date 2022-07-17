/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false
  let old = x
  let res = 0
  while (old) {
    const digit = old % 10
    res = res * 10 + digit
    old = ~~(old / 10)
  }
  return res === x
};