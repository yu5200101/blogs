// 给定一个整数数组，长度不定，如:[1，2，3，4]，设计一个算法，要求你计算出每一项元素中，除了它以外
// 其它元素的乘积。
// 要求，算法中不能使用除法，同时时间复杂度必须控制在0(n)。

const productExceptSelf = function(ary) {
  const len = ary.length
  const result = new Array(len).fill(1)
  for (let i = 1; i < len; i++) {
    result[i] = result[i - 1] * ary[i - 1]
  }
  let R = 1
  for (let i = len - 1; i >= 0; i--) {
    result[i] *= R
    R *= ary[i]
  }
  return result
};