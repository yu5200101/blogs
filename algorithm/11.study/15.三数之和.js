/**
 * @param {number[]} nums
 * @return {number[][]}
 */
 var threeSum = function(nums) {
  if (!nums || nums.length < 3) return []
  let set = []
  nums.sort((a, b) => a - b)
  for(let i = 0; i < nums.length - 2; i++) {
      if(i > 0 && nums[i] === nums[i - 1]) continue
      const target = -nums[i]
      let left = i + 1
      let right = nums.length - 1
      while(left < right) {
          const sum = nums[left] + nums[right]
          if(sum < target) {
              left++
          } else if(sum > target) {
              right--
          } else {
              set.push([nums[i], nums[left], nums[right]])
              while(left < right) {
                  left++
                  if (nums[left - 1] !== nums[left]) break
              }
              while(left < right) {
                  right--
                  if (nums[right + 1] !== nums[right]) break
              }
          }
      }
  }
  return set
};