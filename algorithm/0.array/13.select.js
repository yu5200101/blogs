
//=>选择排序 时间复杂度：O(n2) 空间复杂度O(1)
// 找到旧数组中的最大值放到数组末尾
function select(ary) {
  let len = ary.length - 1
  while (len) {
    let max = ary[0]
    let maxIndex = 0
    for (let i = 1; i <= len; i++) {
      if (max < ary[i]) {
        max = ary[i]
        maxIndex = i
      }
    }
    const temp = ary[len]
    ary[len] = ary[maxIndex]
    ary[maxIndex] = temp
    len--
  }
  return ary
}

var ary = [12, 6, 25, 18, 49, 21, 80, 46, 90];
console.log('select', select(ary))