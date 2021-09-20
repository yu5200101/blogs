/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  s = s.trim()
  if (!s.length) return 0
  let res = 0
  let index = 0
  let flag = 1
  if (['-', '+'].includes(s[index])) {
    flag = s[index++] === '-' ? -1 : 1
  }
  const max = Math.pow(2, 31) - 1
  const min = -Math.pow(2, 31)
  for (; index < s.length; index++) {
    const digit = s[index]
    if (!/\d/g.test(digit)) {
      break
    }
    res = res * 10 + +digit
  }
  res *= flag
  if (res < min) {
    res = min
  }
  if (res > max) {
    res = max
  }
  return res
};
