/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let len = height.length
  if (len < 2) return 0
  let left = 0
  let right = len - 1
  let total = 0
  while (left < right) {
    let res = Math.min(height[left], height[right]) * (right - left)
    total = Math.max(total, res)
    if (height[left] < height[right]) {
      left++
    } else if (height[left] === height[right]) {
      left++
      right--
    } else {
      right--
    }
  }
  return total
};