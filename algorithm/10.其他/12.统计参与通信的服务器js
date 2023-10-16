/*
这里有一幅服务器分布图，服务器的位置标识在 m * n 的整数矩阵网格 grid 中，1 表示单元格上有服务器，0 表示没有。

如果两台服务器位于同一行或者同一列，我们就认为它们之间可以进行通信。

请你统计并返回能够与至少一台其他服务器进行通信的服务器的数量。
*/
/**
 * @param {number[][]} grid
 * @return {number}
 */
var countServers = function(grid) {
  const m = grid.length
  const n = grid[0].length
  const row = new Map()
  const col = new Map()
  for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
          if (grid[i][j] === 1) {
              row.set(i, (row.get(i) || 0) + 1)
              col.set(j, (col.get(j) || 0) + 1)
          }
      }
  }
  let result = 0
  for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
          if (grid[i][j] === 1 && (row.get(i) > 1 || col.get(j) > 1)) {
              result++
          }
      }
  }
  return result
};