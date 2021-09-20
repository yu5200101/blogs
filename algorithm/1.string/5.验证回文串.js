/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  const newS = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  for (let i = 0; i < newS.length; i++) {
    if (newS[i] !== newS[newS.length - i - 1]) {
      return false
    }
  }
  return true
};