/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
  let sLen = s.length + 1
  let pLen = p.length + 1
  let table = new Array(sLen)
  for (let j = 0; j < sLen; j++) {
    table[j] = new Array(pLen).fill(false)
  }
  table[0][0] = true
  // 设置第0行所有列的值
  for (let j = 1; j < pLen; j++) {
    let col = p[j - 1]
    if (j > 1) {
      if (col === '*') {
        table[0][j] = table[0][j - 2]
      } else {
        table[0][j] = false
      }
    } else {
      if (col === '*') {
        table[0][j] = true
      }
    }
  }
  for (let i = 1; i < sLen; i++) {
    const row = s[i - 1]
    for (let j = 1; j < pLen; j++) {
      const col = p[j - 1]
      if (row === col || col === '.') {
        table[i][j] = table[i - 1][j - 1]
        console.log(table[i][j])
      } else if (col === '*' && j > 1) {
        if (table[i][j - 2]) {
          table[i][j] = true
        } else {
          const prev = p[j - 2]
          if (row === prev || prev === '.') {
            table[i][j] = table[i - 1][j]
          }
        }
      }
    }
  }
  return table[s.length][p.length]
};
console.log(isMatch('aa', 'a'))