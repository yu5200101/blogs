/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const len = matrix.length
  for (let i = 0; i < len / 2; i++) {
    for (let j = i; j < len - i - 1; j++) {
      const temp = matrix[i][j]
      const m = len - j - 1
      const n = len - i - 1
      matrix[i][j] = matrix[m][i]
      matrix[m][i] = matrix[n][m]
      matrix[n][m] = matrix[j][n]
      matrix[j][n] = temp
    }
  }
};