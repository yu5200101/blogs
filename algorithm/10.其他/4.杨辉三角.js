/**
 * @param {number} numRows
 * @return {number[][]}
 */
 var generate = function(numRows) {
  const res = []
  for (let i = 0; i < numRows; i++) {
      const cur = new Array(i + 1).fill(1)
      for (let j = 1; j < cur.length - 1; j++) {
          cur[j] = res[i - 1][j - 1] + res[i - 1][j]
      }
      res.push(cur)
  }
  return res
};