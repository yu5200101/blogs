/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function (n) {
  if (n === 1) return '1'
  let result = ''
  let lastStr = countAndSay(n - 1)
  let lastNum = lastStr[0]
  let countNum = 0
  for (let i = 0; i < lastStr.length; i++) {
    if (lastStr[i] === lastNum) {
      countNum++
    } else {
      result += `${countNum}${lastNum}`
      lastNum = lastStr[i]
      countNum = 1
    }
    if (i === lastStr.length - 1) {
      result += `${countNum}${lastNum}`
    }
  }
  return result
};