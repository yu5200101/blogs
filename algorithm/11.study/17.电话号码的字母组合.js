/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  if (!digits) return []
  const str = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
  const res = []
  const dfs = (path, digits) => {
    if (path.length === digits.length) {
      res.push(path)
      return
    }
    const curNum = digits[path.length]
    const curStr = str[curNum]
    for (let i = 0; i < curStr.length; i++) {
      path += curStr[i]
      dfs(path, digits)
      path = path.slice(0, path.length - 1)
    }
  }
  dfs('', digits)
  return res
};