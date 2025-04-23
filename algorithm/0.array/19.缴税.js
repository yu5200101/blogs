// 实现一个函数，输入工资，返回应该缴纳的税费其中税率规则如下:
// 0~5000元不需要交税
// 5000~8000元 3%
// 8000~20000元5%
// 20000以上 10%

const RULES = [{
  begin: 0, end: 5000, ratio: 0
}, {
  begin: 5000, end: 8000, ratio: 0.03
}, {
  begin: 8000, end: 20000, ratio: 0.05
}, {
  begin: 20000, ratio: 0.1
}]

const cal = (price) => {
  let total = 0
  const rules = RULES.filter(item => price > item.begin)
  const lastRule = rules.pop()
  total += (price - lastRule.begin) * lastRule.ratio
  return total + rules.reduce((all, cur) => all + (cur.end - cur.begin) * cur.ratio, 0)
}

console.log(cal(8100))
