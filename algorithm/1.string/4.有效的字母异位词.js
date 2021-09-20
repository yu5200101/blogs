/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) return false
  const ary = new Array(26).fill(0)
  for (let i = 0; i < s.length; i++) {
    ary[s[i].charCodeAt() - 'a'.charCodeAt()]++
  }
  for (let i = 0; i < t.length; i++) {
    ary[t[i].charCodeAt() - 'a'.charCodeAt()]--
    if (ary[t[i].charCodeAt() - 'a'.charCodeAt()] < 0) {
      return false
    }
  }
  return true
};