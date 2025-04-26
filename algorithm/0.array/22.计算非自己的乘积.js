// 给定一个整数数组，长度不定，如:[1，2，3，4]，设计一个算法，要求你计算出每一项元素中，除了它以外
// 其它元素的乘积。
// 要求，算法中不能使用除法，同时时间复杂度必须控制在0(n)。

function cal(ary) {
  const len = ary.length
  const beforeList = [1]
  const afterList = new Array(len).fill(1)
  let i = 1
  // 计算左边的乘积
  while(i < len) {
    beforeList[i] = beforeList[i - 1] * ary[i - 1]
    i++
  }
  // 计算右边的乘积
  let j = len - 2
  while(j >= 0) {
    afterList[j] = afterList[j + 1] * ary[j + 1]
    j--
  }
  for(let m = 0; m < ary.length; m++) {
    ary[m] = beforeList[m] * afterList[m]
  }
  return ary
}