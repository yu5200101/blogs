/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  const list = []
  const helper = (path, leftCount, rightCount) => {
    if (path.length === n * 2) {
      list.push(path)
      return
    }
    if (leftCount < n) {
      helper(path + '(', leftCount + 1, rightCount)
    }
    if (rightCount < leftCount) {
      helper(path + ')', leftCount, rightCount + 1)
    }
  }
  helper('', 0, 0)
  return list
};
