/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  if (!nums || nums.length < 3) return 0
  nums.sort((a, b) => a - b)
  let temp = nums[0] + nums[1] + nums[2]
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1
    let right = nums.length - 1
    let cur = nums[i]
    while (left < right) {
      let total = cur + nums[left] + nums[right]
      let mix = Math.abs(total - target)
      if (mix < Math.abs(temp - target)) {
        temp = total
      }
      if (total < target) {
        left++
      } else if (total > target) {
        right--
      } else {
        return total
      }
    }
  }
  return temp
};