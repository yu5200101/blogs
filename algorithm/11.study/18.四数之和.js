/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  if (!nums || nums.length < 4) return []
  let res = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 2] > target) break
    if (nums[i] + nums[nums.length - 3] + nums[nums.length - 2] + nums[nums.length - 1] < target) continue
    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue
      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break
      if (nums[i] + nums[j] + nums[nums.length - 2] + nums[nums.length - 1] < target) continue
      let left = j + 1
      let right = nums.length - 1
      while (left < right) {
        const total = nums[i] + nums[j] + nums[left] + nums[right]
        if (total === target) {
          res.push([nums[i], nums[j], nums[left], nums[right]])
          while (left < right) {
            left++
            if (nums[left] !== nums[left - 1]) break
          }
          while (left < right) {
            right--
            if (nums[right] !== nums[right + 1]) break
          }
        } else if (total < target) {
          left++
        } else {
          right--
        }
      }
    }
  }
  return res
};