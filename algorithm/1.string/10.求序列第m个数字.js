// 算法题:有一个“123456789101112131415 .. n+1"这样的序列，求第 m 个数字，用js实现算法

function getNumber(n, m) {
  // 记录总位数
  let total = 0
  // 最后一位数字
  const num = n + 1
  // 当前数字有多少位
  let digit = 1
  // 头部值 1 10 100
  let start = 1
  // 尾部值 9 99 999
  let end = 9
  // 当前区域有多少数字
  let numCount = 0
  // 计算总位数
  while(num >= start) {
    // 头部到尾部有多少数字
    const curEnd = Math.min(num, end)
    numCount = curEnd - start + 1
    total += numCount * digit
    digit += 1
    start *= 10
    end = start * 10 - 1
  }
  // m大于总位数返回-1
  if (m > total) {
    return -1
  }
  // 计算第m个数字在数字是多少位区域中
  digit = 1
  start = 1
  end = 9
  // 有多少位数字 1 2 两位数字
  numCount = end + start - 1
  // 数字占用的多少位 11 占用2位
  let curNumCount = numCount * digit
  while(m > curNumCount) {
    m -= curNumCount
    digit += 1
    start *= 10
    end = start * 10 - 1
    numCount = end + start - 1
    curNumCount = numCount * digit
  }
  // 计算第m位的总数字和当前数字
  const numInStage = Math.floor((m - 1) / digit)
  const curNum = start + numInStage
  const index = (m - 1) % digit
  return String(curNum).charAt(index)
}
// '1234567891011121314151617181920212223242522627282930'
console.log(getNumber1(19, 30))
