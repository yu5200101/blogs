
//=>插入排序 时间复杂度：O(n2) 空间复杂度O(1)

// 逐个将未排序的元素插入到已排序部分的适当位置
// 外层循环：从第二个元素开始（i = 1），逐个处理未排序的元素。

// 内层循环：将当前元素 key 与已排序部分的元素从后向前比较，若已排序元素更大则将其右移，直到找到 key 的正确位置。

// 插入操作：在正确位置插入 key，确保左侧元素均小于等于 key，右侧元素均大于 key
function insertionSort(arr) {
  for(let i = 1; i < arr.length; i++) {
    const curVal = arr[i]
    let lastIndex = i - 1
    while(lastIndex >= 0 && curVal < arr[lastIndex]) {
      // 第一次循环的右边的节点：arr[lastIndex + 1] = arr[i - 1 + 1] = arr[i] 所以不影响原值
      // 把当前元素移到右边
      arr[lastIndex + 1] = arr[lastIndex]
      // 每次都往前移动一位
      lastIndex--
    }
    // 由于上面循环的时候lastIndex - 1，所以这时候恢复时需要+1
    // 当前元素的值移到了右边，这时候的值需要替换为比较的初始值
    arr[lastIndex + 1] = curVal
  }
  return arr
}
// 示例用法
var ary = [12, 6, 25, 18, 49, 21, 80, 46, 90];
console.log(insertionSort(ary));