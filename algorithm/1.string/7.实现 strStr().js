/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
const nextFn = (needle) => {
  const neLen = needle.length
  const next = new Array(neLen)
  next[0] = -1
  let k = -1
  for (let i = 1; i < neLen; i++) {
    while (k !== -1 && needle[k + 1] !== needle[i]) {
      k = next[k]
    }
    if (needle[k + 1] === needle[i]) {
      k++
    }
    next[i] = k
  }
  return next
}
const kmp = (haystack, needle) => {
  const haLen = haystack.length
  const neLen = needle.length
  const next = nextFn(needle)
  let j = 0
  for (i = 0; i < haLen; i++) {
    while (j > 0 && haystack[i] !== needle[j]) {
      j = next[j - 1] + 1
      if (neLen + i - j > haLen) {
        return -1
      }
    }
    if (haystack[i] === needle[j]) {
      j++
    }
    if (j === neLen) {
      return i - neLen + 1
    }
  }
  return -1
}
var strStr = function (haystack, needle) {
  if (!needle.length) return 0
  if (!haystack.length) return -1
  return kmp(haystack, needle)
};