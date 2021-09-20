/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  if (!nums || !nums.length) return 0
  let i = 0
  let j = 1
  while (j < nums.length) {
    if (nums[i] !== nums[j]) {
      if (j - i > 0) {
        nums[i + 1] = nums[j]
      }
      i++
    }
    j++
  }
  return i + 1
};