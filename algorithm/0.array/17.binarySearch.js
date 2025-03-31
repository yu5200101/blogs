// 二分查找，时间复杂度：O(logn)
function binarySearch(arr, target) {
  if (!arr || !arr.length) return -1
  let lowIndex = 0
  let highIndex = arr.length - 1
  while (lowIndex <= highIndex) {
    const midIndex = Math.floor((lowIndex + highIndex) / 2)
    if (target < arr[midIndex]) {
      highIndex = midIndex - 1
    } else if (target > arr[midIndex]) {
      lowIndex = midIndex + 1
    } else {
      // target = arr[midIndex]
      // return midIndex
      // 处理存在重复的元素，找到命中的第一个索引
      if (midIndex === 0 || arr[midIndex - 1] < target) return midIndex
      highIndex = midIndex - 1
    }
  }
  return -1
}

const ary = [1, 2, 3, 4, 4, 5, 6, 7, 8, 9]
console.log(binarySearch(ary, 4))

function search(arr, target) {
  if (!arr || !arr.length) return -1
  let lowIndex = 0
  let highIndex = arr.length - 1
  while (lowIndex <= highIndex) {
    const midIndex = Math.floor((lowIndex + highIndex) / 2)
    if (target === arr[midIndex]) {
      // return midIndex
      // 处理存在重复的元素，找到命中的第一个索引
      if (midIndex === 0 || arr[midIndex - 1] < target) return midIndex
      highIndex = midIndex - 1
    }
    // 左侧是有序的
    if (arr[lowIndex] <= arr[midIndex]) {
      if (target >= arr[lowIndex] && target <= arr[midIndex]) {
        highIndex = midIndex - 1
      } else {
        lowIndex = midIndex + 1
      }
      // 右侧是有序的
    } else {
      if (target >= arr[midIndex] && target <= arr[highIndex]) {
        lowIndex = midIndex + 1
      } else {
        highIndex = midIndex - 1
      }
    }
  }
  return -1
}

const ary1 = [6, 7, 8, 9, 9, 1, 2, 3, 4, 5]
console.log(search(ary1, 9))