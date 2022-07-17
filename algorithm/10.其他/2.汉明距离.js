/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function (x, y) {
  let res = x ^ y
  let total = 0
  while (res) {
    total++
    res &= res - 1
  }
  return total
};