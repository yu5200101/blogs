// 假设说，你们部门70%的人喜欢打篮球，80%的人喜欢踢足球，90%的人喜欢打排球，问篮球和足球都喜欢的人有多少，用js实现

function cal(m, n) {
  return `${Math.max(m + n - 100, 0)}%`
}

console.log(cal(70, 80))