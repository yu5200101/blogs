/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  if (!nums || !nums.length) return 0
  let cur = nums[0]
  let max = cur
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(cur, 0) + nums[i]
    max = Math.max(cur, max)
  }
  return max
};