/**
 * @param {string} s
 * @return {number}
 */
const getValue = (n) => {
  const lib = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000,
  }
  return lib[n]
}
var romanToInt = function (s) {
  let sum = 0
  let preNum = getValue(s[0])
  for (let i = 1; i < s.length; i++) {
    let num = getValue(s[i])
    if (preNum < num) {
      sum -= preNum
    } else {
      sum += preNum
    }
    preNum = num
  }
  sum += preNum
  return sum
};