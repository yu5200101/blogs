/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
  if (numRows === 1) return s
  // 把多少个分成一组
  let temp = numRows * 2 - 2
  let newStr = new Array(numRows).fill('')
  for (let i = 0; i < s.length; i++) {
    const mo = i % temp
    if (mo < numRows) {
      newStr[mo] += s[i]
    } else {
      newStr[temp - mo] += s[i]
    }
  }
  let res = ''
  for (let i = 0; i < numRows; i++) {
    res += newStr[i]
  }
  return res
};