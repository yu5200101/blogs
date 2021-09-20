/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  if (!nums || !nums.length) return 0
  let first = 0
  let sec = nums[0]
  for (let i = 1; i < nums.length; i++) {
    let temp = Math.max(first, sec)
    sec = first + nums[i]
    first = temp
  }
  return Math.max(first, sec)
};