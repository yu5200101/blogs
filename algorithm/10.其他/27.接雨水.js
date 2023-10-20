/*
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

*/
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let sum = 0
  let left = 1
  let maxLeft = 0
  let maxRight = 0
  let right = height.length - 2
  for (let i = 1; i < height.length - 1; i++) {
      if (height[left - 1] < height[right + 1]) {
          maxLeft = Math.max(maxLeft, height[left - 1])
          if (maxLeft > height[left]) {
              sum = sum + maxLeft - height[left]
          }
          left++
      } else {
          maxRight = Math.max(maxRight, height[right + 1])
          if (maxRight > height[right]) {
              sum = sum + maxRight - height[right]
          }
          right--
      }
  }
  return sum
  };