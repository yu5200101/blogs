
/**
 * @param {string[]} strs
 * @return {string}
 */
const lcp = (str1, str2) => {
  const len = Math.min(str1.length, str2.length)
  let index = 0
  for (i = 0; i < len; i++) {
    if (str1[i] !== str2[i]) {
      break
    }
    index++
  }
  return str1.slice(0, index)
}
var longestCommonPrefix = function (strs) {
  if (!strs.length) return ''
  if (strs.length === 1) return strs[0]
  let result = strs[0]
  for (let i = 1; i < strs.length; i++) {
    result = lcp(result, strs[i])
    if (!result.length) return ''
  }
  return result
};